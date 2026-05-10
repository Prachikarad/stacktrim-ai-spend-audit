# Go-To-Market Strategy

---

## Target User (Exact, Not Vague)

**NOT:** "Startups that use AI tools"  
**YES:** CTOs or finance leads at 10–50 person SaaS companies burning $1,500–$5,000/month on AI tools (Cursor, Copilot, Claude) without a formal tool owner or procurement process

**Demographics:**
- Role: CTO, VP Eng, Finance Lead (occasionally founder)
- Company Stage: Post-seed, Series A/B
- Team Size: 10–50 people
- Industry: SaaS, fintech, B2B software (not consumer)
- Pain Point: "We have 8 different AI tools. I don't know the total spend. I don't know if we need all of them."

**Psychographics:**
- Tech-savvy (uses Twitter, reads Indie Hackers, watches ProductHunt)
- Financially accountable (CFO asking "why are we spending $2K/month here?")
- Moves fast ("I want the answer in 2 minutes, not a 30-minute sales call")

---

## Where They Hang Out (Content + Channels)

**Channels ranked by immediacy (Week 1):**

1. **Twitter/X** (Day 1 traction play)
   - Accounts to follow: @shipyonew, @swyx, @buildspace, YC alumni posts
   - Tag: #BuildInPublic, #SaaS, #StartupLife
   - **Our play:** Cold-DM CTOs who tweeted about "we just added Cursor" or "our AI tool bill is out of control"
   - **Expected:** 2–5 signups per day from DMs

2. **Indie Hackers** (discussions)
   - Thread: "My startup's AI tool audit: Here's what we're overspending on"
   - Expected CTR: 5% (50 views → 2.5 clicks)
   - **Our play:** Share real startup audits (anonymized) with specific savings amounts ("Company X saved $4.8K/year by consolidating")

3. **Reddit** (/r/startups, /r/SaaS, /r/cto)
   - Not spammy; answer questions like "How much should we spend on AI tools?"
   - Natural CTA: "We built a 2-minute audit tool that breaks this down"
   - Expected: 1–2 quality signups/day from discussion threads

4. **Hacker News** (Show HN post)
   - Timing: Thursday morning, 8 AM PT (best engagement)
   - **Our play:** "Show HN: I built a 2-minute AI spend audit for startups. Here's what $1.2K/month looks like"
   - Expected: 50–100 audits in first 6 hours if it lands well

5. **LinkedIn** (Founder/CTO network)
   - Post personal story: "I was hired as CTO and saw $8K/month in AI tool chaos. Here's the audit I built."
   - Expected: 2–3 signups/day from engaged audience

6. **Product Hunt** (Soft launch after 100 audits)
   - Wait until: 100 audits completed + 10+ email captures + 2 Credex leads
   - Why: PH audience expects working product with traction, not MVP
   - Expected: 500–1,000 audits in first 24 hours if in top 5

---

## First 100 Users in 30 Days (Detailed Plan)

**Goal:** 100 audits completed; 40 emails captured; 3 Credex consultations booked

**Week 1 (Days 1–7): Cold Outreach + Content**
- Mon: Deploy to Vercel; start manual cold DMs (Twitter, LinkedIn)
- Tue–Thu: Post 3 long-form breakdowns on Twitter (audit of real companies; real savings amounts)
- Fri: Indie Hackers post + Reddit threads
- Goal: 20 audits, 8 email captures

**Week 2 (Days 8–14): Hacker News + Amplify**
- Mon: Write Show HN post
- Tue–Thu: Respond to HN comments (build credibility)
- Fri: Repost best Twitter threads from Week 1 (new audience)
- Goal: 50 audits (30 from HN spike), 18 email captures total

**Week 3 (Days 15–21): Community + Influencer**
- Mon: Cold email 5 AI tool reviewers (AI indie hackers on ProductHunt)
- Tue: DM 3 founder Twitter accounts with high engagement
- Wed: Post in 5 founder Slack communities
- Thu: Final push on Reddit (high-spend companies specifically)
- Goal: 25 audits, 14 email captures total

**Week 4 (Days 22–30): Product Hunt**
- Mon–Tue: Prep PH listing (video walkthrough, comment responses drafted)
- Wed: Launch on PH
- Thu–Fri: Respond to comments, collect feedback
- Goal: 5 audits (low, overshadowed by PH feedback), 0 emails (PH users are explorers)

