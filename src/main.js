import './styles.css';
import { auditSpend, fallbackSummary, money, publicReportPayload, TOOL_CATALOG } from './audit-engine.js';
import { PRICING_AS_OF } from './pricing-data.js';
import { decodeReport, encodeReport, loadDraft, saveDraft } from './storage.js';

const $ = (selector) => document.querySelector(selector);
const state = loadInitialState();
let latestAudit = null;

function blankTool(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    toolId: 'cursor',
    planId: 'pro',
    seats: 3,
    monthlySpend: '',
    ...overrides
  };
}

function sampleState() {
  return {
    companyName: 'Northstar Analytics',
    teamSize: 14,
    primaryUse: 'coding',
    tools: [
      blankTool({ toolId: 'cursor', planId: 'teams', seats: 4 }),
      blankTool({ toolId: 'github-copilot', planId: 'business', seats: 9 }),
      blankTool({ toolId: 'chatgpt', planId: 'business', seats: 12 }),
      blankTool({ toolId: 'openai-api', planId: 'gpt-5-5', seats: 1, monthlySpend: 1200 })
    ]
  };
}

function loadInitialState() {
  const params = new URLSearchParams(location.search);
  const shared = params.get('report') ? decodeReport(params.get('report')) : null;
  if (shared?.tools) {
    return {
      companyName: '',
      teamSize: shared.teamSize || 8,
      primaryUse: shared.primaryUse || 'mixed',
      tools: shared.tools
    };
  }
  return loadDraft() || {
    companyName: '',
    teamSize: 8,
    primaryUse: 'coding',
    tools: [blankTool()]
  };
}

function toolOptions(selected) {
  return TOOL_CATALOG.map(
    (tool) => `<option value="${tool.id}" ${tool.id === selected ? 'selected' : ''}>${tool.name}</option>`
  ).join('');
}

function planOptions(toolId, selected) {
  const tool = TOOL_CATALOG.find((item) => item.id === toolId) || TOOL_CATALOG[0];
  return tool.plans
    .map((plan) => {
      const price = plan.monthly === null ? 'custom' : money(plan.monthly);
      return `<option value="${plan.id}" ${plan.id === selected ? 'selected' : ''}>${plan.name} (${price})</option>`;
    })
    .join('');
}

function renderToolRows() {
  $('#toolRows').innerHTML = state.tools
    .map(
      (row) => `
        <article class="tool-row" data-id="${row.id}">
          <label>
            Tool
            <select data-field="toolId">${toolOptions(row.toolId)}</select>
          </label>
          <label>
            Plan
            <select data-field="planId">${planOptions(row.toolId, row.planId)}</select>
          </label>
          <label>
            Seats
            <input data-field="seats" type="number" min="1" value="${row.seats}" />
          </label>
          <label>
            Actual monthly spend
            <input data-field="monthlySpend" type="number" min="0" placeholder="optional" value="${row.monthlySpend ?? ''}" />
          </label>
          <button class="icon-button" data-remove="${row.id}" type="button" aria-label="Remove tool">×</button>
        </article>
      `
    )
    .join('');
}

function syncForm() {
  $('#companyName').value = state.companyName;
  $('#teamSize').value = state.teamSize;
  $('#primaryUse').value = state.primaryUse;
  renderToolRows();
}

function collectCompanyFields() {
  state.companyName = $('#companyName').value.trim();
  state.teamSize = Number($('#teamSize').value) || 1;
  state.primaryUse = $('#primaryUse').value;
}

function persist() {
  saveDraft(state);
}

async function generateSummary(audit) {
  try {
    const response = await fetch('/api/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audit })
    });
    if (!response.ok) throw new Error('summary failed');
    const data = await response.json();
    return data.summary || fallbackSummary(audit);
  } catch {
    return fallbackSummary(audit);
  }
}

async function runAudit() {
  collectCompanyFields();
  persist();
  latestAudit = auditSpend(state);
  renderAudit(latestAudit);
  $('#aiSummary').textContent = 'Generating summary...';
  $('#aiSummary').textContent = await generateSummary(latestAudit);
}

