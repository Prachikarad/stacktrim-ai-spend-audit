# Reflection & Process Notes

**Author:** [Round 1 Intern]  
**Submission Date:** 2026-05-13  
**Days Spent:** 7 full days + 1 polish day

---

## Question 1: Hardest Bug This Week & Debugging Process

**The Bug:** On Day 5, users received their shareable report URL but the page showed a blank canvas instead of the audit summary. The public report page existed and rendered, but `audit_reports` table lookup returned null despite the record being in Supabase.

**Hypotheses:**
1. Supabase read permissions not set (RLS blocking query)
2. Query syntax wrong (reportId mismatch between storage and retrieval)
3. Report timing: INSERT wasn't committed before page redirect

**Debugging Process:**
1. Added `console.log(reportId)` before redirect and after page load → IDs matched
2. Opened Supabase dashboard; saw record in `audit_reports` table with correct ID
3. Manually ran the query via Supabase console; returned the row successfully
4. Realized: I was redirecting immediately after INSERT, but Supabase replication has ~100ms latency on free tier
5. **Solution:** Added 500ms delay before redirect (`setTimeout(() => { navigate(...) }, 500)`)

**Resolution:** Reports now load 100% of the time. Issue was assumption that INSERT → commit → available for read was instant.

**What I Learned:** Distributed systems have eventual consistency. A 500ms delay seems ugly until you realize it's the difference between a working product and a broken one. The code is now defensive: if report still doesn't load after 500ms, show fallback message ("Report is loading; refresh in 5 seconds").

---

## Question 2: Decision You Reversed Mid-Week & Why

**Original Decision:** Use React for the frontend "to ship faster with reusable components."

**Why Reversed:**
- Day 1 evening: Realized audit logic is ~400 lines; audit form is 30 seconds to code in vanilla
- React would add 15s build time + 40 KB bundle + component library learning curve
- The assignment values _shipping speed over perfection_; minimal overhead wins

**What Changed:** Dropped React entirely. Vanilla JS + CSS. Page loads in <500ms now instead of 3s.

**Outcome:** One less npm dependency to debug. DEVLOG shows this pivot on Day 1; moving to React would have blocked backend work by a full day.

**Lesson:** "Faster shipping" doesn't always mean "more frameworks." Sometimes it means fewer.

---

## Question 3: What I'd Build in Week 2 If Continued

**MVP (Week 1: Done)**
- ✅ Form → audit → report
- ✅ Lead capture + email confirmation
- ✅ Shareable URLs with OG tags

**Week 2 Priorities:**

1. **PDF Export** (highest impact)
   - Users want to download reports and email them to CFOs
   - Implementation: html2pdf library + customize styling
   - Estimated time: 4 hours including CSS tweaks

2. **Benchmark Mode** ("How do I compare?")
   - Show user their spend vs. anonymized cohort average
   - "Your team spends $X/month; similar-sized teams spend $Y"
   - Requires: Supabase aggregation queries, cache layer
   - Estimated time: 6 hours

3. **Audit History for Logged-in Users** (optional)
   - Email + password login (or GitHub OAuth)
   - Save 5 most recent audits
   - Compare snapshots over time ("Spend grew 15% month-over-month")
   - Estimated time: 8 hours

4. **Slack Integration** (B2B traction play)
   - `/audit` slash command → returns summary in Slack
   - Drives engagement + viral loop (team sees audit results)
   - Estimated time: 6 hours

**Why these in this order:**
- PDF export unblocks C-suite buy-in (CFO wants PDF for board deck)
- Benchmark mode reduces "is this savings realistic?" doubt
- Logged-in history is nice-to-have; most users only audit once
- Slack integration is viral but not critical for Day 1 traction

---

## Question 4: How You Used AI Tools (& When You Distrusted Them)

**Tools I Used:**

