import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER ?? 'law-masterclass'
const MAX_REG_NUMBER_GENERATION_ATTEMPTS = 7

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase server environment variables.')
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function setupCloudinary() {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Missing Cloudinary environment variables.')
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  })
}

async function uploadToCloudinary(file: File, folder: string, resourceType: 'image' | 'video') {
  const arrayBuffer = await file.arrayBuffer()
  const bytes = Buffer.from(arrayBuffer)

  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, use_filename: true, unique_filename: true },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'))
          return
        }
        resolve({ secure_url: result.secure_url, public_id: result.public_id })
      }
    )

    stream.end(bytes)
  })
}

function generateEightDigitRegNumber() {
  return Math.floor(10000000 + Math.random() * 90000000)
}

function getBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader) return null
  const trimmed = authorizationHeader.trim()
  if (!trimmed.toLowerCase().startsWith('bearer ')) return null
  return trimmed.slice(7).trim()
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    setupCloudinary()

    const location = String(formData.get('location') ?? '').trim()
    const fullName = String(formData.get('fullName') ?? '').trim()
    const age = Number(formData.get('age') ?? 0)
    const dateOfBirth = String(formData.get('dateOfBirth') ?? '').trim()
    const gender = String(formData.get('gender') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const cityState = String(formData.get('cityState') ?? '').trim()

    const heightValue = String(formData.get('heightValue') ?? '').trim()
    const heightUnit = String(formData.get('heightUnit') ?? '').trim()
    const weightValue = String(formData.get('weightValue') ?? '').trim()
    const weightUnit = String(formData.get('weightUnit') ?? '').trim()
    const bustChestValue = String(formData.get('bustChestValue') ?? '').trim()
    const bustChestUnit = String(formData.get('bustChestUnit') ?? '').trim()
    const waistValue = String(formData.get('waistValue') ?? '').trim()
    const waistUnit = String(formData.get('waistUnit') ?? '').trim()
    const hipsValue = String(formData.get('hipsValue') ?? '').trim()
    const hipsUnit = String(formData.get('hipsUnit') ?? '').trim()
    const hipsConverted = String(formData.get('hipsConverted') ?? '').trim()
    const shoeSize = String(formData.get('shoeSize') ?? '').trim()

    const hasModelingExperience = String(formData.get('hasModelingExperience') ?? '').trim()
    const experienceTypes = String(formData.get('experienceTypes') ?? '').trim()
    const priorTraining = String(formData.get('priorTraining') ?? '').trim()

    const fullSessionAvailability = String(formData.get('fullSessionAvailability') ?? '').trim()

    const motivation = String(formData.get('motivation') ?? '').trim()
    const goals = String(formData.get('goals') ?? '').trim()
    const expectedGain = String(formData.get('expectedGain') ?? '').trim()

    const instagramHandle = String(formData.get('instagramHandle') ?? '').trim()
    const tiktokOrOther = String(formData.get('tiktokOrOther') ?? '').trim()

    const consentPhotoVideo = String(formData.get('consentPhotoVideo') ?? '').trim()
    const referralSource = String(formData.get('referralSource') ?? '').trim()
    const enrollmentTracks = String(formData.get('enrollmentTracks') ?? '')
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
    const planType = String(formData.get('planType') ?? 'standard').trim().toLowerCase()
    const customPlanName = String(formData.get('customPlanName') ?? '').trim()
    const totalDue = Number(formData.get('totalDue') ?? 0)
    const amountPaid = Number(formData.get('amountPaid') ?? 0)
    const dueDate = String(formData.get('dueDate') ?? '').trim()
    const monthlyEnabled = String(formData.get('monthlyEnabled') ?? '').trim().toLowerCase() === 'true'
    const monthlyAmount = Number(formData.get('monthlyAmount') ?? 0)
    const scholarshipType = String(formData.get('scholarshipType') ?? 'none').trim().toLowerCase()
    const scholarshipPercent = Number(formData.get('scholarshipPercent') ?? 0)
    const locationMode = String(formData.get('locationMode') ?? '').trim().toLowerCase()
    const customLocationText = String(formData.get('customLocationText') ?? '').trim()

    const headshotFile = formData.get('headshot')
    const fullBodyFile = formData.get('fullBody')
    const walkVideoFile = formData.get('walkVideo')

    if (
      !fullName ||
      !age ||
      !dateOfBirth ||
      !gender ||
      !phone ||
      !email ||
      !cityState ||
      !heightValue ||
      !heightUnit ||
      !weightValue ||
      !weightUnit ||
      !bustChestValue ||
      !bustChestUnit ||
      !waistValue ||
      !waistUnit ||
      !hipsValue ||
      !hipsUnit ||
      !shoeSize ||
      !hasModelingExperience ||
      !fullSessionAvailability ||
      !motivation ||
      !goals ||
      !expectedGain ||
      !consentPhotoVideo ||
      !referralSource ||
      !location ||
      !(headshotFile instanceof File) ||
      !(fullBodyFile instanceof File)
    ) {
      return NextResponse.json(
        { error: 'Please complete all required fields and required uploads.' },
        { status: 400 }
      )
    }

    if (!['Abuja', 'Lagos'].includes(location)) {
      return NextResponse.json({ error: 'Invalid location selected.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const registrationId = crypto.randomUUID()
    const mediaFolder = `${CLOUDINARY_FOLDER}/${registrationId}`

    const [headshotUpload, fullBodyUpload] = await Promise.all([
      uploadToCloudinary(headshotFile, mediaFolder, 'image'),
      uploadToCloudinary(fullBodyFile, mediaFolder, 'image'),
    ])

    let walkVideoUpload: { secure_url: string; public_id: string } | null = null
    if (walkVideoFile instanceof File && walkVideoFile.size > 0) {
      walkVideoUpload = await uploadToCloudinary(walkVideoFile, mediaFolder, 'video')
    }

    let insertError: { message: string; code?: string } | null = null
    let generatedRegNumber: number | null = null
    for (let attempt = 0; attempt < MAX_REG_NUMBER_GENERATION_ATTEMPTS; attempt += 1) {
      const regNumber = generateEightDigitRegNumber()
      const { error } = await supabase.from('masterclass_registrations').insert([
        {
          id: registrationId,
          reg_number: regNumber,
          location,
          full_name: fullName,
          age,
          date_of_birth: dateOfBirth,
          gender,
          phone,
          email,
          city_state: cityState,
          height_value: heightValue,
          height_unit: heightUnit,
          weight_value: weightValue,
          weight_unit: weightUnit,
          bust_chest_value: bustChestValue,
          bust_chest_unit: bustChestUnit,
          waist_value: waistValue,
          waist_unit: waistUnit,
          hips_value: hipsValue,
          hips_unit: hipsUnit,
          hips_converted: hipsConverted || null,
          shoe_size: shoeSize,
          has_modeling_experience: hasModelingExperience,
          experience_types: experienceTypes || null,
          prior_training: priorTraining || null,
          full_session_availability: fullSessionAvailability,
          motivation,
          goals,
          expected_gain: expectedGain,
          instagram_handle: instagramHandle || null,
          tiktok_or_other: tiktokOrOther || null,
          consent_photo_video: consentPhotoVideo,
          referral_source: referralSource,
          headshot_url: headshotUpload.secure_url,
          full_body_url: fullBodyUpload.secure_url,
          walk_video_url: walkVideoUpload?.secure_url ?? null,
          created_at: new Date().toISOString(),
        },
      ])

      if (!error) {
        generatedRegNumber = regNumber
        insertError = null
        break
      }

      insertError = { message: error.message, code: (error as { code?: string }).code }
      const isRegNumberConflict =
        insertError.code === '23505' && /reg_number/i.test(insertError.message)
      if (!isRegNumberConflict) {
        break
      }
    }

    if (insertError || generatedRegNumber === null) {
      return NextResponse.json(
        {
          error:
            'Database insert failed. Ensure table "masterclass_registrations" exists with matching columns.',
          details:
            insertError?.message ??
            'Could not generate a unique 8-digit reg_number after multiple attempts.',
        },
        { status: 500 }
      )
    }

    const bearerToken = getBearerToken(req.headers.get('authorization'))
    let linkageStatus: 'linked' | 'unlinked' | 'link_conflict' = 'unlinked'
    let linkageMessage = 'Registration saved without authenticated student session. Link account later in admin.'
    if (bearerToken) {
      const authUserRes = await supabase.auth.getUser(bearerToken)
      const authUserId = authUserRes.data.user?.id ?? null
      if (authUserId) {
        const { error: linkError } = await supabase.from('students').upsert(
          {
            registration_id: registrationId,
            user_id: authUserId,
            status: 'active',
          },
          { onConflict: 'registration_id' }
        )
        if (linkError) {
          const isUserConflict =
            (linkError as { code?: string }).code === '23505' && /user_id/i.test(linkError.message)
          if (isUserConflict) {
            linkageStatus = 'link_conflict'
            linkageMessage = 'Registration saved but user account is linked to another student record.'
          } else {
            linkageStatus = 'unlinked'
            linkageMessage = `Registration saved but account link failed: ${linkError.message}`
          }
        } else {
          linkageStatus = 'linked'
          linkageMessage = 'Registration saved and linked to authenticated student account.'
        }
      }
    }

    const validTracks = ['catwalk', 'online', 'both', 'portfolio_editorial']
    const normalizedTracks = enrollmentTracks.filter((track) => validTracks.includes(track))
    const normalizedPlanType = planType === 'custom' ? 'custom' : 'standard'
    const normalizedScholarshipType =
      scholarshipType === 'full' ? 'full' : scholarshipType === 'percentage' ? 'percentage' : 'none'
    const normalizedLocationMode = ['online', 'lagos', 'abuja', 'custom'].includes(locationMode)
      ? locationMode
      : 'custom'

    const safeTotalDue = Number.isFinite(totalDue) && totalDue >= 0 ? totalDue : 0
    const safeAmountPaid = Number.isFinite(amountPaid) && amountPaid >= 0 ? amountPaid : 0
    const safeScholarshipPercent =
      normalizedScholarshipType === 'percentage' && Number.isFinite(scholarshipPercent)
        ? Math.max(0, Math.min(100, scholarshipPercent))
        : 0
    const scholarshipAmountApplied =
      normalizedScholarshipType === 'full'
        ? safeTotalDue
        : normalizedScholarshipType === 'percentage'
          ? (safeTotalDue * safeScholarshipPercent) / 100
          : 0
    const effectiveTotal = Math.max(0, safeTotalDue - scholarshipAmountApplied)

    await supabase.from('students').upsert(
      {
        registration_id: registrationId,
        reg_number: generatedRegNumber,
        status: 'active',
        full_name: fullName,
        email,
        phone,
        age,
        gender,
        city_state: cityState,
        location_mode: normalizedLocationMode,
        custom_location_text: customLocationText || null,
        height_value: heightValue,
        height_unit: heightUnit,
        weight_value: weightValue,
        weight_unit: weightUnit,
        bust_chest_value: bustChestValue,
        bust_chest_unit: bustChestUnit,
        waist_value: waistValue,
        waist_unit: waistUnit,
        hips_value: hipsValue,
        hips_unit: hipsUnit,
        hips_converted: hipsConverted || null,
        shoe_size: shoeSize,
        has_modeling_experience: hasModelingExperience,
        experience_types: experienceTypes || null,
        prior_training: priorTraining || null,
        full_session_availability: fullSessionAvailability,
        motivation,
        goals,
        expected_gain: expectedGain,
        instagram_handle: instagramHandle || null,
        tiktok_or_other: tiktokOrOther || null,
        tracks: normalizedTracks,
        plan_type: normalizedPlanType,
        custom_plan_name: customPlanName || null,
        total_due: safeTotalDue,
        amount_paid: safeAmountPaid,
        due_date: dueDate || null,
        monthly_enabled: monthlyEnabled,
        monthly_amount: monthlyEnabled && Number.isFinite(monthlyAmount) && monthlyAmount >= 0 ? monthlyAmount : null,
        scholarship_type: normalizedScholarshipType,
        scholarship_percent: safeScholarshipPercent,
        scholarship_amount_applied: scholarshipAmountApplied,
        outstanding_balance: Math.max(0, effectiveTotal - safeAmountPaid),
        headshot_url: headshotUpload.secure_url,
        full_body_front_url: fullBodyUpload.secure_url,
        walk_video_1_url: walkVideoUpload?.secure_url ?? null,
      },
      { onConflict: 'registration_id' }
    )

    return NextResponse.json(
      {
        success: true,
        registration: {
          id: registrationId,
          regNumber: generatedRegNumber,
          fullName,
          location,
          headshotUrl: headshotUpload.secure_url,
        },
        linkage: {
          status: linkageStatus,
          message: linkageMessage,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
