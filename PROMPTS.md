# LLM Prompts & Iterations

**Model:** Anthropic Claude 3.5 Sonnet  
**Purpose:** Generate personalized 90-110 word audit summaries  
**Cost:** ~$0.01 per audit summary (5K tokens @ $0.003 input)  
**Fallback:** Hardcoded template (zero cost, deterministic)

---

## Final Prompt (v3)

The app sends the following to Anthropic when `VITE_ANTHROPIC_API_KEY` is configured:

```
You are a financial advisor for startup spending. Analyze this AI tool audit and write a 90-110 word personalized summary for the user.

Tool Summary: [list of tools, recommendations, monthly savings]
Team Size: [N] people
Primary Use Case: [coding/writing/data/research/mixed]
Monthly Savings Identified: $[X]
Annualized: $[Y]

Write a friendly but direct summary that:
1. Acknowledges what they're doing well
2. Highlights the biggest opportunity
3. Motivates them to act on savings

Be specific, not generic. Sound like a peer advisor, not corporate.
```

### Example Output

```
Your 12-person team is paying for overlapping coding assistants—Cursor Pro, Copilot Business, and Windsurf. Consolidating to Cursor Teams saves $480/month alone. Downgrading ChatGPT Plus to Pro on non-heavy users saves another $180/month. That's $7,920/year you could redirect to hiring or infrastructure. Credex credits could beat your OpenAI API bill by another 30%. Act now before your board asks why you're overspending.
```

---

## Iteration History

### v1: Original (Too Generic)

**Prompt:**
```
Analyze this AI tool audit for a startup and provide feedback.
[tool data]

Write a summary.
```

**Problem:** Outputs were corporate speak. "Consider evaluating your subscription portfolio." No specificity.

**Failure case:** User had Cursor + Copilot + ChatGPT; output said "multiple tools can provide overlapping value" instead of naming the actual $500/month overlap.

---

### v2: Added Constraints (Better, but Wordy)

**Prompt:**
```
Write exactly 100 words analyzing this AI spending audit.

[audit data]

Output must:
- Start with a specific savings number
- Name the biggest opportunity by tool
- End with a call-to-action

Use conversational tone. Avoid jargon.
```

**Problem:** Still generic; "multiple tools" instead of naming them. Word count constraint too rigid.

**Failure case:** Small team with low spend → output suggested "Consider consulting with a cost advisor" instead of "You're spending well; no changes needed."

---

### v3: Peer Advisor Tone + Flexibility (Final)

**Key improvements:**
- "Peer advisor" tone → less corporate, more "I'm helping a friend"
- Specific tool summaries in prompt → model names actual tools
- Three-part structure → ensures completeness without over-constraining
- 90–110 word range → flexibility; 100-word straitjacket removed

**Success cases:**
- Small team, low spend: "You're spending efficiently for 4 people."
- High overlap: "Three coding assistants for 8 engineers = $520/month wasted. Pick one; save $480."
- API opportunity: "OpenAI API bill is $1.2K/month; Credex credits cut that 30-40%."

---

## Why This Approach (Not Other Options)

### ✅ AI for Summary Only, Not Recommendations

**Why:** The audit logic must be defensible. "Use Claude to determine if Cursor is better than Copilot" sounds good until:
- Same input gives different outputs (non-deterministic)
- Finance audit trail breaks ("Why did the AI recommend X?")
- Marketing team can't verify claims

**Our approach:** Hardcoded rules (defensible) + AI for summary (creative, low-stakes).

### ✅ Specific Tool Names in Prompt

**Why:** Without them, Claude generalizes ("various tools," "platforms"). With them, it's personal ("Your Cursor Teams + Copilot Business overlap").

### ✅ Three-Part Structure

**Why:** Ensures the summary hits all the moments:
1. Validation (what they're doing well) → engagement
2. Biggest opportunity → attention
3. Motivation → action

Without structure, Claude hedges with "consider" and "might want to." With structure, it commits.

---

## Fallback Template (Used if API Fails)

```javascript
function fallbackSummary(auditData) {
  const { tools, teamSize, monthlySavings } = auditData;
  const biggest = tools.sort(
    (a, b) =>
      (b.recommendation?.savings || 0) - (a.recommendation?.savings || 0)
  )[0];

  if (monthlySavings < 100) {
    return `Your ${teamSize}-person team is spending efficiently on AI tools. You're on the right plans for your use case. Keep an eye on team growth—if you double in size, revisit tool consolidation.`;
  }

  if (monthlySavings > 1000) {
    return `Your team is paying ~$${(monthlySavings * 12).toLocaleString()} annually for tools. The biggest opportunity: ${biggest?.recommendation?.action}. That alone saves $${Math.round(biggest?.recommendation?.savings * 12).toLocaleString()}/year. Credex credits could unlock even more savings. Get in touch.`;
  }

  return `Your team of ${teamSize} is spending on ${tools.length} AI subscriptions. The biggest opportunity: ${biggest?.recommendation?.action}—save $${Math.round(biggest?.recommendation?.savings)}/month. Consolidate where possible; route high-spend APIs through Credex credits.`;
}
```

**Design:** Branches on spend level; always gives actionable insight; no apology for API failure.

---

## Cost & Scaling

| Metric | Value |
|--------|-------|
| Anthropic Claude 3.5 Sonnet per audit | ~$0.009 |
| Fallback (hardcoded) per audit | $0.000 |
| Monthly at 1000 audits | ~$9 |
| Annually at 12K audits | ~$108 |

**At 10k audits/day scaling:**
- Cache identical audit patterns (don't re-summarize)
- Batch API calls (not per-user sync)
- Switch to Claude 3 Haiku (~$0.0008 per audit) if cost-prohibitive

---

## Monitoring

**Track:**
- Anthropic API latency (alert if >2s)
- Fallback trigger rate (alert if >5%)
- User satisfaction on summaries (manual review, first 20 audits)

**Future v4 improvements:**
- Add user industry (e.g., "YC-backed healthcare" vs "bootstrapped SaaS")
- Tailor to stage (pre-seed vs Series A unit economics)
- Mention compliance/security benefits if spending on regulated tools
