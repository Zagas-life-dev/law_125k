import { NextResponse } from 'next/server'
import { requireStudentSession } from '@/lib/studentServerAuth'
import {
  computeBilling,
  getStudentLinkageStatus,
  optionalString,
  parseEnrollmentTracks,
  parseLocationMode,
  parsePlanType,
  type StudentApiSuccess,
  type StudentDetail,
  type StudentRow,
} from '@/lib/studentModels'

export async function GET(req: Request) {
  const auth = await requireStudentSession(req)
  if (!auth.ok) return auth.response

  const { data: student, error } = await auth.supabase
    .from('students')
    .select(
      'id, user_id, registration_id, reg_number, student_id, status, full_name, email, phone, age, gender, city_state, location_mode, custom_location_text, height_value, height_unit, weight_value, weight_unit, bust_chest_value, bust_chest_unit, waist_value, waist_unit, hips_value, hips_unit, hips_converted, shoe_size, instagram_handle, tiktok_or_other, tracks, plan_type, custom_plan_name, total_due, amount_paid, scholarship_type, scholarship_percent, scholarship_amount_applied, outstanding_balance, due_date, monthly_enabled, monthly_amount, headshot_url, profile_front_url, profile_left_url, profile_right_url, profile_back_url, full_body_front_url, full_body_left_url, full_body_right_url, full_body_back_url, walk_video_1_url, walk_video_2_url, admin_notes, onboarding_completed, created_at, updated_at'
    )
    .eq('user_id', auth.user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to load student profile.', details: error.message } },
      { status: 500 }
    )
  }

  if (!student) {
    return NextResponse.json<StudentApiSuccess<null>>({ success: true, data: null }, { status: 200 })
  }

  let authEmail: string | null = auth.user.email ?? null
  if (!authEmail && student.user_id) {
    const authUser = await auth.supabase.auth.admin.getUserById(student.user_id)
    authEmail = authUser.data.user?.email ?? null
  }

  const row = student as StudentRow
  const linkageStatus = getStudentLinkageStatus({
    userId: row.user_id,
    studentEmail: row.email,
    authEmail,
  })
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
          : optionalString(row.custom_location_text) || 'Custom'

  const detail: StudentDetail = {
    id: row.registration_id ?? row.id,
    studentId: row.student_id,
    identity: {
      fullName: optionalString(row.full_name) ?? 'Not provided',
      email: optionalString(row.email),
      phone: optionalString(row.phone) ?? 'Not provided',
      gender: optionalString(row.gender) ?? 'Not provided',
      age: row.age ?? null,
      status: optionalString(row.status) ?? 'active',
      cityState: optionalString(row.city_state) ?? 'Not provided',
    },
    authLink: {
      status: linkageStatus,
      userId: row.user_id,
      userEmail: authEmail,
    },
    socials: {
      instagram: optionalString(row.instagram_handle),
      tiktokOrOther: optionalString(row.tiktok_or_other),
    },
    measurements: {
      heightValue: optionalString(row.height_value) ?? '',
      heightUnit: optionalString(row.height_unit) ?? '',
      weightValue: optionalString(row.weight_value) ?? '',
      weightUnit: optionalString(row.weight_unit) ?? '',
      bustChestValue: optionalString(row.bust_chest_value) ?? '',
      bustChestUnit: optionalString(row.bust_chest_unit) ?? '',
      waistValue: optionalString(row.waist_value) ?? '',
      waistUnit: optionalString(row.waist_unit) ?? '',
      hipsValue: optionalString(row.hips_value) ?? '',
      hipsUnit: optionalString(row.hips_unit) ?? '',
      hipsConverted: optionalString(row.hips_converted),
      shoeSize: optionalString(row.shoe_size) ?? '',
    },
    media: {
      headshotUrl: optionalString(row.headshot_url),
      walkVideos: [optionalString(row.walk_video_1_url), optionalString(row.walk_video_2_url)],
      profileImages: {
        front: optionalString(row.profile_front_url),
        left: optionalString(row.profile_left_url),
        right: optionalString(row.profile_right_url),
        back: optionalString(row.profile_back_url),
      },
      fullBodyImages: {
        front: optionalString(row.full_body_front_url),
        left: optionalString(row.full_body_left_url),
        right: optionalString(row.full_body_right_url),
        back: optionalString(row.full_body_back_url),
      },
    },
    enrollment: {
      tracks: parseEnrollmentTracks(row.tracks ?? []),
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
