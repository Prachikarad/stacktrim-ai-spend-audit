# Test Plan & Inventory

---

## Running Tests

```bash
npm install  # Install dependencies
npm test     # Run all tests (Vitest)
```

---

## Unit Tests (audit-engine.test.js)

**8 tests covering core business logic:**

### Test 1: Plan-Fit Downgrade (Same Vendor)
```javascript
test('recommends downgrade for small team on Team plan', () => {
  const audit = auditSpend({
    tools: [
      { id: 'cursor', plan: 'Teams', seats: 3, customSpend: 0 }
    ],
    teamSize: 3
  });
  
  expect(audit.tools[0].recommendation.action)
    .toBe('Downgrade Cursor Teams (3 seats) → Pro (3 × $20 = $60/mo)');
  expect(audit.tools[0].recommendation.savings).toBe(40);
});
```

**Why it matters:** Most common saving opportunity. If this breaks, we're recommending expensive plans to small teams.

---

### Test 2: Tool Overlap Detection
```javascript
test('flags duplicate coding assistants', () => {
  const audit = auditSpend({
    tools: [
      { id: 'cursor', plan: 'Pro', seats: 8, customSpend: 0 },
      { id: 'copilot', plan: 'Business', seats: 8, customSpend: 0 },
      { id: 'windsurf', plan: 'Pro', seats: 8, customSpend: 0 }
    ],
    teamSize: 8
  });
  
  expect(audit.overlaps).toContain('3+ coding assistants');
  expect(audit.totalSavings).toBeGreaterThan(100);
});
```

**Why it matters:** Overlap is #1 user feedback from interviews. Must detect 2+ of same category.

---

### Test 3: Credit Opportunity Flag
```javascript
test('recommends Credex for high API spend', () => {
  const audit = auditSpend({
    tools: [
      { id: 'openai-api', plan: 'Usage', seats: 1, customSpend: 1200 }
    ],
    teamSize: 5
  });
  
  expect(audit.credexOpportunity).toBe(true);
  expect(audit.tools[0].recommendation.action)
    .toContain('Credex');
});
```

**Why it matters:** Partnership revenue depends on us flagging high-spend cases. If this fails, Credex leads dry up.

---

### Test 4: Zero Spend Edge Case
```javascript
test('handles user with $0 spend gracefully', () => {
  const audit = auditSpend({
    tools: [
      { id: 'cursor', plan: 'Free', seats: 0, customSpend: 0 },
      { id: 'copilot', plan: 'Free', seats: 0, customSpend: 0 }
    ],
    teamSize: 5
  });
  
  expect(audit.totalSavings).toBe(0);
  expect(audit.tools.length).toBeGreaterThan(0); // Don't crash
});
```

**Why it matters:** Prevents "0 spend = app is broken" customer issue.

---

### Test 5: Missing Pricing Data Fallback
```javascript
test('uses fallback price if tool pricing not found', () => {
  const audit = auditSpend({
    tools: [
      { id: 'unknown-tool', plan: 'Premium', seats: 5, customSpend: 100 }
    ],
    teamSize: 5
  });
  
  expect(audit.tools[0].pricing).toBe('UNKNOWN');
  expect(audit.totalSavings).toBe(0); // No savings without known pricing
});
```

**Why it matters:** Users might enter custom tools. We gracefully handle unknown cases instead of crashing.

---

### Test 6: Usage-Case Mismatch
```javascript
test('recommends downgrade for non-coding use case on Max plan', () => {
  const audit = auditSpend({
    tools: [
      { id: 'claude', plan: 'Max', seats: 1, customSpend: 200 }
    ],
    primaryUseCase: 'writing', // Not coding
    teamSize: 1
  });
  
  expect(audit.tools[0].recommendation.action)
    .toContain('Claude Max for writing is overkill');
  expect(audit.tools[0].recommendation.savings).toBe(80);
});
```

**Why it matters:** Interviews showed finance/writing teams waste money on ultra-high tiers they don't need.

---

### Test 7: Annual Savings Calculation
```javascript
test('calculates annual savings correctly', () => {
  const audit = auditSpend({
    tools: [
      { id: 'cursor', plan: 'Teams', seats: 3, customSpend: 0 }
    ],
    teamSize: 3
  });
  
  expect(audit.totalMonthlySavings).toBe(40);
  expect(audit.totalAnnualSavings).toBe(480); // 40 × 12
});
```

**Why it matters:** Board presentations care about annual numbers. Math must be correct.

---

### Test 8: Team Size Boundary
```javascript
test('handles edge case: team size = plan minimum (5 for Teams)', () => {
  const audit = auditSpend({
    tools: [
      { id: 'cursor', plan: 'Teams', seats: 5, customSpend: 0 }
    ],
    teamSize: 5
  });
  
  // Should NOT recommend downgrade (already optimal)
  expect(audit.tools[0].recommendation).toBe(null);
  expect(audit.totalSavings).toBe(0);
});
```

**Why it matters:** Boundary conditions are where logic breaks. If this fails, we'll recommend downgrading already-optimal plans.

---

## Integration Tests (form → audit flow)

### Test 9: Form Input → Audit Output
```javascript
test('form input produces valid audit output', async () => {
  const formData = {
    tools: [
      { tool: 'cursor', plan: 'Pro', seats: 5, spend: 0 }
    ],
    teamSize: 5
  };
  
  const audit = auditSpend(formData);
  
  expect(audit).toHaveProperty('totalSavings');
  expect(audit).toHaveProperty('recommendations');
  expect(audit.recommendations.length).toBeGreaterThan(0);
});
```

---

## Acceptance Tests (Manual)

These require human validation; not automated:

- [ ] LLM summary generates within 2 seconds
- [ ] Shareable URL encodes audit data correctly
- [ ] Email confirmation arrives within 5 minutes
- [ ] Lighthouse scores: Performance 85+, Accessibility 90+, Best Practices 90+
- [ ] Mobile form is keyboard-navigable (no scrolling off-screen)

---

## Coverage Targets

- **Audit engine:** 90%+ (core logic must be bulletproof)
- **LLM service:** 70% (API failures are OK; fallback works)
- **Supabase service:** 70% (integration tests optional; manual testing OK)

---

## CI/CD Integration

GitHub Actions (.github/workflows/ci.yml) runs:
```bash
npm run lint
npm run test  # Must pass all 8 tests
npm run build
```

Green check = safe to deploy.

---

## What "Passing All Tests" Means

✅ Audit logic is mathematically correct  
✅ Edge cases are handled  
✅ No false negatives (missing savings opportunities)  
✅ No false positives (recommending waste)  
✅ Build is successful (no TypeScript/ESLint errors)  

---

## Future Test Coverage (Week 2+)

- [ ] LLM prompt quality (do summaries match audit data?)
- [ ] Email delivery (Resend integration)
- [ ] Rate limiting (can't spam audits)
- [ ] Database query performance (Supabase indexes working)
- [ ] API latency (ensure <2s end-to-end)


| File | Covers |
| --- | --- |
| `tests/audit-engine.test.js` | Seat-based spend calculation |
| `tests/audit-engine.test.js` | Custom API spend handling |
| `tests/audit-engine.test.js` | Duplicate coding tool recommendation |
| `tests/audit-engine.test.js` | Credex fit for high-savings audits |
| `tests/audit-engine.test.js` | Summary fallback when savings are low |
