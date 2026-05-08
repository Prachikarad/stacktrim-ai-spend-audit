# Metrics

## North Star

Qualified monthly savings discovered.

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
