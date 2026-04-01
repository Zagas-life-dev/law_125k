import { NextResponse } from 'next/server'
import { requireStudentSession } from '@/lib/studentServerAuth'
import { getWebPushPublicKey, isWebPushConfigured } from '@/lib/webPush'

type PushSubscriptionBody = {
  endpoint?: string
  keys?: {
    p256dh?: string
    auth?: string
  }
}

export async function GET(req: Request) {
  const auth = await requireStudentSession(req)
  if (!auth.ok) return auth.response

  const { data: student, error } = await auth.supabase
    .from('students')
    .select('id')
    .eq('user_id', auth.user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to load student notification status.' } },
      { status: 500 }
    )
  }

  if (!student) {
    return NextResponse.json(
      { success: false, error: { message: 'No student profile found for this account.' } },
      { status: 404 }
    )
  }

  const { count, error: countError } = await auth.supabase
    .from('student_push_subscriptions')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', student.id)

  if (countError) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to load push subscription state.' } },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      enabled: (count ?? 0) > 0,
      configured: isWebPushConfigured(),
      publicKey: getWebPushPublicKey(),
    },
  })
}

export async function POST(req: Request) {
  const auth = await requireStudentSession(req)
  if (!auth.ok) return auth.response

  const body = (await req.json().catch(() => ({}))) as PushSubscriptionBody
  const endpoint = String(body.endpoint ?? '').trim()
  const p256dh = String(body.keys?.p256dh ?? '').trim()
  const keyAuth = String(body.keys?.auth ?? '').trim()

  if (!endpoint || !p256dh || !keyAuth) {
    return NextResponse.json(
      { success: false, error: { message: 'Invalid push subscription payload.' } },
      { status: 400 }
    )
  }

  const { data: student, error: studentError } = await auth.supabase
    .from('students')
    .select('id')
    .eq('user_id', auth.user.id)
    .maybeSingle()

  if (studentError) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to load student profile.' } },
      { status: 500 }
    )
  }

  if (!student) {
    return NextResponse.json(
      { success: false, error: { message: 'No student profile found for this account.' } },
      { status: 404 }
    )
  }

  const { error } = await auth.supabase.from('student_push_subscriptions').upsert(
    {
      student_id: student.id,
      user_id: auth.user.id,
      endpoint,
      p256dh,
      auth: keyAuth,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: 'endpoint' }
  )

  if (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to save push subscription.', details: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, data: { subscribed: true } })
}

export async function DELETE(req: Request) {
  const auth = await requireStudentSession(req)
  if (!auth.ok) return auth.response

  const body = (await req.json().catch(() => ({}))) as PushSubscriptionBody
  const endpoint = String(body.endpoint ?? '').trim()

  if (!endpoint) {
    return NextResponse.json(
      { success: false, error: { message: 'Missing endpoint to unsubscribe.' } },
      { status: 400 }
    )
  }

  const { error } = await auth.supabase
    .from('student_push_subscriptions')
    .delete()
    .eq('endpoint', endpoint)
    .eq('user_id', auth.user.id)

  if (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to unsubscribe push notifications.' } },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, data: { subscribed: false } })
}
