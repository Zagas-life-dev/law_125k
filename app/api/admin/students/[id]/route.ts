import { NextResponse } from 'next/server'
import { getSupabaseAdminClient, requireAdmin } from '@/lib/supabaseAdmin'
import {
  computeBilling,
  getStudentLinkageStatus,
  optionalString,
  parseEnrollmentTracks,
  parseLocationMode,
  parsePlanType,
  parseScholarshipType,
  toMoney,
  type StudentRow,
  type StudentApiError,
  type StudentApiSuccess,
  type StudentDetail,
} from '@/lib/studentModels'

function apiError(message: string, status: number, details?: string) {
  return NextResponse.json<StudentApiError>({ success: false, error: { message, details } }, { status })
}

type PatchStudentBody = {
  userId?: string | null
  status?: string
  adminNotes?: string
  locationMode?: string
  customLocationText?: string
  enrollmentTracks?: string[] | string
  media?: {
    headshotUrl?: string | null
    profileFrontUrl?: string | null
    profileLeftUrl?: string | null
    profileRightUrl?: string | null
    profileBackUrl?: string | null
    fullBodyFrontUrl?: string | null
    fullBodyLeftUrl?: string | null
    fullBodyRightUrl?: string | null
    fullBodyBackUrl?: string | null
  }
  videos?: {
    walkVideo1Url?: string | null
    walkVideo2Url?: string | null
  }
  billing?: {
    planType?: string
    customPlanName?: string | null
    totalDue?: number | string
    amountPaid?: number | string
    dueDate?: string | null
    monthlyEnabled?: boolean
    monthlyAmount?: number | string | null
    scholarshipType?: string
    scholarshipPercent?: number | string
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(req.headers.get('authorization'))
  if (!adminCheck.isAdmin) {
    return apiError(adminCheck.reason, 401)
  }

  const { id } = await params
  const routeId = id.trim()
  if (!routeId) {
    return apiError('Invalid student id.', 400)
  }

  const supabase = getSupabaseAdminClient()
  const studentSelect =
    'id, user_id, registration_id, reg_number, student_id, status, full_name, email, phone, age, gender, city_state, location_mode, custom_location_text, height_value, height_unit, weight_value, weight_unit, bust_chest_value, bust_chest_unit, waist_value, waist_unit, hips_value, hips_unit, hips_converted, shoe_size, instagram_handle, tiktok_or_other, tracks, plan_type, custom_plan_name, total_due, amount_paid, due_date, monthly_enabled, monthly_amount, scholarship_type, scholarship_percent, scholarship_amount_applied, outstanding_balance, headshot_url, profile_front_url, profile_left_url, profile_right_url, profile_back_url, full_body_front_url, full_body_left_url, full_body_right_url, full_body_back_url, walk_video_1_url, walk_video_2_url, admin_notes, onboarding_completed, created_at, updated_at'
  const byRegistration = await supabase
    .from('students')
    .select(studentSelect)
    .eq('registration_id', routeId)
    .maybeSingle<StudentRow>()

  let row = byRegistration.data ?? null
  let rowError = byRegistration.error
  if (!row && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(routeId)) {
    const byId = await supabase
      .from('students')
      .select(studentSelect)
      .eq('id', routeId)
      .maybeSingle<StudentRow>()
    row = byId.data ?? null
    rowError = byId.error
  }

  if (rowError) {
    return apiError('Failed to load student record.', 500, rowError.message)
  }
  if (!row) {
    return apiError('Student record not found.', 404)
  }

  const { data: registration, error: registrationError } = await supabase
    .from('masterclass_registrations')
    .select(
      [
        'id',
        'full_name',
        'email',
        'phone',
        'gender',
        'age',
        'city_state',
        'location',
        'status',
        'instagram_handle',
        'tiktok_or_other',
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
        'headshot_url',
        'full_body_url',
        'walk_video_url',
        'created_at',
      ].join(', ')
    )
    .eq('id', row.registration_id ?? '__none__')
    .maybeSingle<{
      id: string
      status: string | null
      full_name: string | null
      email: string | null
      phone: string | null
      gender: string | null
      age: number | null
      city_state: string | null
      location: string | null
      instagram_handle: string | null
      tiktok_or_other: string | null
      height_value: string | null
      height_unit: string | null
      weight_value: string | null
      weight_unit: string | null
      bust_chest_value: string | null
      bust_chest_unit: string | null
      waist_value: string | null
      waist_unit: string | null
      hips_value: string | null
      hips_unit: string | null
      hips_converted: string | null
      shoe_size: string | null
      headshot_url: string | null
      full_body_url: string | null
      walk_video_url: string | null
      created_at: string
    }>()

  if (registrationError && !/0 rows/i.test(registrationError.message)) {
    return apiError('Failed to load linked registration record.', 500, registrationError.message)
  }

  let authEmail: string | null = null
  if (row.user_id) {
    const authUser = await supabase.auth.admin.getUserById(row.user_id)
    authEmail = authUser.data.user?.email ?? null
  }
  const linkageStatus = getStudentLinkageStatus({
    userId: row.user_id,
    studentEmail: row.email ?? registration?.email ?? null,
    authEmail,
  })
  const tracks = parseEnrollmentTracks(row.tracks ?? [])

  const billingCalc = computeBilling({
    totalDue: row.total_due,
    amountPaid: row.amount_paid,
    scholarshipType: row.scholarship_type,
    scholarshipPercent: row.scholarship_percent,
  })

  const locationMode = parseLocationMode(row.location_mode)

  const locationDisplay =
    locationMode === 'online'
      ? 'Online'
      : locationMode === 'lagos'
        ? 'Lagos'
        : locationMode === 'abuja'
          ? 'Abuja'
          : optionalString(row.custom_location_text) ||
            optionalString(registration?.location) ||
            'Not provided'

  const detail: StudentDetail = {
    id: row.registration_id ?? row.id,
    studentId: row.student_id ?? null,
    identity: {
      fullName: optionalString(row.full_name) ?? optionalString(registration?.full_name) ?? 'Not provided',
      email: optionalString(row.email) ?? optionalString(registration?.email),
      phone: optionalString(row.phone) ?? optionalString(registration?.phone) ?? 'Not provided',
      gender: optionalString(row.gender) ?? optionalString(registration?.gender) ?? 'Not provided',
      age: row.age ?? registration?.age ?? null,
      status: optionalString(row.status) ?? optionalString(registration?.status) ?? 'active',
      cityState: optionalString(row.city_state) ?? optionalString(registration?.city_state) ?? 'Not provided',
    },
    socials: {
      instagram: optionalString(row.instagram_handle) ?? optionalString(registration?.instagram_handle),
      tiktokOrOther: optionalString(row.tiktok_or_other) ?? optionalString(registration?.tiktok_or_other),
    },
    authLink: {
      status: linkageStatus,
      userId: row.user_id ?? null,
      userEmail: authEmail,
    },
    measurements: {
      heightValue: optionalString(row.height_value) ?? optionalString(registration?.height_value) ?? '',
      heightUnit: optionalString(row.height_unit) ?? optionalString(registration?.height_unit) ?? '',
      weightValue: optionalString(row.weight_value) ?? optionalString(registration?.weight_value) ?? '',
      weightUnit: optionalString(row.weight_unit) ?? optionalString(registration?.weight_unit) ?? '',
      bustChestValue: optionalString(row.bust_chest_value) ?? optionalString(registration?.bust_chest_value) ?? '',
      bustChestUnit: optionalString(row.bust_chest_unit) ?? optionalString(registration?.bust_chest_unit) ?? '',
      waistValue: optionalString(row.waist_value) ?? optionalString(registration?.waist_value) ?? '',
      waistUnit: optionalString(row.waist_unit) ?? optionalString(registration?.waist_unit) ?? '',
      hipsValue: optionalString(row.hips_value) ?? optionalString(registration?.hips_value) ?? '',
      hipsUnit: optionalString(row.hips_unit) ?? optionalString(registration?.hips_unit) ?? '',
      hipsConverted: optionalString(row.hips_converted) ?? optionalString(registration?.hips_converted),
      shoeSize: optionalString(row.shoe_size) ?? optionalString(registration?.shoe_size) ?? '',
    },
    media: {
      headshotUrl: optionalString(row.headshot_url) ?? optionalString(registration?.headshot_url),
      walkVideos: [
        optionalString(row.walk_video_1_url) ?? optionalString(registration?.walk_video_url),
        optionalString(row.walk_video_2_url),
      ],
      profileImages: {
        front: optionalString(row.profile_front_url),
        left: optionalString(row.profile_left_url),
        right: optionalString(row.profile_right_url),
        back: optionalString(row.profile_back_url),
      },
      fullBodyImages: {
        front: optionalString(row.full_body_front_url) ?? optionalString(registration?.full_body_url),
        left: optionalString(row.full_body_left_url),
        right: optionalString(row.full_body_right_url),
        back: optionalString(row.full_body_back_url),
      },
    },
    enrollment: {
      tracks,
    },
    billing: {
      planType: parsePlanType(row.plan_type),
      customPlanName: optionalString(row.custom_plan_name),
      totalDue: billingCalc.totalDue,
      amountPaid: billingCalc.amountPaid,
      scholarshipType: billingCalc.scholarshipType,
      scholarshipPercent: billingCalc.scholarshipPercent,
      scholarshipAmountApplied: billingCalc.scholarshipAmountApplied,
      outstandingBalance: billingCalc.outstandingBalance,
      dueDate: optionalString(row.due_date),
      monthlyEnabled: Boolean(row.monthly_enabled),
      monthlyAmount: row.monthly_enabled ? row.monthly_amount ?? 0 : null,
    },
    location: {
      mode: locationMode,
      customLocationText: optionalString(row.custom_location_text),
      display: locationDisplay,
    },
    notes: optionalString(row.admin_notes),
    onboardingCompleted: Boolean(row.onboarding_completed),
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  }

  return NextResponse.json<StudentApiSuccess<StudentDetail>>({ success: true, data: detail }, { status: 200 })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(req.headers.get('authorization'))
  if (!adminCheck.isAdmin) {
    return apiError(adminCheck.reason, 401)
  }

  const { id } = await params
  const routeId = id.trim()
  if (!routeId) {
    return apiError('Invalid student id.', 400)
  }

  let body: PatchStudentBody
  try {
    body = (await req.json()) as PatchStudentBody
  } catch {
    return apiError('Invalid JSON body.', 400)
  }

  const supabase = getSupabaseAdminClient()
  const byRegistration = await supabase
    .from('students')
    .select('id, registration_id')
    .eq('registration_id', routeId)
    .maybeSingle<{ id: string; registration_id: string | null }>()
  let target = byRegistration.data ?? null
  let targetError = byRegistration.error
  if (!target && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(routeId)) {
    const byId = await supabase
      .from('students')
      .select('id, registration_id')
      .eq('id', routeId)
      .maybeSingle<{ id: string; registration_id: string | null }>()
    target = byId.data ?? null
    targetError = byId.error
  }
  if (targetError) return apiError('Failed to validate student.', 500, targetError.message)
  if (!target) return apiError('Student record not found.', 404)

  const payload: Record<string, unknown> = {}
  if (body.userId !== undefined) payload.user_id = body.userId?.trim() || null
  if (body.status !== undefined) payload.status = body.status?.trim() || null
  if (body.adminNotes !== undefined) payload.admin_notes = body.adminNotes?.trim() || null
  if (body.locationMode !== undefined) payload.location_mode = body.locationMode?.trim()?.toLowerCase() || null
  if (body.customLocationText !== undefined) payload.custom_location_text = body.customLocationText?.trim() || null
  if (body.enrollmentTracks !== undefined) payload.tracks = parseEnrollmentTracks(body.enrollmentTracks)
  if (body.media) {
    payload.headshot_url = body.media.headshotUrl ?? null
    payload.profile_front_url = body.media.profileFrontUrl ?? null
    payload.profile_left_url = body.media.profileLeftUrl ?? null
    payload.profile_right_url = body.media.profileRightUrl ?? null
    payload.profile_back_url = body.media.profileBackUrl ?? null
    payload.full_body_front_url = body.media.fullBodyFrontUrl ?? null
    payload.full_body_left_url = body.media.fullBodyLeftUrl ?? null
    payload.full_body_right_url = body.media.fullBodyRightUrl ?? null
    payload.full_body_back_url = body.media.fullBodyBackUrl ?? null
  }
  if (body.videos) {
    payload.walk_video_1_url = body.videos.walkVideo1Url ?? null
    payload.walk_video_2_url = body.videos.walkVideo2Url ?? null
  }
  if (body.billing) {
    const scholarshipType = parseScholarshipType(body.billing.scholarshipType)
    const scholarshipPercent = scholarshipType === 'percentage' ? Math.min(100, toMoney(body.billing.scholarshipPercent)) : 0
    payload.plan_type = parsePlanType(body.billing.planType)
    payload.custom_plan_name = body.billing.customPlanName?.trim() || null
    payload.total_due = toMoney(body.billing.totalDue)
    payload.amount_paid = toMoney(body.billing.amountPaid)
    payload.due_date = body.billing.dueDate?.trim() || null
    payload.monthly_enabled = Boolean(body.billing.monthlyEnabled)
    payload.monthly_amount = body.billing.monthlyEnabled ? toMoney(body.billing.monthlyAmount) : null
    payload.scholarship_type = scholarshipType
    payload.scholarship_percent = scholarshipPercent
    payload.scholarship_amount_applied =
      scholarshipType === 'full'
        ? toMoney(body.billing.totalDue)
        : scholarshipType === 'percentage'
          ? (toMoney(body.billing.totalDue) * scholarshipPercent) / 100
          : 0
    payload.outstanding_balance = Math.max(0, toMoney(body.billing.totalDue) - toMoney(body.billing.amountPaid))
  }

  const { error: updateError } = await supabase.from('students').update(payload).eq('id', target.id)
  if (updateError) {
    if (/duplicate key value|unique/i.test(updateError.message)) {
      return apiError('Link conflict: this auth user is already linked to another student.', 409, updateError.message)
    }
    return apiError('Failed to update student profile.', 500, updateError.message)
  }

  return NextResponse.json<StudentApiSuccess<{ id: string }>>(
    { success: true, data: { id: target.registration_id ?? target.id } },
    { status: 200 }
  )
}
