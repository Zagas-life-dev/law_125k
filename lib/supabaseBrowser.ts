import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

let client: SupabaseClient | null = null

export function getSupabaseBrowser() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null
  if (client) return client

  client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  return client
}

