# Key Metrics & Instrumentation

---

## North Star Metric

**"Leads Captured"** — Total count of unique emails entered after completing an audit

**Why this metric:**
- ✅ Directly tied to Credex partnership value (each email = qualified lead)
- ✅ Hard to game (requires real audit completion + conscious email entry)
- ✅ Leading indicator for revenue (15% of leads → Credex customers)
- ✅ Measures retention (would they re-run audit later? Email list = repeat traffic signal)

**Current target:** 40 leads by Day 30 (from 1,000 audits at 25% email capture rate)

**Celebration threshold:** 50+ leads = clear product-market fit signal

---

## Input Metrics (Funnel)

| Stage | Metric | Target (Month 1) | How to Track |
|-------|--------|------------------|--------------|
| **Awareness** | Page visits | 2,000+ | Google Analytics |
| **Interest** | Start audit clicks | 800+ (40% CTR) | Frontend event tracking |
| **Engagement** | Audits completed | 500+ (62.5% completion) | Supabase audit_reports count |
| **Conversion** | Emails captured | 40+ (8% of audits) | Supabase leads count |
| **Quality** | Credex leads (>$500/mo) | 3+ (7.5% of emails) | Supabase leads where monthly_savings > 500 |

---

## Output Metrics (Business)

| Metric | Target | Formula | Owner |
|--------|--------|---------|-------|
| **Revenue** | $10K month 1 | Credex leads × $1K conversion × 15% close rate | Credex partnership |
| **Email list size** | 40+ | Cumulative unique emails | Email/CRM |
| **Credex consultations booked** | 3+ | Manual follow-up from Credex | Credex sales |
| **Credex deals closed** | 1+ | Deal value × close rate | Credex sales |

---

## Behavioral Metrics (Engagement Quality)

| Behavior | Signal | Action If High | Action If Low |
|----------|--------|----------------|---------------|
| **Re-audit rate** | % of emails who audit 2+ times in month 1 | Sticky engagement; launch benchmarks early | Product not providing value; simplify |
| **Report shares** | Unique URLs as % of audits | Viral loop working | Add more shareable hooks (board badge) |
| **Email open rate** | % of confirmation emails opened | Good list quality | Test subject line variations |
| **Tool overlap detection** | % of audits flagging 2+ same-category tools | Common problem | Reassess rules; maybe too strict |
| **Credex flag rate** | % of audits recommending Credex (>$500 spend) | High partnership opportunity | Adjust threshold |

---

## Instrumentation (Events to Track)

### Core Events

```javascript
// On audit page load
track('audit_page_loaded', {
  referrer: document.referrer,
  device: 'mobile' | 'desktop'
})

// On tool added
track('tool_added', {
  tool_name: 'Cursor',
  plan_selected: 'Pro',
  num_seats: 5
})

// On audit submitted
track('audit_submitted', {
  total_tools: 8,
  total_monthly_spend: 1200,
  duration_ms: 2345
})

// On audit completed
track('audit_completed', {
  monthly_savings: 240,
  annual_savings: 2880,
  llm_success: true,
  biggest_opportunity: 'overlap_detection'
})

// On email captured
track('email_captured', {
  role: 'CTO',
  team_size: 20,
  credex_eligible: true // spend > $500
})
```

---

## Dashboards (Daily Check-In)

### Dashboard 1: Daily Health
```
Visits: [N]
Audits started: [N]
Audits completed: [N]
Completion rate: [%] (target: >60%)
Emails captured: [N] (target: >5% of completions)
Credex flags: [N]
```

### Dashboard 2: Monthly Funnel
```
Visits → Audits started → Audits completed → Emails captured
2,000  →      800 (40%)  →      500 (62.5%) →      40 (8%)
```

---

## Pivot Triggers

| Signal | Threshold | Action |
|--------|-----------|--------|
| **Completion rate drop** | <40% for 3 days | Simplify form |
| **Email capture drop** | <5% for 1 week | Test new CTA copy |
| **High bounce rate** | >70% on hero | A/B test headline |
| **Zero Credex qualification** | <5% of audits | Rethink product |

---

## Analytics Stack

**Simple & ownable:**
- **Traffic:** Google Analytics (free)
- **Custom events:** PostHog (free tier with SQL queries)
- **Database:** Supabase leads table (direct SQL)
- **Revenue:** Manual spreadsheet initially

**Why:** Avoid tool bloat at MVP stage. SQL queries > BI dashboard.

---

## What We'll Know by Day 7

✅ Completion rate > 60% → Form is good  
✅ Email capture > 5% → Value prop is clear  
✅ 3+ Credex flags → Product logic works  
✅ 1+ organic traffic source → GTM is working  
✅ 0 pricing accuracy complaints → Data is correct

All five = ready to scale. If any fails = debug first.

This matches the product's job better than DAU because teams may only audit their AI stack quarterly. Savings discovered also predicts Credex sales opportunities.

## Input Metrics

- Audit starts.
- Audit completions.
- Number of paid tools entered per audit.
- Share-link creations.
- Email capture rate.
- High-savings rate above $500/month.
- Consultation click or request rate.

## First Instrumentation

Track `audit_started`, `tool_added`, `audit_completed`, `summary_generated`, `report_shared`, `lead_captured`, and `credex_fit_shown`.

## Pivot Trigger

If fewer than 10% of completed audits produce either an email capture or a share action after 300 audits, the tool is not creating enough trust or urgency. I would then tighten the input flow and show more vendor-specific evidence before asking for email.
