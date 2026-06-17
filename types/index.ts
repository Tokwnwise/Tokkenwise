export interface UsageRecord {
  id:           string
  teamId:       string
  date:         string
  model:        string
  inputTokens:  number
  outputTokens: number
  totalTokens:  number
  requestCount: number
  cost:         number
}

export interface AnalyticsResult {
  totalSpend:     number
  totalRequests:  number
  totalTokens:    number
  avgDailyCost:   number
  projectedMonthly: number
  topModel:       string
  dailyTrend:     DaySpend[]
  modelBreakdown: ModelSpend[]
  lastSyncAt:     string | null
}

export interface DaySpend {
  date:     string
  cost:     number
  requests: number
}

export interface ModelSpend {
  model:    string
  cost:     number
  requests: number
  tokens:   number
  pct:      number
}

export interface WasteInsight {
  id:              string
  type:            'model_overkill' | 'spend_spike' | 'acceleration' | 'no_diversity' | 'token_bloat'
  severity:        'high' | 'medium' | 'low'
  title:           string
  description:     string
  estimatedWaste:  number
  recommendation:  string
}

export interface WasteResult {
  totalWaste:    number
  savingsPct:    number
  insights:      WasteInsight[]
}

// Pricing per 1k tokens in USD
export const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4o':            { input: 0.005,   output: 0.015   },
  'gpt-4o-mini':       { input: 0.00015, output: 0.0006  },
  'gpt-4-turbo':       { input: 0.01,    output: 0.03    },
  'gpt-3.5-turbo':     { input: 0.0005,  output: 0.0015  },
  'gpt-4':             { input: 0.03,    output: 0.06    },
  'text-embedding-3-small': { input: 0.00002, output: 0 },
  'text-embedding-3-large': { input: 0.00013, output: 0 },
}

export function calcCost(model: string, inputTokens: number, outputTokens: number): number {
  const p = MODEL_PRICING[model] ?? { input: 0.005, output: 0.015 }
  return parseFloat(((inputTokens / 1000) * p.input + (outputTokens / 1000) * p.output).toFixed(6))
}

export function formatCost(n: number): string {
  if (n === 0)    return '$0.00'
  if (n < 0.01)   return `$${n.toFixed(4)}`
  if (n < 100)    return `$${n.toFixed(2)}`
  return `$${Math.round(n).toLocaleString()}`
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}
