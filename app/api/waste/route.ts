import { NextRequest, NextResponse } from 'next/server'
import { getAnalytics } from '@/services/analytics'
import { detectWaste } from '@/services/wasteDetection'
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

    const analytics = await getAnalytics(user.id, 30)
    const waste     = detectWaste(
      analytics.modelBreakdown,
      analytics.dailyTrend,
      analytics.totalSpend
    )

    return NextResponse.json(waste)
  } catch (err: any) {
    console.error('[waste] Error:', err)
    return NextResponse.json({ error: 'Failed to detect waste' }, { status: 500 })
  }
}
