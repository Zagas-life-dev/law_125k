import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const ADMIN_PROFILES_TABLE = process.env.SUPABASE_ADMIN_PROFILES_TABLE ?? 'user_profiles'

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase server environment variables.')
  }

  // Service-role client (server-only). We still verify admin status before doing any write ops.
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function getBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader) return null
  const trimmed = authorizationHeader.trim()
  if (!trimmed.toLowerCase().startsWith('bearer ')) return null
  return trimmed.slice(7).trim()
}

export type AdminCheckResult =
  | { isAdmin: true; userId: string; email?: string }
  | { isAdmin: false; reason: string }

export async function requireAdmin(authorizationHeader: string | null): Promise<AdminCheckResult> {
  const token = getBearerToken(authorizationHeader)
  if (!token) return { isAdmin: false, reason: 'Missing Bearer token.' }

  const supabaseAdmin = getSupabaseAdmin()

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
  if (userError || !userData?.user) {
    return { isAdmin: false, reason: 'Invalid session.' }
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from(ADMIN_PROFILES_TABLE)
    .select('is_admin')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (profileError) return { isAdmin: false, reason: 'Could not check admin status.' }

  if (!profile?.is_admin) return { isAdmin: false, reason: 'Not authorized.' }

  return { isAdmin: true, userId: userData.user.id, email: userData.user.email ?? undefined }
}