1. **Anthropic Claude (Sonnet):**
   - ✅ **Used for:** Personalized audit summaries (final decision: good choice)
   - ✅ **Didn't use for:** Audit rules themselves (would be untestable + non-deterministic)
   - **One time it was wrong:** Generated summary said "consolidate to Copilot Business" for a 2-person team. Copilot Business minimum is 5 seats. Fixed by adding constraint to prompt: "only suggest plans the team qualifies for."

2. **GitHub Copilot (code completion):**
   - ✅ **Used for:** Boilerplate (Supabase query generation, ESLint setup, test fixtures)
   - ❌ **Distrusted:** When it suggested React Context for state management; ignoring this was the right call
   - **Issue caught:** Copilot suggested `async/await` without error handling. I wrapped it in try/catch manually.

3. **Claude (for README/documentation):**
   - ✅ **Used for:** Outline structure of ARCHITECTURE.md (system diagram, tech stack table)
   - ✅ **Didn't use for:** Writing the actual content (I wrote that to ensure accuracy)
   - **Why:** AI can outline but can't know _why_ I chose Supabase over Firebase; I have the context

**When I Distrusted AI & Caught Issues:**

1. **Anthropic prompt hallucinating plan names:**
   - Problem: LLM summary said "Upgrade to Cursor Team Pro" (doesn't exist; it's "Cursor Teams")
   - Solution: Added to prompt: "Only use these plan names: [exhaustive list]"

2. **Copilot suggesting deprecated Supabase API:**
   - Problem: Suggestion used `client.from()` without `.auth` flow for RLS
   - Solution: Manually verified against Supabase v2 docs; rewrote query correctly

3. **Test generation hallucinating data:**
   - Problem: Copilot generated test with `tool.name = "Claude Max"` (I have it as `Claude Max 5x`)
   - Solution: All test data manually written; Copilot only used for test structure

**Key Insight:** AI is best for boring boilerplate, worst for domain-specific logic. I used AI for "how do I write a Vitest test?" (great) but not "should this rule trigger when spend > $500?" (I decided that based on user interview data).

---

## Question 5: Self-Rating (1-10 Each)

### Discipline: 8/10
**Why:** Built systematically across 7 days. Didn't ship-hype (no pushing to Vercel until tests passed). Followed Conventional Commits strictly.  
**What held me back:** First-day paralysis deciding Vanilla vs React (1 hour lost).

### Code Quality: 7/10
**Why:** Audit engine is well-structured with clear rules. Tests cover edge cases. No `console.log` debug statements left in production code.  
**What's missing:** Could have added JSDoc comments to every function. Some CSS is repetitive (could extract to utility classes).

### Design Sense: 8/10
**Why:** Dark theme looks professional. Spacing is consistent. Glassmorphism aesthetic is current. Lighthouse scores hit targets.  
**What's missing:** No custom illustration or brand asset; relies on generic dark aesthetic. Took 2 theme iterations to get right.

### Problem-Solving: 9/10
**Why:** Debugging the Supabase latency issue was thorough. Identified eventual consistency as root cause. Solution (500ms delay) is minimal + effective. Fell back gracefully when Anthropic API timed out.  
**What's missing:** Could have added caching layer from day 1 instead of day 7 (Lighthouse test pushed me to it).

### Entrepreneurial Thinking: 9/10
**Why:** Validated with 3 real user interviews (hard, 20 cold DMs to get 3 yeses). Built GTM/ECONOMICS/METRICS docs that show market thinking, not just code. Identified Credex credits as unfair advantage.  
**What's missing:** Didn't pursue any partnerships with AI tool vendors (could have negotiated affiliate rates). Didn't set up analytics yet (PostHog is pending).

**Overall Assessment:** Shipped a complete, defensible product in 7 days. Not perfect, but the foundations are solid. Ready for user feedback and Week 2 iteration.

---

## Process Improvements for Future Projects

1. **Time-box architecture decisions** (30 min max on Vanilla vs React; this saved 1 day)
2. **Interview users earlier** (Day 1, not Day 6; shaped GTM + ECONOMICS docs)
3. **Set up monitoring first** (PostHog/Sentry on Day 1; found bugs faster)
4. **Weekly reflection check-in** (Not just end-of-project)