**Total Week 4 End:** 100 audits, 40 email captures (40% conversion), 3 Credex leads (7.5% of emails)

---

## Our Unfair Advantage (Why We Win)

1. **Real Pricing Data**
   - We verify pricing from official vendor pages every week
   - Competitors would use stale data or guess
   - Defensibility: every savings claim traces to a source URL

2. **Credex Integration**
   - We have direct credit access (other tools don't)
   - High-spend cases get routed to Credex automatically
   - Lead value to Credex: higher-quality leads (we pre-filtered by spend level)

3. **Speed**
   - 2 minutes vs. 30-minute sales call
   - CTOs trust a tool that respects their time

4. **Defensible Logic**
   - Rules are named, not AI-generated ("Below 5 seats" → "Downgrade to Pro")
   - Finance teams can audit the logic
   - Competitors would need ML; we don't

5. **Early Data**
   - 40 emails in first month = cohort data ("Average spend is $X; average savings is $Y")
   - Competitors start from zero; we have signals
   - By month 2, "78% of companies have redundant tools" becomes a marketing claim

---

## Week 1 Traction Metrics

| Metric | Target | How We Track |
|--------|--------|--------------|
| **Audits Completed** | 20+ | Supabase count |
| **Email Captures** | 8+ | Supabase leads table |
| **Credex Leads** | 1+ | Manual follow-up |
| **Social Engagement** | 50+ likes on best tweet | Twitter analytics |
| **Inbound Interest** | 2+ DM asks "Can you audit my company?" | Twitter DMs |

---

## If We Hit 100 Audits by Week 2 (Likely)

**Signals to act on:**
- **High email capture rate (>50%)** → Double down on that traffic source
- **Credex leads converting (1 consultation booked)** → Signal to Credex: "This funnel works"
- **Particular cohort overindexing** (e.g., "all Stripe companies")  → Create vertical-specific messaging

**Signals to pivot:**
- **Email capture rate <20%** → Value prop unclear; add more social proof or change CTA
- **No Credex leads after 50 audits** → Logic not surfacing high-spend cases; debug
- **Users abandoning at form input** → Form is too long; simplify

---

## Unfair Advantage in Words

**Pitch:** "StackTrim is what every AI tool vendor should offer but doesn't: a free, auditable breakdown of your actual spend with specific, defensible recommendations. Not AI-generated guesses. Real pricing. Real savings. Real Credex credits if you qualify. 2 minutes."

---

## Month 2 & Beyond

**If Week 1 works:**
- Partner with AI tool review sites (ProductHunt, Capterra) for embeds
- Offer free audits for specific company types (YC companies, unicorns)
- Write benchmarks: "SaaS companies spend X; your team is Y% above/below average"

**If Week 1 doesn't work:**
- Shift from "audit" framing to "negotiate with vendors" framing
- Partner directly with Credex sales: "We're your lead gen machine"
- Pivot to API: build StackTrim as a plugin for Slack/fintech tools


- "Cursor vs Copilot for team"
- "ChatGPT Team worth it"
- "Claude Max vs Team"
- "AI tools spend too high"
- "startup software spend audit"

## Where They Hang Out

- Hacker News threads about AI coding tools and startup burn.
- `r/SaaS`, `r/startups`, `r/LocalLLaMA`, and engineering manager communities.
- Indie Hackers and founder Slack groups.
- X lists around AI engineers, solo founders, and devtool buyers.

## First Users In 7 Days With No Paid Budget

1. Reply to active discussions where founders compare Cursor, Copilot, Claude, ChatGPT, and Gemini costs.
2. DM founders who recently posted hiring or burn-rate updates and offer a free private audit.
3. Ask three operators in personal networks to run the tool live and share screenshots of confusing parts.
4. Publish a teardown of "how a 12-person startup can accidentally spend $2k/mo on AI tools."
5. Give Credex a unique distribution advantage: package the tool with real discounted credit offers surfaced after the savings report.

## Week 1 Traction If It Works

- 300 completed audits.
- 45 captured work emails.
- 12 audits with more than $500/month in surfaced savings.
- 4 booked Credex consultations.
- 2 credit purchases or procurement conversations.

## Poor Signal

SEO-only content and generic launch posts would be weak because the target user needs urgency and a concrete bill to inspect.
