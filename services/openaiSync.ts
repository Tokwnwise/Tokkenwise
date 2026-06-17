import { PrismaClient } from '@prisma/client'
import { calcCost } from '../types'

const prisma = new PrismaClient()

// Simple encryption for MVP — replace with proper KMS in production
function encrypt(text: string): string {
  return Buffer.from(text).toString('base64')
}

function decrypt(encoded: string): string {
  return Buffer.from(encoded, 'base64').toString('utf-8')
}

// Validate the API key actually works before saving
export async function validateOpenAIKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (res.status === 401) return { valid: false, error: 'Invalid API key. Check it and try again.' }
    if (res.status === 429) return { valid: false, error: 'Rate limited. Try again in a moment.' }
    if (!res.ok)            return { valid: false, error: `OpenAI returned ${res.status}` }
    return { valid: true }
  } catch {
    return { valid: false, error: 'Could not reach OpenAI. Check your connection.' }
  }
}

// Save key and kick off sync
export async function connectAndSync(teamId: string, apiKey: string): Promise<{
  success: boolean
  error?: string
  recordsSynced?: number
}> {
  // 1. Validate first
  const validation = await validateOpenAIKey(apiKey)
  if (!validation.valid) return { success: false, error: validation.error }

  // 2. Save encrypted key
  await prisma.apiConnection.upsert({
    where:  { teamId_provider: { teamId, provider: 'openai' } },
    update: { encryptedKey: encrypt(apiKey), syncStatus: 'syncing', syncError: null },
    create: { teamId, provider: 'openai', encryptedKey: encrypt(apiKey), syncStatus: 'syncing' },
  })

  // 3. Sync 30 days
  const result = await syncUsageData(teamId, apiKey)

  // 4. Update status
  await prisma.apiConnection.update({
    where: { teamId_provider: { teamId, provider: 'openai' } },
    data: {
      syncStatus: result.success ? 'done' : 'error',
      syncError:  result.error ?? null,
      lastSyncAt: result.success ? new Date() : undefined,
    },
  })

  return result
}

// Pull usage from OpenAI and store in DB
export async function syncUsageData(teamId: string, apiKey?: string): Promise<{
  success: boolean
  error?: string
  recordsSynced?: number
}> {
  // If no key passed, load from DB
  if (!apiKey) {
    const conn = await prisma.apiConnection.findUnique({
      where: { teamId_provider: { teamId, provider: 'openai' } },
    })
    if (!conn) return { success: false, error: 'No API connection found' }
    apiKey = decrypt(conn.encryptedKey)
  }

  const endDate   = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  const startTime = Math.floor(startDate.getTime() / 1000)
  const endTime   = Math.floor(endDate.getTime()   / 1000)

  try {
    // Fetch from OpenAI completions usage endpoint
    const params = new URLSearchParams({
      start_time: String(startTime),
      end_time:   String(endTime),
      limit:      '100',
      group_by:   'model',
    })

    const res = await fetch(
      `https://api.openai.com/v1/organization/usage/completions?${params}`,
      { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.error?.message ?? `OpenAI API error: ${res.status}` }
    }

    const data = await res.json()
    const rows  = data.data ?? []

    if (rows.length === 0) {
      return { success: true, recordsSynced: 0 }
    }

    // Upsert each row into DB
    let synced = 0
    for (const row of rows) {
      const date = new Date(row.start_time * 1000)
      date.setHours(0, 0, 0, 0)

      const cost = calcCost(row.model ?? 'gpt-4o', row.input_tokens ?? 0, row.output_tokens ?? 0)

      await prisma.usageRecord.upsert({
        where: {
          teamId_date_model: { teamId, date, model: row.model ?? 'unknown' }
        },
        update: {
          inputTokens:  row.input_tokens  ?? 0,
          outputTokens: row.output_tokens ?? 0,
          totalTokens:  (row.input_tokens ?? 0) + (row.output_tokens ?? 0),
          requestCount: row.num_model_requests ?? 0,
          cost,
        },
        create: {
          teamId,
          date,
          model:        row.model         ?? 'unknown',
          inputTokens:  row.input_tokens  ?? 0,
          outputTokens: row.output_tokens ?? 0,
          totalTokens:  (row.input_tokens ?? 0) + (row.output_tokens ?? 0),
          requestCount: row.num_model_requests ?? 0,
          cost,
        },
      })
      synced++
    }

    return { success: true, recordsSynced: synced }

  } catch (err: any) {
    return { success: false, error: err.message ?? 'Sync failed' }
  }
}
