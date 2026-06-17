import { createClient } from '@supabase/supabase-js'
import type { AnalyticsResult, WasteResult } from '@/types'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function authHeaders(): Promise<Record<string, string>> {
  const supabase = getSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return {}
  return { Authorization: `Bearer ${session.access_token}` }
}

export async function fetchAnalytics(days = 30): Promise<AnalyticsResult> {
  const headers = await authHeaders()
  const res = await fetch(`/api/analytics?days=${days}`, { headers })
  if (!res.ok) throw new Error('Failed to load analytics')
  return res.json()
}

export async function fetchWaste(): Promise<WasteResult> {
  const headers = await authHeaders()
  const res = await fetch('/api/waste', { headers })
  if (!res.ok) throw new Error('Failed to detect waste')
  return res.json()
}

export async function syncOpenAI(apiKey: string): Promise<{ success: boolean; recordsSynced?: number; error?: string }> {
  const headers = await authHeaders()
  const res = await fetch('/api/sync/openai', {
    method:  'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body:    JSON.stringify({ apiKey }),
  })
  return res.json()
}

export { getSupabase }
