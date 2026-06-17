'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { syncOpenAI } from '@/lib/api'

type Step = 'connect' | 'syncing' | 'done'

const SYNC_MESSAGES = [
  'Validating your API key…',
  'Connecting to OpenAI…',
  'Fetching last 30 days of usage…',
  'Calculating costs per model…',
  'Running waste detection…',
  'Building your dashboard…',
]

export default function OnboardingPage() {
  const router  = useRouter()
  const [step,      setStep]      = useState<Step>('connect')
  const [apiKey,    setApiKey]    = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [syncing,   setSyncing]   = useState(false)
  const [msgIdx,    setMsgIdx]    = useState(0)
  const [records,   setRecords]   = useState(0)

  async function handleConnect() {
    if (!apiKey.trim()) return
    setError(null)
    setSyncing(true)
    setStep('syncing')

    // Animate messages while syncing
    let idx = 0
    const interval = setInterval(() => {
      idx = Math.min(idx + 1, SYNC_MESSAGES.length - 1)
      setMsgIdx(idx)
    }, 1800)

    const result = await syncOpenAI(apiKey.trim())
    clearInterval(interval)
    setSyncing(false)

    if (!result.success) {
      setError(result.error ?? 'Sync failed')
      setStep('connect')
      return
    }

    setRecords(result.recordsSynced ?? 0)
    setStep('done')
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, background: 'var(--lime)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#09090b' }}>T</div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.3px' }}>Tokkenwise</span>
        </div>

        {/* ── Step: Connect ── */}
        {step === 'connect' && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px', marginBottom: 8 }}>
              Connect your OpenAI account
            </div>
            <p style={{ color: 'var(--sub)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              Paste your API key and we'll pull 30 days of usage data. You'll see exactly what you're spending and where the waste is — in under 60 seconds.
            </p>

            {/* Security note */}
            <div style={{
              display: 'flex', gap: 10, padding: '12px 14px',
              background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)',
              borderRadius: 9, marginBottom: 24, fontSize: 12.5, color: 'var(--sub)', lineHeight: 1.6,
            }}>
              <span style={{ flexShrink: 0 }}>🔒</span>
              <span>Your key is encrypted and only used to fetch usage data — never to make requests. You can remove it anytime from Settings.</span>
            </div>

            <label className="label">OpenAI API Key</label>
            <input
              className="input"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={e => { setApiKey(e.target.value); setError(null) }}
              onKeyDown={e => e.key === 'Enter' && handleConnect()}
              autoFocus
              style={{ marginBottom: error ? 8 : 20 }}
            />

            {error && (
              <div style={{ fontSize: 12.5, color: 'var(--red)', fontFamily: 'var(--mono)', marginBottom: 16, padding: '8px 12px', background: 'var(--red-bg)', borderRadius: 7 }}>
                {error}
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15 }}
              disabled={!apiKey.trim() || syncing}
              onClick={handleConnect}
            >
              Analyse my AI spend →
            </button>

            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--dim)' }}>
              No code changes · No credit card · Free to start
            </div>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--dim)' }}>
              <strong style={{ color: 'var(--sub)' }}>Where to find your key:</strong>{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" style={{ color: 'var(--blue)' }}>
                platform.openai.com/api-keys
              </a>
              {' '}→ Create new secret key. Needs <em>Read</em> permission.
            </div>
          </div>
        )}

        {/* ── Step: Syncing ── */}
        {step === 'syncing' && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              border: '3px solid var(--border2)', borderTopColor: 'var(--lime)',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 24px',
            }} />
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Pulling your data…</div>
            <div style={{ fontSize: 13.5, color: 'var(--sub)', fontFamily: 'var(--mono)', minHeight: 20 }}>
              {SYNC_MESSAGES[msgIdx]}
            </div>
            <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 24 }}>
              This usually takes 10–20 seconds
            </div>
          </div>
        )}

        {/* ── Step: Done ── */}
        {step === 'done' && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(163,230,53,0.1)', border: '2px solid rgba(163,230,53,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 20px',
            }}>
              ✓
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px', marginBottom: 8 }}>
              Your data is ready
            </div>
            <div style={{ fontSize: 14, color: 'var(--sub)', marginBottom: 32, lineHeight: 1.7 }}>
              Pulled {records} records from OpenAI. Your dashboard is ready with 30 days of cost data and a waste analysis.
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}
              onClick={() => router.push('/dashboard')}
            >
              See my dashboard →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
