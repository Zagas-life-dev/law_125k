import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER ?? 'law-masterclass'

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

    const { error: insertError } = await supabase.from('masterclass_registrations').insert({
      id: registrationId,
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
    })

    if (insertError) {
      return NextResponse.json(
        {
          error:
            'Database insert failed. Ensure table "masterclass_registrations" exists with matching columns.',
          details: insertError.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        registration: {
          id: registrationId,
          fullName,
          location,
          headshotUrl: headshotUpload.secure_url,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
