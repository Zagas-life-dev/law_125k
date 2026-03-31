import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase server environment variables.')
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function getBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader) return null
  const trimmed = authorizationHeader.trim()
  if (!trimmed.toLowerCase().startsWith('bearer ')) return null
  return trimmed.slice(7).trim()
}

export async function requireStudentSession(req: Request) {
  const token = getBearerToken(req.headers.get('authorization'))
  if (!token) {
    return {
      ok: false as const,
      response: NextResponse.json({ success: false, error: { message: 'Missing session token.' } }, { status: 401 }),
    }
  }
  const supabase = getSupabaseAdmin()
  const authRes = await supabase.auth.getUser(token)
  if (!authRes.data.user) {
    return {
      ok: false as const,
      response: NextResponse.json({ success: false, error: { message: 'Invalid student session.' } }, { status: 401 }),
    }
  }
  return { ok: true as const, supabase, user: authRes.data.user }
}
