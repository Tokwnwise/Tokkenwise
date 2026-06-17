import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const conn = await prisma.apiConnection.findFirst({
    where: { teamId: user.id, provider: 'openai' },
  })

  return NextResponse.json({
    connected:  !!conn,
    lastSyncAt: conn?.lastSyncAt?.toISOString() ?? null,
    syncStatus: conn?.syncStatus ?? 'none',
    syncError:  conn?.syncError  ?? null,
  })
}
