import { NextResponse } from 'next/server'
import { getSupabaseAdminClient, requireAdmin } from '@/lib/supabaseAdmin'
import {
  computeBilling,
  formatBillingStatus,
  parseEnrollmentTracks,
  parsePlanType,
  parseScholarshipType,
  toMoney,
  getStudentLinkageStatus,
  optionalString,
  type StudentRow,
  type StudentApiError,
  type StudentApiSuccess,
  type StudentListItem,
} from '@/lib/studentModels'

function apiError(message: string, status: number, details?: string) {
  return NextResponse.json<StudentApiError>({ success: false, error: { message, details } }, { status })
}

type CreateStudentBody = {
  registrationId?: string
  userId?: string | null
  status?: string
  locationMode?: 'online' | 'lagos' | 'abuja' | 'custom' | string
  customLocationText?: string
  adminNotes?: string
  enrollmentTracks?: string[] | string
  planType?: string
  customPlanName?: string
  totalDue?: number | string
  amountPaid?: number | string
  dueDate?: string
  monthlyEnabled?: boolean
  monthlyAmount?: number | string
  scholarshipType?: string
  scholarshipPercent?: number | string
}

export async function GET(req: Request) {
  const adminCheck = await requireAdmin(req.headers.get('authorization'))
  if (!adminCheck.isAdmin) {
    return apiError(adminCheck.reason, 401)
  }

  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from('students')
    .select(
      'id, registration_id, student_id, user_id, full_name, email, phone, location_mode, custom_location_text, headshot_url, tracks, total_due, amount_paid, scholarship_type, scholarship_percent, created_at'
    )
    .order('created_at', { ascending: false })

  if (error) {
    return apiError('Failed to load students.', 500, error.message)
  }

  const list: StudentListItem[] = ((data ?? []) as StudentRow[]).map((row) => {
    const billingCalc = computeBilling({
      totalDue: row.total_due,
      amountPaid: row.amount_paid,
      scholarshipType: row.scholarship_type,
      scholarshipPercent: row.scholarship_percent,
    })
    const linkageStatus = getStudentLinkageStatus({
      userId: row.user_id,
      studentEmail: row.email,
    })
    const locationDisplay =
      row.location_mode === 'online'
        ? 'Online'
        : row.location_mode === 'lagos'
          ? 'Lagos'
          : row.location_mode === 'abuja'
            ? 'Abuja'
            : optionalString(row.custom_location_text) || 'Custom'
    return {
      id: row.registration_id ?? row.id,
      studentId: row.student_id ?? null,
      fullName: optionalString(row.full_name) ?? 'Not provided',
      email: row.email,
      phone: optionalString(row.phone) ?? 'Not provided',
      headshotUrl: row.headshot_url,
      locationDisplay,
      enrollmentTracks: parseEnrollmentTracks(row.tracks ?? []),
      linkageStatus,
      billingStatus: formatBillingStatus(billingCalc.outstandingBalance, billingCalc.totalDue),
      createdAt: row.created_at,
    }
  })

  return NextResponse.json<StudentApiSuccess<StudentListItem[]>>({ success: true, data: list }, { status: 200 })
}

export async function POST(req: Request) {
  const adminCheck = await requireAdmin(req.headers.get('authorization'))
  if (!adminCheck.isAdmin) {
    return apiError(adminCheck.reason, 401)
  }

  let body: CreateStudentBody
  try {
    body = (await req.json()) as CreateStudentBody
  } catch {
    return apiError('Invalid JSON body.', 400)
  }

  const registrationId = (body.registrationId ?? '').trim()
  if (!registrationId) {
    return apiError('registrationId is required.', 400)
  }

  const supabase = getSupabaseAdminClient()
  const { data: registration, error: registrationError } = await supabase
    .from('masterclass_registrations')
    .select('id, reg_number, full_name, email, phone, age, gender, city_state')
    .eq('id', registrationId)
    .maybeSingle<{
      id: string
      reg_number: number | null
      full_name: string | null
      email: string | null
      phone: string | null
      age: number | null
      gender: string | null
      city_state: string | null
    }>()

  if (registrationError) {
    return apiError('Failed to validate registration.', 500, registrationError.message)
  }
  if (!registration) {
    return apiError('Registration record not found.', 404)
  }

  const tracks = parseEnrollmentTracks(body.enrollmentTracks)
  const planType = parsePlanType(body.planType)
  const scholarshipType = parseScholarshipType(body.scholarshipType)
  const scholarshipPercent = Math.min(100, toMoney(body.scholarshipPercent))

  const { error: upsertError } = await supabase.from('students').upsert(
    {
      registration_id: registrationId,
      reg_number: registration.reg_number,
      user_id: body.userId?.trim() || null,
      status: body.status?.trim() || 'active',
      full_name: registration.full_name,
      email: registration.email,
      phone: registration.phone,
      age: registration.age,
      gender: registration.gender,
      city_state: registration.city_state,
      location_mode: body.locationMode?.trim()?.toLowerCase() || null,
      custom_location_text: body.customLocationText?.trim() || null,
      admin_notes: body.adminNotes?.trim() || null,
      tracks,
      plan_type: planType,
      custom_plan_name: body.customPlanName?.trim() || null,
      total_due: toMoney(body.totalDue),
      amount_paid: toMoney(body.amountPaid),
      due_date: body.dueDate?.trim() || null,
      monthly_enabled: Boolean(body.monthlyEnabled),
      monthly_amount: body.monthlyEnabled ? toMoney(body.monthlyAmount) : null,
      scholarship_type: scholarshipType,
      scholarship_percent: scholarshipType === 'percentage' ? scholarshipPercent : 0,
      outstanding_balance: Math.max(0, toMoney(body.totalDue) - toMoney(body.amountPaid)),
    },
    { onConflict: 'registration_id' }
  )

  if (upsertError) {
    const firstError = upsertError
    if (/duplicate key value|unique/i.test(firstError.message)) {
      return apiError('Link conflict: this auth user is already linked to another student.', 409, firstError.message)
    }
    return apiError('Failed to create/update student.', 500, firstError.message)
  }

  return NextResponse.json<StudentApiSuccess<{ registrationId: string }>>(
    { success: true, data: { registrationId } },
    { status: 201 }
  )
}
