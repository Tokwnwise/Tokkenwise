'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 60,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 26, height: 26, background: 'var(--lime)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#09090b' }}>T</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Tokkenwise</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login" className="btn btn-ghost" style={{ padding: '7px 16px' }}>Log in</Link>
          <Link href="/signup" className="btn btn-primary" style={{ padding: '7px 16px' }}>Start free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px 60px',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)',
          borderRadius: 100, padding: '5px 14px',
          fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--lime)',
          marginBottom: 28,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          No code changes required
        </div>

        <h1 style={{
          fontFamily: 'var(--font)', fontSize: 'clamp(40px, 7vw, 76px)',
          fontWeight: 800, letterSpacing: '-2.5px', lineHeight: 1.05,
          color: '#fafafa', maxWidth: 800, marginBottom: 20,
        }}>
          Your AI bill has a leak.<br />
          <span style={{ color: 'var(--lime)' }}>Find it in 60 seconds.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--sub)',
          maxWidth: 480, lineHeight: 1.7, marginBottom: 40,
        }}>
          Paste your OpenAI key. We pull 30 days of data and show you exactly where your money is going — and what's being wasted.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
          <Link href="/signup" className="btn btn-primary btn-lg">
            See my AI spend →
          </Link>
          <Link href="/login" className="btn btn-ghost btn-lg">
            Sign in
          </Link>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--dim)' }}>
          Free · No credit card · No code changes
        </div>

        {/* Mini dashboard preview */}
        <div style={{
          marginTop: 64, width: '100%', maxWidth: 860,
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
        }}>
          {/* Fake topbar */}
          <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dim)', marginLeft: 10 }}>
              tokkenwise.com/dashboard
            </span>
          </div>

          {/* Fake savings banner */}
          <div style={{ padding: 20 }}>
            <div style={{
              background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.2)',
              borderRadius: 10, padding: '14px 18px', marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>💡</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--lime)' }}>We found $312/mo in fixable waste</div>
                  <div style={{ fontSize: 11.5, color: 'var(--sub)', marginTop: 2 }}>3 issues detected · 37% of your spend</div>
                </div>
              </div>
              <div style={{ background: 'var(--lime)', color: '#09090b', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 7 }}>See how to fix it →</div>
            </div>

            {/* Fake KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: '30-day spend', value: '$847', color: 'var(--lime)' },
                { label: 'Daily avg',    value: '$28',  color: 'var(--blue)' },
                { label: 'Top model',    value: 'gpt-4o', color: 'var(--amber)' },
              ].map(k => (
                <div key={k.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', borderTop: `1.5px solid ${k.color}` }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* Fake chart bars */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>Daily spend — last 14 days</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
                {[18,22,19,31,28,24,26,42,38,29,33,36,40,44].map((h, i) => (
                  <div key={i} style={{
                    flex: 1, borderRadius: '3px 3px 0 0',
                    background: i === 7 ? 'var(--red)' : 'rgba(163,230,53,0.4)',
                    height: `${h / 44 * 100}%`,
                    transition: 'height 0.3s',
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 48px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lime)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>How it works</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text)', marginBottom: 12 }}>Three steps. 60 seconds.</h2>
          <p style={{ color: 'var(--sub)', fontSize: 15 }}>No code changes. No proxy. No SDK.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { num: '01', title: 'Paste your API key', desc: 'Sign up and paste your OpenAI API key. We validate it and connect — no code changes in your app.' },
            { num: '02', title: 'We pull 30 days',    desc: 'We fetch your usage history directly from OpenAI. Takes about 15 seconds. You see real cost data immediately.' },
            { num: '03', title: 'See the waste',       desc: 'The dashboard shows your spend, top models, daily trend, and exactly which waste costs you the most.' },
          ].map(s => (
            <div key={s.num} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 22px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lime)', marginBottom: 12 }}>{s.num}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 14 }}>
          Find your AI leak today
        </h2>
        <p style={{ color: 'var(--sub)', fontSize: 16, marginBottom: 36, maxWidth: 400, margin: '0 auto 36px' }}>
          Most teams find hundreds of dollars in waste in their first session. It's free.
        </p>
        <Link href="/signup" className="btn btn-primary btn-lg">
          Start free — see my spend →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--dim)' }}>© 2026 Tokkenwise</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href={`mailto:hello@tokkenwise.com`} style={{ fontSize: 12, color: 'var(--dim)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>

    </div>
  )
}
