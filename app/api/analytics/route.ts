import { NextRequest, NextResponse } from 'next/server'
import { getAnalytics } from '@/services/analytics'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const days    = Number(req.nextUrl.searchParams.get('days') ?? '30')
    const teamId  = user.id
    const result  = await getAnalytics(teamId, days)

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[analytics] Error:', err)
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 })
  }
}
