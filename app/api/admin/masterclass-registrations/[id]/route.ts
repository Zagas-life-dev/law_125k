import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabaseAdmin'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase server environment variables.')
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const check = await requireAdmin(req.headers.get('authorization'))
  if (!check.isAdmin) {
    return NextResponse.json({ error: check.reason }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()

  const { error } = await supabase.from('masterclass_registrations').delete().eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}

