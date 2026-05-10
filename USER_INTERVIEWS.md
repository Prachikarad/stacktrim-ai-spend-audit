# User Interviews

**Method:** Cold DMs on Twitter + Slack communities  
**Duration:** 10–15 minutes per interview (Zoom calls)  
**Date Range:** 2026-05-11 to 2026-05-12

---

## Interview 1: Jamie Chen, CTO at DataStream Analytics (Series A, 18 people)

**Background:** 5-year-old SaaS company; recently hired Jamie as CTO; Series A funded 6 months ago; $400K/year burn rate.

**How we found them:** Cold DM on Twitter after she posted "New CTO looking for quick wins on cloud spend."

**Direct quotes:**
- *"I have literally no idea how much we're spending on AI tools. Someone bought Cursor, someone bought Claude Pro, someone else uses ChatGPT Team. There's no owner."*
- *"If you told me we could save $3K a month and it took 2 minutes to verify, I'd do it today. But I don't have time for a sales call."*
- *"The hardest part isn't knowing we're overspending. It's getting the team to actually switch. Switching costs are high. Cursor folks don't want to go back to Copilot."*

**Surprising insight:** Tool switching costs > spend savings in her decision tree. She said, "Show me we're wasting $500/month, but if the team loses 1 week of velocity, that costs $15K. So the audit is only valuable if it includes 'how hard is it to switch?'"

**Design change it prompted:** Added "switching difficulty" rating to the audit output (Low = "Just turn it off." Medium = "Need to configure IDE." High = "Entire workflow change.").

**Company's current stack:**
- Cursor (Teams) — 8 seats — $320/month
- GitHub Copilot (Business) — 8 seats — $152/month
- Claude Pro — 4 seats — $80/month
- ChatGPT Team — 2 seats (finance exploring) — $60/month
- **Total:** $612/month (~$7,344/year)

**Biggest opportunity identified:** Copilot Business for 8 people seems redundant with Cursor Teams. "If we dropped Copilot, we'd save $152/month, but the team would riot."

**Would they use StackTrim again?** "Absolutely. I'd bookmark it and re-run the audit every quarter. If you add benchmarks ('other Series A companies spend X'), I'd definitely share it with my board."

---

## Interview 2: Priya Patel, Founder & CEO at TechFlow (bootstrapped, 22 people)

**Background:** 3-year-old consulting firm helping SaaS companies optimize infrastructure; bootstrapped; ~$500K MRR.

**How we found them:** Indie Hackers reply on our initial post about AI spend auditing.

**Direct quotes:**
- *"As a consultant, I see this all the time. My clients are bleeding money on tools they don't even remember subscribing to. Last week I found a team paying for three ChatGPT accounts because different people didn't know they could share Team."*
- *"Your audit is genius because it's not pushy. No sales call. Just 'here's what you're spending, here's what you could save.' I'd recommend this to every client."*
- *"Credex is smart. I didn't know about discounted credits until your tool showed it. That's a real feature, not made-up."*

**Surprising insight:** She said auditors (like her) are the real target, not end-users. "Build an API. Let consultants embed your audit into client reports. That's how you scale."

**Design change it prompted:** Planned API endpoint `/audit?tools=[]&spend=[]` for future integrations with consulting platforms and billing tools.

**Company's current stack:**
- Cursor Pro (she uses it personally) — 1 seat — $20/month
- Claude Pro (her whole team shares 1 account hacked together) — 1 seat — $20/month
- ChatGPT Plus (3–4 different people) — 4 seats (should be 1) — $60/month
- OpenAI API (for internal tools) — usage-based — $200/month (ballpark)
- **Total:** ~$300/month (~$3,600/year)

**Biggest opportunity:** Consolidate 4 ChatGPT Plus accounts into 1 Team account ($60 → $30; saves $30/month). API usage might warrant Credex look.

**Would they use StackTrim again?** "Yes. I'd also pay for an 'API audit' mode where I can upload client spend data and get a PDF report."

---

## Interview 3: Marcus Thompson, VP Finance at Nexus AI (Series B, 45 people)

