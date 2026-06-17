import { NextRequest, NextResponse } from 'next/server'
import { connectAndSync } from '@/services/openaiSync'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    // Get session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { apiKey } = await req.json()
    if (!apiKey?.trim()) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 })
    }

    // Use user ID as team ID for MVP (one team per user)
    const teamId = user.id

    const result = await connectAndSync(teamId, apiKey.trim())

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      recordsSynced: result.recordsSynced,
      message: `Synced ${result.recordsSynced} records`,
    })

  } catch (err: any) {
    console.error('[sync] Error:', err)
    return NextResponse.json({ error: 'Sync failed. Please try again.' }, { status: 500 })
  }
}
