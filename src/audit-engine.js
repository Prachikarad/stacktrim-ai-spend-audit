import { getPlan, getTool, TOOL_CATALOG } from './pricing-data.js';

const CODING_TOOLS = new Set(['cursor', 'github-copilot', 'windsurf']);
const CHAT_TOOLS = new Set(['claude', 'chatgpt', 'gemini']);

export function money(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2
  }).format(Math.max(0, value || 0));
}

export function planSpend(toolId, planId, seats, enteredSpend) {
  const plan = getPlan(toolId, planId);
  if (!plan || plan.monthly === null) return Number(enteredSpend) || 0;
  if (plan.seatBased) return plan.monthly * Math.max(1, Number(seats) || 1);
  return plan.monthly;
}

function sameVendorDowngrade(row, teamSize, useCase) {
  const plan = getPlan(row.toolId, row.planId);
  const tool = getTool(row.toolId);
  if (!plan || !tool) return null;

  const seats = Math.max(1, Number(row.seats) || 1);
  const currentSpend = planSpend(row.toolId, row.planId, seats, row.monthlySpend);
  const individualPlan = tool.plans.find((candidate) =>
    ['pro', 'plus', 'pro-plus'].includes(candidate.id) && candidate.monthly !== null
  );
  const teamPlan = tool.plans.find((candidate) =>
    ['teams', 'team', 'business'].includes(candidate.id) && candidate.monthly !== null
  );

  if (plan.monthly === null && currentSpend > seats * 40 && teamPlan) {
    const target = teamPlan.monthly * seats;
    return {
      action: `Move to ${tool.name} ${teamPlan.name} unless enterprise controls are required`,
      savings: Math.max(0, currentSpend - target),
      reason: `Custom or API-like spend is above the transparent ${teamPlan.name} seat price for ${seats} seats.`
    };
  }

  if (teamPlan && plan.id === teamPlan.id && seats < 5 && individualPlan && useCase !== 'mixed') {
    const target = individualPlan.monthly * seats;
    return {
      action: `Downgrade light users to ${tool.name} ${individualPlan.name}`,
      savings: Math.max(0, currentSpend - target),
      reason: `${teamPlan.name} is usually overkill below five seats unless admin controls, SSO, or shared billing matter.`
    };
  }

  if (['ultra', 'max', 'max-20x', 'pro'].includes(plan.id) && useCase !== 'coding' && currentSpend >= seats * 100) {
    const cheaper = tool.plans.find((candidate) => ['pro', 'plus'].includes(candidate.id) && candidate.monthly);
    if (cheaper && cheaper.id !== plan.id) {
      const target = cheaper.monthly * seats;
      return {
        action: `Trial ${tool.name} ${cheaper.name} for non-heavy users`,
        savings: Math.max(0, currentSpend - target),
        reason: `The current power-user plan is hard to justify for ${useCase} work without repeated limit exhaustion.`
      };
    }
  }

  return null;
}

function overlapRecommendation(row, allRows) {
  const currentSpend = planSpend(row.toolId, row.planId, row.seats, row.monthlySpend);
  if (!currentSpend) return null;

  const codingCount = allRows.filter((item) => CODING_TOOLS.has(item.toolId)).length;
  if (CODING_TOOLS.has(row.toolId) && codingCount > 1) {
    return {
      action: 'Consolidate coding assistants for duplicate seats',
      savings: currentSpend * 0.35,
      reason: 'Multiple coding agents on the same seats often means overlapping autocomplete, chat, and agent capacity.'
    };
  }

  const chatCount = allRows.filter((item) => CHAT_TOOLS.has(item.toolId)).length;
  if (CHAT_TOOLS.has(row.toolId) && chatCount > 2) {
    return {
      action: 'Keep one primary chat workspace and one specialist tool',
      savings: currentSpend * 0.25,
      reason: 'Three or more general chat subscriptions usually create unused seats before they create more output.'
    };
  }

  return null;
}

function creditOpportunity(row) {
  const currentSpend = planSpend(row.toolId, row.planId, row.seats, row.monthlySpend);
  if (currentSpend < 500) return null;
  const tool = getTool(row.toolId);
  return {
    action: 'Route eligible usage through discounted AI credits',
    savings: currentSpend * 0.3,
    reason: `${tool?.name || 'This vendor'} spend is high enough that discounted infrastructure credits could beat retail billing.`
  };
}

export function auditSpend(input) {
  const rows = (input.tools || []).filter((row) => row.toolId && row.planId);
  const teamSize = Math.max(1, Number(input.teamSize) || 1);
  const useCase = input.primaryUse || 'mixed';

  const results = rows.map((row) => {
    const currentSpend = planSpend(row.toolId, row.planId, row.seats, row.monthlySpend);
    const candidates = [
      sameVendorDowngrade(row, teamSize, useCase),
      overlapRecommendation(row, rows),
      creditOpportunity(row)
    ].filter(Boolean);
    const best = candidates.sort((a, b) => b.savings - a.savings)[0] || {
      action: 'Keep current setup',
      savings: 0,
      reason: 'Spend appears aligned with the selected plan and usage profile.'
    };

    return {
      id: row.id,
      toolId: row.toolId,
      toolName: getTool(row.toolId)?.name || row.toolId,
      planName: getPlan(row.toolId, row.planId)?.name || row.planId,
      seats: Number(row.seats) || 1,
      currentSpend,
      action: best.action,
      savings: Math.round(best.savings),
      annualSavings: Math.round(best.savings * 12),
      reason: best.reason,
      sourceUrl: getTool(row.toolId)?.sourceUrl
    };
  });

  const monthlySavings = results.reduce((sum, result) => sum + result.savings, 0);
  const currentMonthly = results.reduce((sum, result) => sum + result.currentSpend, 0);

  return {
    companyName: input.companyName || '',
    teamSize,
    primaryUse: useCase,
    currentMonthly,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    credexFit: monthlySavings >= 500,
    results,
    generatedAt: new Date().toISOString()
  };
}

export function publicReportPayload(input, audit) {
  return {
    teamSize: audit.teamSize,
    primaryUse: audit.primaryUse,
    tools: (input.tools || []).map(({ id, toolId, planId, seats, monthlySpend }) => ({
      id,
      toolId,
      planId,
      seats,
      monthlySpend
    })),
    audit: {
      currentMonthly: audit.currentMonthly,
      monthlySavings: audit.monthlySavings,
      annualSavings: audit.annualSavings,
      credexFit: audit.credexFit,
      results: audit.results
    }
  };
}

export function fallbackSummary(audit) {
  if (!audit.results?.length) return 'Add at least one paid AI tool to generate a useful audit.';
  const strongest = [...audit.results].sort((a, b) => b.savings - a.savings)[0];
  if (audit.monthlySavings <= 0) {
    return `Your AI stack looks reasonably efficient for a ${audit.teamSize}-person team. Keep reviewing usage monthly, especially when vendors change limits or add new seats.`;
  }
  return `This ${audit.teamSize}-person team can likely save ${money(audit.monthlySavings)} per month, mostly by acting on ${strongest.toolName}: ${strongest.action.toLowerCase()}. The recommendations avoid fake savings and focus on plan fit, duplicate capacity, and credit opportunities.`;
}

export { TOOL_CATALOG };