function renderAudit(audit) {
  $('#monthlySavings').textContent = money(audit.monthlySavings);
  $('#annualSavings').textContent = money(audit.annualSavings);
  $('#credexFlag').textContent = audit.credexFit ? 'Yes' : 'No';
  $('#heroMonthly').textContent = money(audit.monthlySavings);
  const annualBadge = document.getElementById('heroAnnualBadge');
  if (annualBadge) annualBadge.textContent = money(audit.annualSavings) + ' / yr';
  $('#insightCards').innerHTML = [...audit.results]
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 3)
    .map(
      (result, index) => `
        <article class="insight-card ${result.savings > 0 ? 'has-savings' : ''}">
          <div class="insight-rank">0${index + 1}</div>
          <div>
            <span class="tag">${result.savings > 0 ? 'Savings lever' : 'Looks healthy'}</span>
            <h3>${result.toolName}</h3>
            <p>${result.action}</p>
          </div>
          <div class="insight-money">
            <strong>${money(result.savings)}</strong>
            <small>per month</small>
          </div>
        </article>
      `
    )
    .join('');

  $('#resultsBody').innerHTML =
    audit.results
      .map(
        (result) => `
          <tr>
            <td><strong>${result.toolName}</strong><small>${result.planName}, ${result.seats} seats</small></td>
            <td>${money(result.currentSpend)}</td>
            <td><span class="tag">${result.savings > 0 ? 'Optimize' : 'Keep'}</span><br />${result.action}</td>
            <td class="savings-cell"><strong>${money(result.savings)}</strong><small>${money(result.annualSavings)} / yr</small></td>
            <td>${result.reason} <a href="${result.sourceUrl}" target="_blank" rel="noreferrer">Source</a></td>
          </tr>
        `
      )
      .join('') || '<tr><td colspan="5">Add tools to see recommendations.</td></tr>';
}

function renderSources() {
  $('#pricingDate').textContent = `Pulled ${PRICING_AS_OF}`;
  $('#sourceList').innerHTML = TOOL_CATALOG.map(
    (tool) => `
      <a href="${tool.sourceUrl}" target="_blank" rel="noreferrer">
        <strong>${tool.name}</strong>
        <span>${tool.sourceUrl}</span>
      </a>
    `
  ).join('');
}

function updateTool(rowId, field, value) {
  const row = state.tools.find((item) => item.id === rowId);
  if (!row) return;
  row[field] = field === 'seats' ? Number(value) || 1 : value;
  if (field === 'toolId') {
    row.planId = TOOL_CATALOG.find((tool) => tool.id === value)?.plans[0].id || '';
    renderToolRows();
  }
  persist();
}

async function copyReportLink() {
  if (!latestAudit) await runAudit();
  const payload = publicReportPayload(state, latestAudit);
  const url = `${location.origin}${location.pathname}?report=${encodeURIComponent(encodeReport(payload))}`;
  await navigator.clipboard.writeText(url);
  $('#shareReport').textContent = 'Copied';
  setTimeout(() => {
    $('#shareReport').textContent = 'Copy report link';
  }, 1400);
}

async function submitLead(event) {
  event.preventDefault();
  if (!latestAudit) await runAudit();
  const lead = {
    email: $('#leadEmail').value.trim(),
    role: $('#leadRole').value.trim(),
    companyName: state.companyName,
    teamSize: state.teamSize,
    audit: latestAudit
  };
  $('#leadStatus').textContent = 'Saving...';
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    if (!response.ok) throw new Error('lead failed');
    $('#leadStatus').textContent = 'Saved. Check your inbox if email is configured.';
  } catch {
    const saved = JSON.parse(localStorage.getItem('stacktrim-leads') || '[]');
    saved.push({ ...lead, capturedAt: new Date().toISOString() });
    localStorage.setItem('stacktrim-leads', JSON.stringify(saved));
    $('#leadStatus').textContent = 'Saved locally. Server email is not configured in this environment.';
  }
}

document.addEventListener('input', (event) => {
  const companyFields = ['companyName', 'teamSize', 'primaryUse'];
  if (companyFields.includes(event.target.id)) {
    collectCompanyFields();
    persist();
  }
  const row = event.target.closest('.tool-row');
  if (row && event.target.dataset.field) {
    updateTool(row.dataset.id, event.target.dataset.field, event.target.value);
  }
});

document.addEventListener('click', (event) => {
  if (event.target.id === 'addTool') {
    state.tools.push(blankTool());
    renderToolRows();
    persist();
  }
  if (event.target.id === 'loadSample') {
    Object.assign(state, sampleState());
    syncForm();
    runAudit();
  }
  if (event.target.id === 'heroSample') {
    Object.assign(state, sampleState());
    syncForm();
    runAudit();
    document.querySelector('#report').scrollIntoView({ behavior: 'smooth' });
  }
  if (event.target.id === 'runAudit') runAudit();
  if (event.target.id === 'shareReport') copyReportLink();
  if (event.target.id === 'printReport') window.print();
  if (event.target.dataset.remove) {
    state.tools = state.tools.filter((row) => row.id !== event.target.dataset.remove);
    if (!state.tools.length) state.tools.push(blankTool());
    renderToolRows();
    persist();
  }
});

$('#leadForm').addEventListener('submit', submitLead);

syncForm();
renderSources();
runAudit();