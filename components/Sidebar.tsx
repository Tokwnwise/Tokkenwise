'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/api'

const NAV = [
  { href: '/dashboard', label: 'Dashboard',   icon: '▦' },
  { href: '/waste',     label: 'Waste Report', icon: '⚠' },
  { href: '/settings',  label: 'Settings',     icon: '⚙' },
]

export function Sidebar() {
  const path   = usePathname()
  const router = useRouter()

  async function signOut() {
    await getSupabase().auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 26, height: 26, background: 'var(--lime)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#09090b' }}>T</div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>Tokkenwise</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {NAV.map(item => {
          const active = path.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '8px 10px', borderRadius: 8, marginBottom: 2,
              fontSize: 13.5, fontWeight: 500, textDecoration: 'none',
              background: active ? 'rgba(163,230,53,0.08)' : 'transparent',
              color:      active ? 'var(--lime)' : 'var(--sub)',
              transition: 'all 0.13s',
            }}>
              <span style={{ fontSize: 14, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
        <button onClick={signOut} style={{
          width: '100%', padding: '8px 10px', borderRadius: 8,
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 9,
          fontSize: 13, color: 'var(--dim)', transition: 'color 0.13s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--dim)')}
        >
          ↪ Sign out
        </button>
      </div>
    </aside>
  )
}
