'use client'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { SpendChart } from '@/components/SpendChart'
import { fetchAnalytics, fetchWaste } from '@/lib/api'
import { formatCost, formatTokens } from '@/types'
import type { AnalyticsResult, WasteResult } from '@/types'
import Link from 'next/link'

const SEVERITY_COLOR: Record<string, string> = {
  high:   'var(--red)',
  medium: 'var(--amber)',
  low:    'var(--sub)',
}

const MODEL_COLORS = ['#a3e635', '#60a5fa', '#f472b6', '#fb923c', '#a78bfa']

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null)
  const [waste,     setWaste]     = useState<WasteResult | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [a, w] = await Promise.all([fetchAnalytics(30), fetchWaste()])
        setAnalytics(a)
        setWaste(w)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="page-shell">
      <Sidebar />
      <main className="main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 12, color: 'var(--sub)' }}>
          <div className="spinner" />
          Loading your data…
        </div>
      </main>
    </div>
  )

  // No data yet — prompt to connect
  if (!loading && analytics?.totalSpend === 0 && !analytics?.lastSyncAt) {
    return (
      <div className="page-shell">
        <Sidebar />
        <main className="main">
          <div className="topbar">
            <span style={{ fontWeight: 600, fontSize: 15 }}>Dashboard</span>
          </div>
          <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 56px)' }}>
            <div style={{ textAlign: 'center', maxWidth: 400 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔌</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No data yet</div>
              <div style={{ color: 'var(--sub)', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
                Connect your OpenAI API key to pull 30 days of usage data and see where your AI budget is going.
              </div>
              <Link href="/onboarding" className="btn btn-primary btn-lg">
                Connect OpenAI →
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const a = analytics!
  const w = waste

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <span style={{ fontWeight: 600, fontSize: 15 }}>Dashboard</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {a.lastSyncAt && (
              <span className="mono muted" style={{ fontSize: 11 }}>
                Last sync {new Date(a.lastSyncAt).toLocaleString()}
              </span>
            )}
            <Link href="/settings" className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
              ↺ Re-sync
            </Link>
          </div>
        </div>

        <div className="page">

          {/* Savings banner — the WOW moment */}
          {w && w.totalWaste > 0 && (
            <div className="fade-up" style={{
              background: 'rgba(163,230,53,0.06)',
              border: '1px solid rgba(163,230,53,0.2)',
              borderRadius: 12, padding: '14px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>💡</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--lime)' }}>
                    We found {formatCost(w.totalWaste)}/mo in fixable waste
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 2 }}>
                    {w.insights.length} issue{w.insights.length !== 1 ? 's' : ''} detected · {w.savingsPct}% of your spend
                  </div>
                </div>
              </div>
              <Link href="/waste" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>
                See how to fix it →
              </Link>
            </div>
          )}

          {/* KPIs */}
          <div className="kpi-grid fade-up">
            <div className="kpi-card green">
              <div className="kpi-label">30-day spend</div>
              <div className="kpi-value">{formatCost(a.totalSpend)}</div>
              <div className="kpi-sub">Projected: {formatCost(a.projectedMonthly)}/mo</div>
            </div>
            <div className="kpi-card blue">
              <div className="kpi-label">Daily avg</div>
              <div className="kpi-value">{formatCost(a.avgDailyCost)}</div>
              <div className="kpi-sub">Over last 30 days</div>
            </div>
            <div className="kpi-card amber">
              <div className="kpi-label">Total requests</div>
              <div className="kpi-value">{a.totalRequests.toLocaleString()}</div>
              <div className="kpi-sub">Top model: {a.topModel}</div>
            </div>
            <div className="kpi-card" style={{ borderTop: '1.5px solid var(--dim)' }}>
              <div className="kpi-label">Total tokens</div>
              <div className="kpi-value">{formatTokens(a.totalTokens)}</div>
              <div className="kpi-sub">Input + output</div>
            </div>
          </div>

          {/* Chart + Model breakdown */}
          <div className="grid-3-1">
            <div className="card fade-up">
              <div className="card-header">
                <span className="card-title">Daily Spend — Last 30 Days</span>
              </div>
              <div className="card-body">
                {a.dailyTrend.length > 0
                  ? <SpendChart data={a.dailyTrend} height={160} />
                  : <div className="empty">No daily data</div>
                }
              </div>
            </div>

            <div className="card fade-up">
              <div className="card-header">
                <span className="card-title">Cost by Model</span>
              </div>
              <div className="card-body" style={{ padding: '12px 0 4px' }}>
                {a.modelBreakdown.map((m, i) => (
                  <div key={m.model} style={{ padding: '9px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--text)' }}>{m.model}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--sub)' }}>{formatCost(m.cost)}</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--surface)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${m.pct}%`, background: MODEL_COLORS[i % MODEL_COLORS.length], borderRadius: 3, opacity: 0.8, transition: 'width 0.6s' }} />
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--dim)', marginTop: 3 }}>{m.pct}% of spend</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent daily breakdown table */}
          <div className="card fade-up">
            <div className="card-header">
              <span className="card-title">Daily Breakdown</span>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Cost</th>
                  <th>Requests</th>
                  <th>vs Average</th>
                </tr>
              </thead>
              <tbody>
                {[...a.dailyTrend].reverse().slice(0, 14).map(day => {
                  const ratio = a.avgDailyCost > 0 ? day.cost / a.avgDailyCost : 1
                  const isSpike = ratio > 2
                  return (
                    <tr key={day.date}>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--sub)' }}>{day.date}</td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500 }}>{formatCost(day.cost)}</td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--sub)' }}>{day.requests.toLocaleString()}</td>
                      <td>
                        {isSpike
                          ? <span className="badge badge-red">▲ {Math.round(ratio)}× avg</span>
                          : <span className="badge badge-muted">{Math.round(ratio * 100)}%</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  )
}
