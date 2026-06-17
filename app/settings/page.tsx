'use client'
import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { syncOpenAI, getSupabase } from '@/lib/api'

export default function SettingsPage() {
  const [connected, setConnected] = useState(false)
  const [lastSync,  setLastSync]  = useState<string | null>(null)
  const [syncing,   setSyncing]   = useState(false)
  const [apiKey,    setApiKey]    = useState('')
  const [showInput, setShowInput] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [success,   setSuccess]   = useState<string | null>(null)
  const [loading,   setLoading]   = useState(true)

  async function authHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await getSupabase().auth.getSession()
    return session ? { Authorization: `Bearer ${session.access_token}` } : {}
  }

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/connection', { headers: await authHeaders() })
        if (res.ok) {
          const d = await res.json()
          setConnected(d.connected)
          setLastSync(d.lastSyncAt)
        }
      } catch {}
      setLoading(false)
    }
    check()
  }, [])

  async function handleConnect() {
    if (!apiKey.trim()) return
    setSyncing(true); setError(null)
    const result = await syncOpenAI(apiKey.trim())
    setSyncing(false)
    if (!result.success) { setError(result.error ?? 'Failed'); return }
    setConnected(true); setLastSync(new Date().toISOString())
    setSuccess(`Synced ${result.recordsSynced} records`)
    setShowInput(false); setApiKey('')
    setTimeout(() => setSuccess(null), 4000)
  }

  async function handleReSync() {
    setSyncing(true); setError(null)
    try {
      const res = await fetch('/api/sync/openai', {
        method: 'POST',
        headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
        body: JSON.stringify({ reSync: true }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setLastSync(new Date().toISOString())
      setSuccess(`Re-synced ${d.recordsSynced} records`)
      setTimeout(() => setSuccess(null), 4000)
    } catch (e: any) { setError(e.message) }
    setSyncing(false)
  }

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <span style={{ fontWeight: 600, fontSize: 15 }}>Settings</span>
        </div>
        <div className="page" style={{ maxWidth: 600 }}>

          {success && (
            <div className="fade-up" style={{ padding: '12px 16px', background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 9, fontSize: 13, color: 'var(--lime)', marginBottom: 16 }}>
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="fade-up" style={{ padding: '12px 16px', background: 'var(--red-bg)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 9, fontSize: 13, color: 'var(--red)', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div className="card fade-up" style={{ marginBottom: 12 }}>
            <div className="card-header">
              <span className="card-title">OpenAI Connection</span>
              {connected && <span className="badge badge-green">● Connected</span>}
            </div>
            <div className="card-body">
              {loading ? (
                <div style={{ display: 'flex', gap: 8, color: 'var(--sub)', alignItems: 'center' }}>
                  <div className="spinner" /> Checking…
                </div>
              ) : connected ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>API key connected ••••••••••••</div>
                      {lastSync && <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--sub)' }}>Last sync: {new Date(lastSync).toLocaleString()}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }} disabled={syncing} onClick={handleReSync}>
                        {syncing ? <><div className="spinner" /> Syncing…</> : '↺ Re-sync'}
                      </button>
                      <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px', color: 'var(--red)', borderColor: 'rgba(248,113,113,0.2)' }}
                        onClick={() => { setConnected(false); setShowInput(true) }}>
                        Replace key
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--dim)', padding: '10px 14px', background: 'var(--surface)', borderRadius: 8 }}>
                    Syncs automatically every hour. Click Re-sync to pull latest data now.
                  </div>
                </div>
              ) : !showInput ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--sub)' }}>No API key connected.</div>
                  <button className="btn btn-primary" style={{ padding: '7px 16px', fontSize: 13 }} onClick={() => setShowInput(true)}>+ Connect OpenAI</button>
                </div>
              ) : (
                <div>
                  <label className="label">OpenAI API Key</label>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <input className="input" type="password" placeholder="sk-..." value={apiKey}
                      onChange={e => setApiKey(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleConnect()} autoFocus />
                    <button className="btn btn-primary" style={{ flexShrink: 0 }} disabled={!apiKey.trim() || syncing} onClick={handleConnect}>
                      {syncing ? <div className="spinner" /> : 'Connect'}
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--dim)' }}>
                    Find at <a href="https://platform.openai.com/api-keys" target="_blank" style={{ color: 'var(--blue)' }}>platform.openai.com/api-keys</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card fade-up" style={{ animationDelay: '80ms' }}>
            <div className="card-header"><span className="card-title">Account</span></div>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>Free plan</div>
                  <div style={{ fontSize: 12, color: 'var(--sub)' }}>30-day history · Waste detection · Dashboard</div>
                </div>
                <a href="mailto:hello@tokkenwise.com?subject=Upgrade" className="btn btn-ghost" style={{ fontSize: 12 }}>Upgrade →</a>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
