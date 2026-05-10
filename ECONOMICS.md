# Unit Economics & Business Model

---

## Lead Value to Credex

**Who becomes a lead:** Someone who completes an audit, enters their email, and has >$500/month in AI tool spend (flagged as "credit opportunity").

**Lead quality factors:**
- ✅ Pre-screened by spend level (no tire-kickers)
- ✅ Proven engagement (completed 2-minute audit; not a drive-by)
- ✅ Identified a specific problem (overspending on APIs or tool stacks)
- ❌ Not yet qualified by Credex sales (could churn before consultation)

**Typical lead value (Credex perspective):**
- **Average annual value if converted to customer:** $15K–$50K in credits sold
- **Conversion rate (lead → customer):** 15% after Credex consultation
- **Average deal size:** $25K annual value (3-year credits at typical 30% discount)
- **Calculation:** 1 lead × 15% conversion × $25K deal = $3,750 expected lifetime value

**Implied CAC (Credex standpoint):**
- If Credex paid StackTrim $100 per qualified lead, CAC = $100
- Break-even if: $100 / $3,750 = 2.7% conversion
- **Actual target:** 15% conversion = $25 effective CAC (excellent)

---

## Customer Acquisition Cost (CAC) by Channel

| Channel | Audits/Month | Email Capture Rate | Credex Leads | CAC Paid | CAC Calc |
|---------|--------------|-------------------|--------------|----------|----------|
| **Twitter DMs** | 40 | 40% | 1.6 | $0 | 40 DMs × 5 min = $3/hour labor = $3 per lead |
| **Indie Hackers** | 60 | 35% | 2.1 | $0 | 2 posts × 30 min = $1 per lead |
| **Reddit** | 30 | 30% | 0.9 | $0 | Organic; ~$1.50 per lead |
| **Hacker News** | 200 | 20% | 4 | $0 | 1 post × 1 hour = $0.25 per lead |
| **Product Hunt** | 500 | 15% | 7.5 | $400 | $400 / 500 = $0.80 per audit; ~$53 per lead |
| **LinkedIn** | 50 | 25% | 1.25 | $0 | Organic; ~$2 per lead |
| **Weighted Average** | **880 audits** | **~25%** | **~17 leads** | **~$400** | **~$24 per lead** |

**Key insight:** Our CAC is $0–5 per lead for organic channels (Twitter, Reddit, Hacker News, Indie Hackers). Product Hunt costs $50/lead but gives credibility and volume. Overall average: $24 per lead if we do Product Hunt in Month 2.

---

## Conversion Rates (Top → Bottom)

**Funnel:**
```
1000 audits completed (baseline: assume users interested in spending data)
  ↓ 25% enter email (conversion 1)
  250 leads captured
  ↓ 7.5% curious about Credex (spend >$500/month)
  19 qualify as Credex leads
  ↓ 15% book consultation call (conversion 2)
  3 consultation bookings
  ↓ 60% purchase credits (conversion 3)
  1.8 ≈ 2 customers converted per 1,000 audits
```

**Monthly impact at steady state (1,000 audits/month):**
- 250 emails captured
- 19 Credex leads
- 3 consultations booked
- 2 customers acquired

**ARR impact (2 customers × $25K annual value):** $50K/month incremental ARR for Credex

---

## Unit Economics: StackTrim Standalone (If We Monetized)

**Scenario:** Charge users $29/month for "premium audits" (benchmark reports, historical tracking, PDF exports).

**Conversion assumption:** 5% of captured emails → $29/month subscription

```
1,000 audits/month
250 leads (25% email capture)
12 conversions × $29/month × 12 months = $4,176 ARR (one cohort)

After 6 months (6 cohorts overlapping):
$4,176 × 6 = $25,056 ARR (baseline)

After 12 months:
$25,056 × 12 = potential churn issues; assume 80% retention
$25,056 × 12 × 0.8 = $240,537 ARR (realistic)
```

**Profitability:**
- Hosting (Vercel): ~$500/month
- LLM API (Anthropic): ~$9/month @ scale
- Supabase: ~$100/month
- Total COGS: ~$609/month ($7,308 annual)

At $240K ARR, gross margin = 97% (excellent SaaS unit economics).

**But:** We're not monetizing directly. Instead, we're partnering with Credex.

---

## Credex Partnership Model

**What Credex gets:**
- Pre-qualified leads (spend >$500/month, engaged)
- Contact info (email, company, role)
- Audit data (what tools they use, spend breakdown, biggest opportunity identified)

**What StackTrim gets:**
- Revenue share: $X per converted customer (TBD; assume $500–$2,000 per deal)
- Branding on Credex calls ("This came from StackTrim")
- Traffic backlink (if Credex promotes StackTrim to customers)

**Modeling if Credex pays $1,000 per converted customer:**
```
1,000 audits/month
19 Credex leads → 3 consultations → 2 customers
2 × $1,000 = $2,000/month from Credex partnership

This is enough to keep lights on while we grow.
```

