'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/api'

export default function SignupPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  async function handleSignup() {
    if (!email || !password || !name) return
    setLoading(true)
    setError(null)

    const { error } = await getSupabase().auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/onboarding')
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, background: 'var(--lime)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#09090b' }}>T</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Tokkenwise</span>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Create your account</div>
          <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 28 }}>
            Already have one?{' '}
            <Link href="/login" style={{ color: 'var(--lime)', textDecoration: 'none' }}>Sign in</Link>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 8, fontSize: 13, color: 'var(--red)', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label className="label">Your name</label>
            <input className="input" type="text" placeholder="Ada Lovelace"
              value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Work email</label>
            <input className="input" type="email" placeholder="ada@yourcompany.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Min 8 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignup()} />
          </div>

          <button className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
            disabled={loading || !email || !password || !name}
            onClick={handleSignup}>
            {loading ? <><div className="spinner" /> Creating account…</> : 'Create account →'}
          </button>

          <div style={{ fontSize: 11.5, color: 'var(--dim)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
            No credit card required · Free to start
          </div>
        </div>
      </div>
    </div>
  )
}
