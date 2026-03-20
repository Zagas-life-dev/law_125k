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

export async function GET(req: Request) {
  const check = await requireAdmin(req.headers.get('authorization'))
  if (!check.isAdmin) {
    return NextResponse.json({ error: check.reason }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('masterclass_registrations')
    .select(
      [
        'id',
        'location',
        'full_name',
        'age',
        'date_of_birth',
        'gender',
        'phone',
        'email',
        'city_state',
        'height_value',
        'height_unit',
        'weight_value',
        'weight_unit',
        'bust_chest_value',
        'bust_chest_unit',
        'waist_value',
        'waist_unit',
        'hips_value',
        'hips_unit',
        'hips_converted',
        'shoe_size',
        'has_modeling_experience',
        'experience_types',
        'prior_training',
        'full_session_availability',
        'motivation',
        'goals',
        'expected_gain',
        'instagram_handle',
        'tiktok_or_other',
        'consent_photo_video',
        'referral_source',
        'headshot_url',
        'full_body_url',
        'walk_video_url',
        'created_at',
      ].join(', ')
    )
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ registrations: data ?? [] }, { status: 200 })
}

