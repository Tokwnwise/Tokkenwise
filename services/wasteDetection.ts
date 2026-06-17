import type { WasteInsight, WasteResult, ModelSpend, DaySpend } from '../types'
import { formatCost } from '../types'

let idCounter = 0
function makeId() { return `w${++idCounter}` }

export function detectWaste(
  modelBreakdown: ModelSpend[],
  dailyTrend:     DaySpend[],
  totalSpend:     number
): WasteResult {
  const insights: WasteInsight[] = []

  if (totalSpend === 0 || modelBreakdown.length === 0) {
    return { totalWaste: 0, savingsPct: 0, insights: [] }
  }

  // ── Rule 1: Model overkill ─────────────────────────────────────────────
  // GPT-4o doing most of the work when cheaper models could handle it
  const gpt4o     = modelBreakdown.find(m => m.model === 'gpt-4o')
  const gpt4oMini = modelBreakdown.find(m => m.model === 'gpt-4o-mini')

  if (gpt4o && gpt4o.pct >= 60) {
    // Estimate: if 40% of gpt-4o requests could use mini instead
    const switchable    = gpt4o.cost * 0.40
    const miniCostRatio = 0.03  // gpt-4o-mini is ~97% cheaper per token
    const estimatedWaste = switchable * (1 - miniCostRatio)

    insights.push({
      id:   makeId(),
      type: 'model_overkill',
      severity: gpt4o.pct >= 80 ? 'high' : 'medium',
      title:       `GPT-4o is ${gpt4o.pct}% of your spend`,
      description: `${formatCost(gpt4o.cost)} spent on GPT-4o. Many routine tasks like classification, summarisation, and Q&A work just as well on GPT-4o mini at 97% lower cost.`,
      estimatedWaste,
      recommendation: `Route simpler tasks to gpt-4o-mini. Estimated saving: ${formatCost(estimatedWaste)}/month`,
    })
  }

  // ── Rule 2: Spend spike ────────────────────────────────────────────────
  // Any single day more than 3x the average
  if (dailyTrend.length >= 7) {
    const avg   = dailyTrend.reduce((s, d) => s + d.cost, 0) / dailyTrend.length
    const spike = dailyTrend.find(d => d.cost > avg * 3)

    if (spike && avg > 0) {
      const excessCost = spike.cost - avg
      insights.push({
        id:   makeId(),
        type: 'spend_spike',
        severity: excessCost > 50 ? 'high' : 'medium',
        title:       `Spend spike detected on ${spike.date}`,
        description: `${formatCost(spike.cost)} spent on ${spike.date} — ${Math.round(spike.cost / avg)}x your daily average of ${formatCost(avg)}. This could be a runaway loop, batch job, or accidental re-run.`,
        estimatedWaste: excessCost,
        recommendation: 'Add budget alerts and request deduplication to catch this automatically next time.',
      })
    }
  }

  // ── Rule 3: Spend acceleration ─────────────────────────────────────────
  // Last 7 days spend vs prior 7 days
  if (dailyTrend.length >= 14) {
    const last7  = dailyTrend.slice(-7).reduce((s, d) => s + d.cost, 0)
    const prior7 = dailyTrend.slice(-14, -7).reduce((s, d) => s + d.cost, 0)

    if (prior7 > 0 && last7 > prior7 * 1.5) {
      const acceleration = last7 - prior7
      const pctIncrease  = Math.round(((last7 - prior7) / prior7) * 100)

      insights.push({
        id:   makeId(),
        type: 'acceleration',
        severity: pctIncrease > 100 ? 'high' : 'medium',
        title:       `Spend up ${pctIncrease}% in the last 7 days`,
        description: `Last 7 days: ${formatCost(last7)} vs prior 7 days: ${formatCost(prior7)}. Your AI spend is accelerating. At this rate your monthly bill will be ${formatCost(last7 * 4.3)}.`,
        estimatedWaste: acceleration * 3, // projected extra cost this month
        recommendation: 'Set a monthly budget limit and enable 80% alert to catch this before it compounds.',
      })
    }
  }

  // ── Rule 4: No model diversity ─────────────────────────────────────────
  // One model is over 90% of spend and it's expensive
  const expensiveModels = ['gpt-4o', 'gpt-4-turbo', 'gpt-4']
  const dominant = modelBreakdown.find(m => m.pct >= 90 && expensiveModels.includes(m.model))

  if (dominant && modelBreakdown.length === 1) {
    const savings = dominant.cost * 0.25

    insights.push({
      id:   makeId(),
      type: 'no_diversity',
      severity: 'medium',
      title:       `100% of spend on ${dominant.model}`,
      description: `All ${formatCost(dominant.cost)} went to ${dominant.model} with no fallback models. A mixed strategy routing cheaper tasks to smaller models typically reduces spend by 20–40%.`,
      estimatedWaste: savings,
      recommendation: `Add gpt-4o-mini or gemini-2.0-flash for simple tasks. Could save ${formatCost(savings)}/month with minimal quality impact.`,
    })
  }

  // ── Rule 5: Token bloat ────────────────────────────────────────────────
  // High average tokens per request suggests bloated prompts
  const totalTokens   = modelBreakdown.reduce((s, m) => s + m.tokens, 0)
  const totalRequests = modelBreakdown.reduce((s, m) => s + m.requests, 0)

  if (totalRequests > 50) {
    const avgTokensPerReq = totalTokens / totalRequests

    if (avgTokensPerReq > 3000) {
      const bloatFraction  = Math.min(0.35, (avgTokensPerReq - 2000) / avgTokensPerReq)
      const estimatedWaste = totalSpend * bloatFraction

      insights.push({
        id:   makeId(),
        type: 'token_bloat',
        severity: avgTokensPerReq > 6000 ? 'high' : 'low',
        title:       `High avg tokens per request: ${Math.round(avgTokensPerReq).toLocaleString()}`,
        description: `Your average request uses ${Math.round(avgTokensPerReq).toLocaleString()} tokens. Large system prompts, repeated context, or full document inclusion are common causes. Trimming prompts by 30% could save significant cost.`,
        estimatedWaste,
        recommendation: `Review your system prompts for repetition. Consider prompt compression or context trimming. Estimated saving: ${formatCost(estimatedWaste)}/month.`,
      })
    }
  }

  // Total waste estimate
  const totalWaste = insights.reduce((s, i) => s + i.estimatedWaste, 0)
  const savingsPct = totalSpend > 0 ? Math.min(60, Math.round((totalWaste / totalSpend) * 100)) : 0

  // Sort by severity then waste amount
  const severityOrder = { high: 0, medium: 1, low: 2 }
  insights.sort((a, b) =>
    severityOrder[a.severity] - severityOrder[b.severity] ||
    b.estimatedWaste - a.estimatedWaste
  )

  return { totalWaste, savingsPct, insights }
}
