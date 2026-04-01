import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'
import { sendWebPushNotification } from '@/lib/webPush'

type StudentPaymentTarget = {
  id: string
  full_name: string | null
  due_date: string | null
  outstanding_balance: number | null
}

type PushSubscriptionRow = {
  id: string
  student_id: string
  endpoint: string
  p256dh: string
  auth: string
}

function startOfDayUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function diffDaysUTC(from: Date, to: Date) {
  const ms = startOfDayUTC(to).getTime() - startOfDayUTC(from).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

function getReminderKeyAndMessage(daysToDue: number, dueDate: string, outstanding: number) {
  if (daysToDue === 7) {
    return {
      key: `before_7_${dueDate}`,
      title: 'Payment Due in 7 Days',
      body: `Your payment of ₦${outstanding.toLocaleString()} is due in one week.`,
    }
  }
  if (daysToDue === 3) {
    return {
      key: `before_3_${dueDate}`,
      title: 'Payment Due in 3 Days',
      body: `Your payment of ₦${outstanding.toLocaleString()} is due in 3 days.`,
    }
  }
  if (daysToDue === 1) {
    return {
      key: `before_1_${dueDate}`,
      title: 'Payment Due Tomorrow',
      body: `Your payment of ₦${outstanding.toLocaleString()} is due tomorrow.`,
    }
  }
  if (daysToDue === 0) {
    return {
      key: `due_today_${dueDate}`,
      title: 'Payment Due Today',
      body: `Your payment of ₦${outstanding.toLocaleString()} is due today.`,
    }
  }
  if (daysToDue < 0) {
    const overdueDays = Math.abs(daysToDue)
    if (overdueDays % 3 === 0) {
      return {
        key: `overdue_${overdueDays}_${dueDate}`,
        title: 'Payment Overdue',
        body: `Your payment is ${overdueDays} days overdue. Outstanding: ₦${outstanding.toLocaleString()}.`,
      }
    }
  }
  return null
}

export async function POST(req: Request) {
  const secret = process.env.PAYMENT_REMINDER_CRON_SECRET
  const provided = req.headers.get('x-cron-secret')
  if (!secret || provided !== secret) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized.' } }, { status: 401 })
  }

  const supabase = getSupabaseAdminClient()
  const today = new Date()

  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, full_name, due_date, outstanding_balance')
    .gt('outstanding_balance', 0)
    .not('due_date', 'is', null)

  if (studentsError) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to query students.', details: studentsError.message } },
      { status: 500 }
    )
  }

  let remindersQueued = 0
  let remindersSent = 0
  let remindersSkipped = 0

  for (const student of (students ?? []) as StudentPaymentTarget[]) {
    if (!student.due_date) continue
    const due = new Date(`${student.due_date}T00:00:00.000Z`)
    const daysToDue = diffDaysUTC(today, due)
    const outstanding = Number(student.outstanding_balance ?? 0)
    if (!Number.isFinite(outstanding) || outstanding <= 0) continue

    const plan = getReminderKeyAndMessage(daysToDue, student.due_date, outstanding)
    if (!plan) continue
    remindersQueued += 1

    const { data: alreadySent, error: logReadError } = await supabase
      .from('payment_reminder_logs')
      .select('id')
      .eq('student_id', student.id)
      .eq('reminder_key', plan.key)
      .maybeSingle()

    if (logReadError) {
      remindersSkipped += 1
      continue
    }
    if (alreadySent) {
      remindersSkipped += 1
      continue
    }

    const { data: subscriptions, error: subsError } = await supabase
      .from('student_push_subscriptions')
      .select('id, student_id, endpoint, p256dh, auth')
      .eq('student_id', student.id)

    if (subsError || !subscriptions?.length) {
      remindersSkipped += 1
      continue
    }

    const failedEndpoints: string[] = []
    let sentToAny = false

    for (const sub of subscriptions as PushSubscriptionRow[]) {
      try {
        await sendWebPushNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          {
            title: plan.title,
            body: plan.body,
            url: '/student/profile',
            icon: '/icons/icon-192.svg',
            badge: '/icons/icon-192.svg',
          }
        )
        sentToAny = true
      } catch {
        failedEndpoints.push(sub.endpoint)
      }
    }

    if (failedEndpoints.length > 0) {
      await supabase.from('student_push_subscriptions').delete().in('endpoint', failedEndpoints)
    }

    if (sentToAny) {
      await supabase.from('payment_reminder_logs').insert({
        student_id: student.id,
        reminder_key: plan.key,
        due_date: student.due_date,
        outstanding_balance: outstanding,
        sent_at: new Date().toISOString(),
      })
      remindersSent += 1
    } else {
      remindersSkipped += 1
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      processedStudents: (students ?? []).length,
      remindersQueued,
      remindersSent,
      remindersSkipped,
    },
  })
}
