import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'
import { sendWebPushNotification } from '@/lib/webPush'
import { pickPromotionMessageForDate } from '@/lib/studentPromotions'

type PushSubscriptionRow = {
  endpoint: string
  p256dh: string
  auth: string
}

export async function POST(req: Request) {
  const secret = process.env.PAYMENT_REMINDER_CRON_SECRET
  const provided = req.headers.get('x-cron-secret')
  if (!secret || provided !== secret) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized.' } }, { status: 401 })
  }

  const today = new Date()
  const promo = pickPromotionMessageForDate(today)
  if (!promo) {
    return NextResponse.json({
      success: true,
      data: { sent: 0, skipped: 0, reason: 'No active promotion message configured.' },
    })
  }

  const supabase = getSupabaseAdminClient()
  const dayKey = today.toISOString().slice(0, 10)
  const reminderKey = `promo_${promo.id}_${dayKey}`

  const { data: subscriptions, error: subsError } = await supabase
    .from('student_push_subscriptions')
    .select('student_id, endpoint, p256dh, auth')

  if (subsError) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to load push subscriptions.', details: subsError.message } },
      { status: 500 }
    )
  }

  if (!subscriptions?.length) {
    return NextResponse.json({ success: true, data: { sent: 0, skipped: 0 } })
  }

  let sent = 0
  let skipped = 0
  const failedEndpoints: string[] = []

  for (const sub of subscriptions as (PushSubscriptionRow & { student_id: string })[]) {
    const { data: alreadySent } = await supabase
      .from('payment_reminder_logs')
      .select('id')
      .eq('student_id', sub.student_id)
      .eq('reminder_key', reminderKey)
      .maybeSingle()

    if (alreadySent) {
      skipped += 1
      continue
    }

    try {
      await sendWebPushNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        {
          title: promo.title,
          body: promo.body,
          url: promo.url || '/student/profile',
          icon: '/icons/icon-192.svg',
          badge: '/icons/icon-192.svg',
        }
      )

      await supabase.from('payment_reminder_logs').insert({
        student_id: sub.student_id,
        reminder_key: reminderKey,
        due_date: dayKey,
        outstanding_balance: 0,
        sent_at: new Date().toISOString(),
      })
      sent += 1
    } catch {
      failedEndpoints.push(sub.endpoint)
      skipped += 1
    }
  }

  if (failedEndpoints.length > 0) {
    await supabase.from('student_push_subscriptions').delete().in('endpoint', failedEndpoints)
  }

  return NextResponse.json({
    success: true,
    data: {
      messageId: promo.id,
      messageTitle: promo.title,
      sent,
      skipped,
    },
  })
}
