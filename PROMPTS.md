# AI Prompts

## Summary Prompt

The server sends the following task to Anthropic when `ANTHROPIC_API_KEY` is configured:

```text
Write a direct 100-word AI spend audit summary for a startup. Be specific, cite total monthly and annual savings, mention Credex only when credexFit is true, and do not invent facts.

{audit_json}
```

## Why This Prompt

The audit math is already complete before the LLM runs. The prompt constrains the model to summarization, asks for concrete savings numbers, and explicitly forbids invented facts. If the API call fails or the key is missing, the app uses `fallbackSummary` from `src/audit-engine.js`.

## What Did Not Work

I avoided asking AI to decide the recommendations. That would make the finance logic hard to test and easy to hallucinate.
