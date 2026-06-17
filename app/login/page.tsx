'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setError(null)

    const { error } = await getSupabase().auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    router.push('/dashboard')
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
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Welcome back</div>
          <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 28 }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--lime)', textDecoration: 'none' }}>Sign up free</Link>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 8, fontSize: 13, color: 'var(--red)', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@company.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Your password"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
            disabled={loading || !email || !password} onClick={handleLogin}>
            {loading ? <><div className="spinner" /> Signing in…</> : 'Sign in →'}
          </button>
        </div>
      </div>
    </div>
  )
}
