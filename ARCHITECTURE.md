# Architecture

## Why This Shape

The assignment rewards a working product with defensible audit logic, so the core decision was to keep the math deterministic and inspectable. The app does not ask an LLM to decide savings. It uses official pricing data plus rule-based recommendations, then uses AI only to summarize the result.

## Components

- `index.html`: product surface and semantic structure.
- `src/main.js`: UI state, persistence, report rendering, share links, and API calls.
- `src/pricing-data.js`: vendor plan data and official source URLs.
- `src/audit-engine.js`: deterministic spend math and recommendation rules.
- `server.mjs`: optional Node backend for summary generation, lead capture, rate limiting, and transactional email.
- `tests/audit-engine.test.js`: automated coverage for the audit engine.

## Recommendation Logic

The MVP checks:

- Whether a small team is paying for a team plan when individual plans fit.
- Whether a high custom/API bill should trigger a transparent team plan or Credex credit conversation.
- Whether multiple coding assistants or general chat tools overlap.
- Whether no savings should be reported because the current setup appears reasonable.

The output is intentionally conservative. A finance-literate buyer should be able to follow the recommendation from current spend to proposed action.

## What I Would Change Next

- Add a pricing sync job with vendor-page snapshots.
- Persist reports server-side with short public IDs.
- Add PDF export and embed widget modes.
- Add benchmark cohorts by company size and developer count.
- Add a real CRM handoff for high-savings Credex opportunities.
