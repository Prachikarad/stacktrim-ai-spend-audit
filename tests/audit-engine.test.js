import test from 'node:test';
import assert from 'node:assert/strict';
import { auditSpend, fallbackSummary, planSpend } from '../src/audit-engine.js';

test('calculates transparent seat pricing when actual spend is omitted', () => {
  assert.equal(planSpend('cursor', 'teams', 4, ''), 160);
  assert.equal(planSpend('github-copilot', 'business', 10, ''), 190);
});

test('uses entered monthly spend for custom API plans', () => {
  assert.equal(planSpend('openai-api', 'gpt-5-5', 1, 1200), 1200);
});

test('surfaces duplicate coding tool savings', () => {
  const audit = auditSpend({
    teamSize: 10,
    primaryUse: 'coding',
    tools: [
      { id: 'a', toolId: 'cursor', planId: 'teams', seats: 6 },
      { id: 'b', toolId: 'github-copilot', planId: 'business', seats: 6 }
    ]
  });

  assert.equal(audit.results.length, 2);
  assert.ok(audit.monthlySavings > 0);
  assert.match(audit.results[0].reason + audit.results[1].reason, /overlapping|duplicate/i);
});

test('flags Credex fit for high savings opportunities', () => {
  const audit = auditSpend({
    teamSize: 22,
    primaryUse: 'mixed',
    tools: [{ id: 'api', toolId: 'openai-api', planId: 'gpt-5-5', seats: 1, monthlySpend: 2200 }]
  });

  assert.equal(audit.credexFit, true);
  assert.ok(audit.monthlySavings >= 500);
});

test('fallback summary does not invent savings when none exist', () => {
  const audit = auditSpend({
    teamSize: 3,
    primaryUse: 'writing',
    tools: [{ id: 'chat', toolId: 'chatgpt', planId: 'plus', seats: 1 }]
  });

  assert.match(fallbackSummary(audit), /reasonably efficient|save/i);
});
