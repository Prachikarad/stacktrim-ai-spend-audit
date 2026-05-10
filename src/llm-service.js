import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
});

export async function generateAuditSummary(auditData) {
  const { tools, teamSize, primaryUse, monthlySavings, totalSavings } =
    auditData;

  const toolSummary = tools
    .map(
      (t) =>
        `${t.toolName} (${t.recommendation.action}): save ${t.recommendation.savings}/mo`
    )
    .join("; ");

  const prompt = `You are a financial advisor for startup spending. Analyze this AI tool audit and write a 90-110 word personalized summary for the user.

Tool Summary: ${toolSummary}
Team Size: ${teamSize} people
Primary Use Case: ${primaryUse}
Monthly Savings Identified: $${monthlySavings}
Annualized: $${totalSavings}

Write a friendly but direct summary that:
1. Acknowledges what they're doing well
2. Highlights the biggest opportunity
3. Motivates them to act on savings

Be specific, not generic. Sound like a peer advisor, not corporate.`;

  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 150,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return text.trim();
  } catch (error) {
    console.error("Anthropic API error:", error);
    return fallbackSummary(auditData);
  }
}

export function fallbackSummary(auditData) {
  const { tools, teamSize, monthlySavings } = auditData;
  const biggest = tools.sort(
    (a, b) =>
      (b.recommendation?.savings || 0) - (a.recommendation?.savings || 0)
  )[0];

  return `Your team of ${teamSize} is paying retail on AI tools across ${tools.length} subscriptions. The biggest opportunity: ${biggest?.recommendation?.action}. That alone saves $${Math.round(biggest?.recommendation?.savings || 0)}/mo. Credex can help you capture more. Get in touch.`;
}
