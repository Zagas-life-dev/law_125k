import { NextResponse } from 'next/server'
import { computeBilling, parseScholarshipType, toMoney } from '@/lib/studentModels'
import { computeTotalFromPlans, normalizePlanCodes } from '@/lib/coursePlans'
import { requireStudentSession } from '@/lib/studentServerAuth'

export async function GET(req: Request) {
  const auth = await requireStudentSession(req)
  if (!auth.ok) return auth.response

  const { data, error } = await auth.supabase
    .from('students')
    .select(
      'user_id, full_name, phone, gender, city_state, location_mode, custom_location_text, tracks, scholarship_type, scholarship_percent, monthly_enabled, monthly_amount, due_date, total_due, amount_paid, scholarship_amount_applied, outstanding_balance, onboarding_completed, updated_at'
    )
    .eq('user_id', auth.user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ success: false, error: { message: 'Failed to load onboarding.', details: error.message } }, { status: 500 })
  }

  const preferredLocation =
    data?.location_mode === 'custom'
      ? data.custom_location_text
      : data?.location_mode

  return NextResponse.json(
    {
      success: true,
      data: data
        ? {
            user_id: data.user_id,
            full_name: data.full_name,
            phone: data.phone,
            gender: data.gender,
            city_state: data.city_state,
            preferred_location: preferredLocation ?? null,
            selected_tracks: data.tracks ?? [],
            scholarship_type: data.scholarship_type,
            scholarship_percent: data.scholarship_percent,
            monthly_enabled: data.monthly_enabled,
            monthly_amount: data.monthly_amount,
            due_date: data.due_date,
            total_due: data.total_due,
            amount_paid: data.amount_paid,
            scholarship_amount_applied: data.scholarship_amount_applied,
            outstanding_balance: data.outstanding_balance,
            completed: data.onboarding_completed,
            updated_at: data.updated_at,
          }
        : null,
    },
    { status: 200 }
  )
}

export async function PUT(req: Request) {
  const auth = await requireStudentSession(req)
  if (!auth.ok) return auth.response

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ success: false, error: { message: 'Invalid JSON body.' } }, { status: 400 })
  }

  const selectedTracks = normalizePlanCodes(body.selectedTracks)
  if (selectedTracks.length === 0) {
    return NextResponse.json({ success: false, error: { message: 'Please select at least one track.' } }, { status: 400 })
  }

  const fullName = String(body.fullName ?? '').trim()
  const phone = String(body.phone ?? '').trim()
  const cityState = String(body.cityState ?? '').trim()
  const gender = String(body.gender ?? '').trim()
  if (!fullName || !phone || !cityState || !gender) {
    return NextResponse.json({ success: false, error: { message: 'fullName, phone, cityState and gender are required.' } }, { status: 400 })
  }

  const baseTotal = computeTotalFromPlans(selectedTracks)
  const scholarshipType = parseScholarshipType(body.scholarshipType)
  const scholarshipPercent = scholarshipType === 'percentage' ? Math.min(100, toMoney(body.scholarshipPercent)) : 0
  const amountPaid = toMoney(body.amountPaid)

  const computed = computeBilling({
    totalDue: baseTotal,
    amountPaid,
    scholarshipType,
    scholarshipPercent,
  })

  const preferredLocationRaw = String(body.preferredLocation ?? '').trim().toLowerCase()
  const locationMode: 'online' | 'lagos' | 'abuja' | 'custom' =
    preferredLocationRaw === 'online' ||
    preferredLocationRaw === 'lagos' ||
    preferredLocationRaw === 'abuja'
      ? preferredLocationRaw
      : preferredLocationRaw
        ? 'custom'
        : 'custom'

  const payload = {
    user_id: auth.user.id,
    full_name: fullName,
    phone,
    gender,
    city_state: cityState,
    location_mode: locationMode,
    custom_location_text: locationMode === 'custom' ? String(body.preferredLocation ?? '').trim() || null : null,
    tracks: selectedTracks,
    scholarship_type: scholarshipType,
    scholarship_percent: scholarshipPercent,
    monthly_enabled: Boolean(body.monthlyEnabled),
    monthly_amount: body.monthlyEnabled ? toMoney(body.monthlyAmount) : null,
    due_date: String(body.dueDate ?? '').trim() || null,
    total_due: computed.totalDue,
    amount_paid: computed.amountPaid,
    scholarship_amount_applied: computed.scholarshipAmountApplied,
    outstanding_balance: computed.outstandingBalance,
    onboarding_completed: Boolean(body.completed),
  }

  const { data, error } = await auth.supabase
    .from('students')
    .upsert(payload, { onConflict: 'user_id' })
    .select(
      'user_id, full_name, phone, gender, city_state, location_mode, custom_location_text, tracks, scholarship_type, scholarship_percent, monthly_enabled, monthly_amount, due_date, total_due, amount_paid, scholarship_amount_applied, outstanding_balance, onboarding_completed, updated_at'
    )
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: { message: 'Failed to save onboarding.', details: error.message } }, { status: 500 })
  }

  const preferredLocation =
    data.location_mode === 'custom' ? data.custom_location_text : data.location_mode

  return NextResponse.json(
    {
      success: true,
      data: {
        user_id: data.user_id,
        full_name: data.full_name,
        phone: data.phone,
        gender: data.gender,
        city_state: data.city_state,
        preferred_location: preferredLocation ?? null,
        selected_tracks: data.tracks ?? [],
        scholarship_type: data.scholarship_type,
        scholarship_percent: data.scholarship_percent,
        monthly_enabled: data.monthly_enabled,
        monthly_amount: data.monthly_amount,
        due_date: data.due_date,
        total_due: data.total_due,
        amount_paid: data.amount_paid,
        scholarship_amount_applied: data.scholarship_amount_applied,
        outstanding_balance: data.outstanding_balance,
        completed: data.onboarding_completed,
        updated_at: data.updated_at,
      },
    },
    { status: 200 }
  )
}
