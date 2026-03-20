import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
  try {
    const check = await requireAdmin(req.headers.get('authorization'))
    if (!check.isAdmin) {
      return NextResponse.json({ isAdmin: false, reason: check.reason }, { status: 401 })
    }

    return NextResponse.json({ isAdmin: true, userId: check.userId, email: check.email }, { status: 200 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ isAdmin: false, reason: message }, { status: 500 })
  }
}

