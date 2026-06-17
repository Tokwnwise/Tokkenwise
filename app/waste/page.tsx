'use client'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { fetchAnalytics, fetchWaste } from '@/lib/api'
import { formatCost } from '@/types'
import type { WasteResult, WasteInsight } from '@/types'

const SEVERITY_BADGE: Record<string, string> = {
  high:   'badge-red',
  medium: 'badge-amber',
  low:    'badge-muted',
}

const TYPE_ICON: Record<string, string> = {
  model_overkill: '🤖',
  spend_spike:    '📈',
  acceleration:   '⚡',
  no_diversity:   '🎯',
  token_bloat:    '📝',
}

function InsightCard({ insight, rank }: { insight: WasteInsight; rank: number }) {
  const [open, setOpen] = useState(rank === 0)

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 12, overflow: 'hidden',
      borderLeft: `3px solid ${insight.severity === 'high' ? 'var(--red)' : insight.severity === 'medium' ? 'var(--amber)' : 'var(--border2)'}`,
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
      >
        <span style={{ fontSize: 22, flexShrink: 0 }}>{TYPE_ICON[insight.type]}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{insight.title}</span>
            <span className={`badge ${SEVERITY_BADGE[insight.severity]}`}>{insight.severity}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--sub)', fontFamily: 'var(--mono)' }}>
            Estimated waste: {formatCost(insight.estimatedWaste)}/mo
          </div>
        </div>
        <div style={{ fontSize: 18, color: 'var(--dim)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
          ↓
        </div>
      </div>

      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.7, marginTop: 16, marginBottom: 16 }}>
            {insight.description}
          </p>
          <div style={{
            background: 'rgba(163,230,53,0.05)', border: '1px solid rgba(163,230,53,0.15)',
            borderRadius: 9, padding: '12px 16px',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--lime)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>
              Recommendation
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.6 }}>
              {insight.recommendation}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function WastePage() {
  const [waste,   setWaste]   = useState<WasteResult | null>(null)
  const [spend,   setSpend]   = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [w, a] = await Promise.all([fetchWaste(), fetchAnalytics(30)])
      setWaste(w)
      setSpend(a.totalSpend)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <span style={{ fontWeight: 600, fontSize: 15 }}>Waste Report</span>
        </div>

        <div className="page">
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--sub)', padding: '60px 0' }}>
              <div className="spinner" /> Analysing your usage…
            </div>
          ) : !waste || waste.insights.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No significant waste detected</div>
              <div style={{ color: 'var(--sub)', fontSize: 13 }}>
                Your AI usage looks efficient. Check back after more usage data accumulates.
              </div>
            </div>
          ) : (
            <>
              {/* Summary banner */}
              <div className="fade-up" style={{
                background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.2)',
                borderRadius: 12, padding: '20px 24px', marginBottom: 24,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--lime)', letterSpacing: '-0.5px', marginBottom: 4 }}>
                      {formatCost(waste.totalWaste)}<span style={{ fontSize: 15, fontWeight: 400, color: 'var(--sub)' }}>/mo fixable waste</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--sub)' }}>
                      That's {waste.savingsPct}% of your {formatCost(spend)} monthly spend — fixable without changing your product
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--dim)', marginBottom: 4 }}>Issues found</div>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>{waste.insights.length}</div>
                  </div>
                </div>
              </div>

              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Estimated waste/mo', value: formatCost(waste.totalWaste), color: 'var(--lime)' },
                  { label: '% of total spend',   value: `${waste.savingsPct}%`,       color: 'var(--amber)' },
                  { label: 'Issues detected',    value: String(waste.insights.length), color: 'var(--red)' },
                ].map(k => (
                  <div key={k.label} className="kpi-card fade-up" style={{ borderTop: `1.5px solid ${k.color}` }}>
                    <div className="kpi-label">{k.label}</div>
                    <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
                  </div>
                ))}
              </div>

              {/* Insights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {waste.insights.map((insight, i) => (
                  <InsightCard key={insight.id} insight={insight} rank={i} />
                ))}
              </div>

              {/* Upsell to SDK — Phase 2 hook */}
              <div style={{
                marginTop: 24, padding: '20px 24px',
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                      Want these fixed automatically?
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--sub)', lineHeight: 1.6 }}>
                      The Tokkenwise Firewall SDK intercepts your requests and applies model routing, caching, and deduplication automatically. No dashboard required.
                    </div>
                  </div>
                  <a
                    href="mailto:hello@tokkenwise.com?subject=Interested in Firewall SDK"
                    className="btn btn-primary"
                    style={{ flexShrink: 0 }}
                  >
                    Get early access →
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
