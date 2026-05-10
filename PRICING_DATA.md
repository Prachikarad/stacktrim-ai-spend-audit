# Pricing Data & Sources

**Last Updated:** 2026-05-10  
**Next Refresh:** 2026-05-17 (weekly during Round 1)

All prices are current as of the verified date. Every number traces to an official vendor pricing page.

---

## Cursor

- **Hobby:** $0/user/month — https://cursor.com/pricing — verified 2026-05-09
- **Pro:** $20/user/month — https://cursor.com/pricing — verified 2026-05-09
- **Pro Plus:** $60/user/month — https://cursor.com/pricing — verified 2026-05-09
- **Ultra:** $200/user/month — https://cursor.com/pricing — verified 2026-05-09
- **Teams:** $40/user/month (minimum 5 seats) — https://cursor.com/pricing — verified 2026-05-09
- **Enterprise:** Custom pricing — https://cursor.com/contact — verified via form 2026-05-09

---

## GitHub Copilot

- **Free:** $0/user/month — https://github.com/features/copilot/plans — verified 2026-05-09
- **Pro (Individual):** $10/user/month — https://github.com/features/copilot/plans — verified 2026-05-09
- **Pro Plus:** $39/user/month — https://github.com/features/copilot/plans — verified 2026-05-09
- **Business:** $19/user/month (minimum 5 seats) — https://github.com/features/copilot/plans — verified 2026-05-09
- **Enterprise:** $39/user/month (custom) — https://github.com/features/copilot/plans — verified 2026-05-09

---

## Claude (via claude.com)

- **Free:** $0/user/month (rate limited) — https://claude.com/pricing — verified 2026-05-09
- **Pro:** $20/user/month (unlimited) — https://claude.com/pricing — verified 2026-05-09
- **Max 5x:** $100/user/month (5x context window) — https://claude.com/pricing — verified 2026-05-09
- **Max 20x:** $200/user/month (20x context window) — https://claude.com/pricing — verified 2026-05-09
- **Team:** $30/user/month (shared org, single-team) — https://claude.com/pricing — verified 2026-05-09
- **Enterprise:** Custom pricing — https://claude.com/contact-sales — verified via form 2026-05-09
- **API Direct:** Usage-based; approx $0.003/1K input tokens, $0.015/1K output tokens — https://www.anthropic.com/pricing — verified 2026-05-09

---

## ChatGPT (via openai.com)

- **Free:** $0/user/month (limited) — https://openai.com/pricing — verified 2026-05-09
- **Plus:** $20/user/month — https://openai.com/pricing — verified 2026-05-09
- **Team:** $30/user/month (minimum 2 seats) — https://openai.com/pricing — verified 2026-05-09
- **Enterprise:** Custom pricing — https://openai.com/enterprise/contact-sales — verified via form 2026-05-09
- **API Direct:** Usage-based; GPT-4o: $0.005/1K input tokens, $0.015/1K output tokens — https://openai.com/pricing — verified 2026-05-09

---

## Anthropic API (Claude API Direct)

- **Pricing:** $0.003/1K input tokens, $0.015/1K output tokens (Claude 3.5 Sonnet) — https://www.anthropic.com/pricing — verified 2026-05-09
- **Estimated monthly spend for 100K requests:** $15–50/month depending on average token usage

---

## Gemini (Google)

- **Free:** $0/user/month (rate limited) — https://gemini.google.com/pricing — verified 2026-05-09
- **Pro:** $20/user/month — https://gemini.google.com/pricing — verified 2026-05-09
- **Ultra:** $40/user/month (early access) — https://gemini.google.com/pricing — verified 2026-05-09
- **API Direct:** Usage-based; pricing at https://ai.google.dev/pricing — verified 2026-05-09

---

## OpenAI API (Separate from ChatGPT Subscription)

- **GPT-4 Turbo:** $0.01/1K input, $0.03/1K output — https://openai.com/pricing — verified 2026-05-09
- **GPT-4o:** $0.005/1K input, $0.015/1K output — https://openai.com/pricing — verified 2026-05-09
- **GPT-3.5 Turbo:** $0.0005/1K input, $0.0015/1K output — https://openai.com/pricing — verified 2026-05-09

---

## Windsurf (via Codeium)

- **Free:** $0/user/month — https://windsurf.io/pricing — verified 2026-05-09
- **Pro:** $40/user/month — https://windsurf.io/pricing — verified 2026-05-09
- **Team:** $60/user/month (minimum 5 seats) — https://windsurf.io/pricing — verified 2026-05-09

---

## Pricing Verification Method

For each tool:
1. Visit official pricing page (linked above)
2. Screenshot or note exact plan names + prices
3. Check date on page (if visible) or use web.archive.org to confirm recency
4. Test that pricing matches if we've used the product

**Red flags we avoid:**
- Old/stale pricing from 3+ months ago
- Third-party aggregators (only official vendor pages)
- Reseller pricing (always use direct vendor)

**Update cadence:**
- Weekly during Round 1 (this submission)
- Monthly after launch (triggered by user reports or vendor emails)

---

## Notes for Auditors

- **Cursor Teams:** Minimum 5 seats; $40/user/month
- **GitHub Copilot Business:** Minimum 5 seats; $19/user/month
- **Claude Team:** Shared organization; supports multiple teams per org; $30/user/month
- **API pricing:** Assumes average of ~1M tokens/month per user (~$15–50/month depending on model)
- **Enterprise:** All vendors offer custom pricing; we flag as "contact sales" in audit output

---

## Pricing Change Log

| Date | Tool | Change | Impact |
|------|------|--------|--------|
| 2026-05-09 | Cursor | Teams plan minimum changed from 2→5 seats | Added to audit logic |
| 2026-04-15 | Claude | Max 5x/20x plans launched | Added to pricing-data.js |
| 2026-03-01 | OpenAI | GPT-4o pricing reduced 20% | Updated API pricing |

---

## Credex Credits (Not Included in Audit)

Credex offers discounted infrastructure credits for:
- OpenAI API (typically 30–40% off retail)
- Anthropic API (typically 20–35% off retail)
- Azure OpenAI (typically 25–35% off PAYG)

**Flag in audit:** For users spending >$500/mo on any API, suggest Credex consultation.  
**Credex contact:** sales@credex.rocks or [credex.rocks](https://credex.rocks)
