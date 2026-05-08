export const PRICING_AS_OF = '2026-05-09';

export const TOOL_CATALOG = [
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'coding',
    sourceUrl: 'https://cursor.com/pricing',
    plans: [
      { id: 'hobby', name: 'Hobby', monthly: 0, seatBased: false },
      { id: 'pro', name: 'Pro', monthly: 20, seatBased: true },
      { id: 'pro-plus', name: 'Pro+', monthly: 60, seatBased: true },
      { id: 'ultra', name: 'Ultra', monthly: 200, seatBased: true },
      { id: 'teams', name: 'Teams', monthly: 40, seatBased: true },
      { id: 'enterprise', name: 'Enterprise', monthly: null, seatBased: true }
    ]
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'coding',
    sourceUrl: 'https://github.com/features/copilot/plans',
    plans: [
      { id: 'free', name: 'Free', monthly: 0, seatBased: false },
      { id: 'pro', name: 'Pro', monthly: 10, seatBased: true },
      { id: 'pro-plus', name: 'Pro+', monthly: 39, seatBased: true },
      { id: 'business', name: 'Business', monthly: 19, seatBased: true },
      { id: 'enterprise', name: 'Enterprise', monthly: 39, seatBased: true }
    ]
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'mixed',
    sourceUrl: 'https://claude.com/pricing',
    plans: [
      { id: 'free', name: 'Free', monthly: 0, seatBased: false },
      { id: 'pro', name: 'Pro', monthly: 20, seatBased: true },
      { id: 'max-5x', name: 'Max 5x', monthly: 100, seatBased: true },
      { id: 'max-20x', name: 'Max 20x', monthly: 200, seatBased: true },
      { id: 'team', name: 'Team', monthly: 30, seatBased: true },
      { id: 'enterprise', name: 'Enterprise', monthly: null, seatBased: true },
      { id: 'api', name: 'API direct', monthly: null, seatBased: false }
    ]
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'mixed',
    sourceUrl: 'https://chatgpt.com/pricing',
    plans: [
      { id: 'free', name: 'Free', monthly: 0, seatBased: false },
      { id: 'plus', name: 'Plus', monthly: 20, seatBased: true },
      { id: 'pro', name: 'Pro', monthly: 200, seatBased: true },
      { id: 'business', name: 'Business', monthly: 25, seatBased: true, note: 'Annual billing equivalent' },
      { id: 'enterprise', name: 'Enterprise', monthly: null, seatBased: true },
      { id: 'api', name: 'API direct', monthly: null, seatBased: false }
    ]
  },
  {
    id: 'anthropic-api',
    name: 'Anthropic API',
    category: 'api',
    sourceUrl: 'https://platform.claude.com/docs/en/about-claude/pricing',
    plans: [
      { id: 'sonnet', name: 'Claude Sonnet API', monthly: null, seatBased: false },
      { id: 'opus', name: 'Claude Opus API', monthly: null, seatBased: false },
      { id: 'haiku', name: 'Claude Haiku API', monthly: null, seatBased: false }
    ],
    apiPrices: [
      { model: 'Claude Sonnet', inputPerMTok: 3, outputPerMTok: 15 },
      { model: 'Claude Opus', inputPerMTok: 5, outputPerMTok: 25 }
    ]
  },
  {
    id: 'openai-api',
    name: 'OpenAI API',
    category: 'api',
    sourceUrl: 'https://openai.com/api/pricing/',
    plans: [
      { id: 'gpt-5-5', name: 'GPT-5.5 API', monthly: null, seatBased: false },
      { id: 'gpt-5-4', name: 'GPT-5.4 API', monthly: null, seatBased: false },
      { id: 'gpt-5-4-mini', name: 'GPT-5.4 mini API', monthly: null, seatBased: false }
    ],
    apiPrices: [
      { model: 'GPT-5.5', inputPerMTok: 5, outputPerMTok: 30 },
      { model: 'GPT-5.4', inputPerMTok: 2.5, outputPerMTok: 15 },
      { model: 'GPT-5.4 mini', inputPerMTok: 0.75, outputPerMTok: 4.5 }
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'mixed',
    sourceUrl: 'https://gemini.google/subscriptions/',
    plans: [
      { id: 'free', name: 'Free', monthly: 0, seatBased: false },
      { id: 'plus', name: 'Google AI Plus', monthly: 7.99, seatBased: true },
      { id: 'pro', name: 'Google AI Pro', monthly: 19.99, seatBased: true },
      { id: 'ultra', name: 'Google AI Ultra', monthly: 249.99, seatBased: true },
      { id: 'api', name: 'API direct', monthly: null, seatBased: false }
    ]
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    category: 'coding',
    sourceUrl: 'https://windsurf.com/pricing',
    plans: [
      { id: 'free', name: 'Free', monthly: 0, seatBased: false },
      { id: 'pro', name: 'Pro', monthly: 20, seatBased: true },
      { id: 'max', name: 'Max', monthly: 200, seatBased: true },
      { id: 'teams', name: 'Teams', monthly: 40, seatBased: true },
      { id: 'enterprise', name: 'Enterprise', monthly: null, seatBased: true }
    ]
  }
];

export function getTool(toolId) {
  return TOOL_CATALOG.find((tool) => tool.id === toolId);
}

export function getPlan(toolId, planId) {
  return getTool(toolId)?.plans.find((plan) => plan.id === planId);
}