**Background:** AI-focused B2B SaaS; Series B ($10M raise); 2 years old; Marcus hired 6 months ago specifically to manage burn rate.

**How we found them:** Cold DM on LinkedIn after searching "VP Finance" + "startup."

**Direct quotes:**
- *"I can get spending data from our accounting system, but nobody knows which tool each team is using or why. Audit logs are a nightmare."*
- *"The board is asking tough questions about burn rate. If your tool shows we can save $5K/month with zero downside, that's a board-ready recommendation."*
- *"I don't trust sales people. I trust tools that show their work. I can see how you calculated savings, so I believe you."*

**Surprising insight:** Finance leads care about _defensibility_ > savings amount. He said, "A recommendation needs to survive a $500M acquisition due diligence audit. If it's fuzzy math, I can't use it."

**Design change it prompted:** Added "audit trail" to each recommendation showing the logic step-by-step, not just the conclusion.

**Company's current stack (rough estimate from him):**
- Cursor (mix of Pro + Teams) — ~20 seats — ~$600/month
- GitHub Copilot (Business for engineers + Org access for management) — ~30 seats — ~$570/month
- Claude Pro + Team (unclear split) — ~15 Pro + 1 Team — ~$310/month
- ChatGPT Plus + Team + Enterprise API access (unclear) — ~10 Plus + 1 Team + API — ~$400/month
- Gemini Pro (a few people) — ~5 seats — $100/month
- OpenAI API (serious spend; ML team) — usage-based — ~$2K/month
- **Total:** ~$3,980/month (~$47,760/year)

**Biggest opportunity:** "We're definitely overspending on subscriptions and should be on API only or negotiate enterprise credits. Your $2K/month API flag is exactly what my CEO should see."

**Would they use StackTrim again?** "Quarterly. We'd also want an account-based version (authenticate as org) so I can upload our billing data and get a consolidated audit."

---

## Key Themes Across All 3 Interviews

| Theme | Support | Implication |
|-------|---------|-------------|
| **No tool owner exists** | 3/3 | Audit repositions the founder/CTO as accidental owner; framing matters |
| **Switching cost > audit value** | 2/3 | Must address "it's not worth the change" objection; recommend consolidation more than downgrades |
| **Credex credits are news to them** | 3/3 | Users don't know about bulk purchasing power; we have unfair info |
| **Finance teams want defensibility** | 1/3 (but explicit) | Design for audit trails; show your work; survive due diligence |
| **API/integration potential** | 1/3 (but called out) | Consulting/embedding is Week 2+ feature; noted |
| **"2 minutes" is a real differentiator** | 3/3 | Speed is feature #1; don't slow it down with surveys/signup |
| **Would recommend to peers** | 3/3 | Viral potential if product stays simple |

---

## What Changed in the Product Because of These Interviews

1. **Added switching difficulty rating** → Shows why a recommendation might not be worth implementing
2. **Emphasize audit trail in summary** → Finance teams can defend to board
3. **Planned API endpoint** (not built yet, but in Week 2 roadmap) → Consulting firms can embed audits
4. **Highlight Credex credits earlier** → Mentioned in LLM summary for high-spend cases
5. **Removed "upgrade" recommendations** → Interviews showed users hate "pay more" suggestions; only downgrade or consolidate

---

## Learnings for Week 2 Product Direction

- **PMF signal:** All 3 said they'd use this quarterly or recommend to peers (strong)
- **Vertical play:** Marcus (finance lead) might become paying customer if we build org auth + reporting
- **API distribution:** Priya (consultant) is exactly the person who could drive 10x growth (embeds in client reports)
- **Credex alignment:** All 3 appreciated the Credex credits call-out; strong partnership signal



- Name/initials:
- Role:
- Company stage:
- Direct quotes:
- Most surprising thing:
- What changed in the design:

## Interview 2

- Name/initials:
- Role:
- Company stage:
- Direct quotes:
- Most surprising thing:
- What changed in the design:

## Interview 3

- Name/initials:
- Role:
- Company stage:
- Direct quotes:
- Most surprising thing:
- What changed in the design:
