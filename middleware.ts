import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PUBLIC = ['/', '/login', '/signup']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (PUBLIC.includes(pathname) || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('sb-access-token')?.value
  if (!token) {
    const url = new URL('/login', req.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    const url = new URL('/login', req.url)
    const res = NextResponse.redirect(url)
    res.cookies.delete('sb-access-token')
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/waste/:path*', '/settings/:path*', '/onboarding/:path*'],
}