---

## Path to $1M ARR (Ambitious but Defensible)

**Three scenarios:**

### Scenario A: Credex Partnership Scales
```
Month 1: 1,000 audits, 2 customers, $2K revenue
Month 6: 5,000 audits/month (5x growth via Product Hunt + content), 10 customers, $10K/month
Month 12: 10,000 audits/month (steady state), 20 customers, $20K/month

At current unit economics, this plateaus at ~$25K/month.
Not enough for $1M ARR.
```

**Why this stalls:** Each lead costs Credex CAC (their sales team, not ours). They can only afford so many at $1K/customer.

### Scenario B: StackTrim Direct Monetization (Year 2)
```
If we kept emails captured (250/month after month 1), we could build subscription:
Month 12: 5,000 captured emails (cumulative over 12 months)
Month 18: Upsell to premium features ($29/mo, 3% conversion) = 150 subscriptions = $4.5K/month
Month 24: 300 subscriptions (growing cohorts) = $9K/month
This still doesn't reach $1M.
```

**Realization:** Direct monetization alone won't scale to $1M unless we go vertical (e.g., "AI spend audit for fintech companies").

### Scenario C: Expand Addressable Market
```
Phase 1 (Months 1–3): Generic "AI tool audits" → 1,000 audits/month, Credex partnership = $20K/month
Phase 2 (Months 4–9): Vertical audits ("Your cloud infra spend," "Your vendor consolidation") → 5,000 audits/month total
Phase 3 (Months 10–18): Embed StackTrim as API in fintech/SaaS platforms → 50K audits/month, OEM licensing = $100K+/month
Phase 4 (Months 19+): Offer done-for-you consulting ("We'll negotiate your contracts") → $1M ARR

Realistic timeline: 24–36 months from launch to $1M ARR if executed well.
```

**What this requires:**
1. Product-market fit validation (must show 5+ users will pay for premium)
2. Vertical specialization (pick 1 vertical; dominate it)
3. Sales hiring (by Month 12, need 1 FTE sales)
4. Distribution partnerships (embed into billing platforms)

---

## Break-Even Analysis

**Monthly Fixed Costs:**
- Vercel hosting: $100
- Supabase database: $100
- Anthropic API (conservative): $50
- Domain name: $1
- **Total:** $251/month

**Revenue scenarios:**
- Credex partnership @ $2K/month → Break-even ✅
- Direct subscriptions @ 50 customers × $29/mo = $1,450/month → Break-even ✅
- Freemium (free audit, upgrade for PDF): 0 revenue → Not sustainable ❌

**Decision:** Run freemium (no paywall) for Months 1–3. Measure demand for premium features (PDF export, benchmarks, historical tracking). At Month 4, introduce premium if signup/audit ratio justifies it.

---

## Financial Projections (12 Months)

| Month | Audits | Emails | Credex Leads | Revenue | Cumulative |
|-------|--------|--------|--------------|---------|-----------|
| 1 | 500 | 125 | 9 | $10K | $10K |
| 2 | 1,000 | 250 | 19 | $20K | $30K |
| 3 | 1,200 | 300 | 22 | $22K | $52K |
| 4 | 1,500 | 375 | 28 | $28K | $80K |
| 5 | 2,000 | 500 | 38 | $38K | $118K |
| 6 | 2,500 | 625 | 47 | $47K | $165K |
| 7 | 3,000 | 750 | 56 | $56K | $221K |
| 8 | 3,500 | 875 | 65 | $65K | $286K |
| 9 | 4,000 | 1,000 | 75 | $75K | $361K |
| 10 | 4,500 | 1,125 | 84 | $84K | $445K |
| 11 | 5,000 | 1,250 | 93 | $93K | $538K |
| 12 | 5,500 | 1,375 | 103 | $103K | $641K |

**Year 1 total revenue:** $641K (from Credex partnership + potential premium features)
**Year 2 projection (if scaling continues):** $1.2M+ ARR

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Credex doesn't convert leads** | Medium | High | Build direct monetization (premium features) as fallback |
| **AI tool pricing changes monthly** | High | Low | Automate pricing scraper by Month 3 |
| **User acquisition stalls after PH** | Medium | High | Plan vertical expansion (fintech audits) before Month 3 |
| **Anthropic API rate limits** | Low | Medium | Cache responses; switch to Haiku if Sonnet too expensive |
| **Supabase scale costs** | Low | Low | Migrate to self-hosted PostgreSQL after $100K ARR |

---

## Decision: Why Credex Partnership Wins

**vs. Direct monetization:** Credex handles the hard sales work. We stay product-focused and reach profitability faster.

**vs. VC funding:** Zero burn rate. We're profitable from month 1 if Credex partnership works. Less pressure to hockey-stick growth.

**vs. Consulting:** Scales linearly (each customer = N hours). Audits scale 1:0 (server handles it).

**Bottom line:** $641K ARR in Year 1 with $0 outside capital required. Not sexy, but sustainable.
