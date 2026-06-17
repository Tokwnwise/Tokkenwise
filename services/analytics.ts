import { PrismaClient } from '@prisma/client'
import type { AnalyticsResult, DaySpend, ModelSpend } from '../types'

const prisma = new PrismaClient()

export async function getAnalytics(teamId: string, days = 30): Promise<AnalyticsResult> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  const [records, connection] = await Promise.all([
    prisma.usageRecord.findMany({
      where:   { teamId, date: { gte: since } },
      orderBy: { date: 'asc' },
    }),
    prisma.apiConnection.findFirst({
      where: { teamId, provider: 'openai' },
    }),
  ])

  if (records.length === 0) {
    return {
      totalSpend:       0,
      totalRequests:    0,
      totalTokens:      0,
      avgDailyCost:     0,
      projectedMonthly: 0,
      topModel:         '—',
      dailyTrend:       [],
      modelBreakdown:   [],
      lastSyncAt:       connection?.lastSyncAt?.toISOString() ?? null,
    }
  }

  // Totals
 const totalSpend    = records.reduce((s: number, r) => s + r.cost, 0)
const totalRequests = records.reduce((s: number, r) => s + r.requestCount, 0)
const totalTokens   = records.reduce((s: number, r) => s + r.totalTokens, 0)
  // Daily trend
  const dayMap = new Map<string, DaySpend>()
  for (const r of records) {
    const key = r.date.toISOString().split('T')[0]
    const ex  = dayMap.get(key)
    if (ex) {
      ex.cost     += r.cost
      ex.requests += r.requestCount
    } else {
      dayMap.set(key, { date: key, cost: r.cost, requests: r.requestCount })
    }
  }
  const dailyTrend = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date))

  // Burn rate
  const activeDays    = dailyTrend.length || 1
  const avgDailyCost  = totalSpend / activeDays
  const today         = new Date()
  const daysInMonth   = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const projectedMonthly = avgDailyCost * daysInMonth

  // Model breakdown
  const modelMap = new Map<string, ModelSpend>()
  for (const r of records) {
    const ex = modelMap.get(r.model)
    if (ex) {
      ex.cost     += r.cost
      ex.requests += r.requestCount
      ex.tokens   += r.totalTokens
    } else {
      modelMap.set(r.model, { model: r.model, cost: r.cost, requests: r.requestCount, tokens: r.totalTokens, pct: 0 })
    }
  }

  const modelBreakdown = Array.from(modelMap.values())
    .sort((a, b) => b.cost - a.cost)
    .map(m => ({ ...m, pct: Math.round((m.cost / totalSpend) * 100) }))

  const topModel = modelBreakdown[0]?.model ?? '—'

  return {
    totalSpend,
    totalRequests,
    totalTokens,
    avgDailyCost,
    projectedMonthly,
    topModel,
    dailyTrend,
    modelBreakdown,
    lastSyncAt: connection?.lastSyncAt?.toISOString() ?? null,
  }
}
