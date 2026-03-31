import type { SupabaseClient } from '@supabase/supabase-js'

export type TicketCardData = {
  registrationId: string
  regNumber: number
  fullName: string
  gender: string
  location: 'Abuja' | 'Lagos'
  cityState: string
  phone: string
  age: number
  heightValue: string
  heightUnit: string
  weightValue: string
  weightUnit: string
  bustChestValue: string
  bustChestUnit: string
  waistValue: string
  waistUnit: string
  hipsValue: string
  hipsUnit: string
  hipsConverted: string | null
  shoeSize: string
  address: string
  issuedOn: string
}

type TicketCardDbRow = {
  id: string
  reg_number: number | null
  full_name: string | null
  gender: string | null
  location: string | null
  city_state: string | null
  phone: string | null
  age: number | null
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
  created_at: string | null
}

const MASTERCLASS_ADDRESS: Record<'Abuja' | 'Lagos', string> = {
  Lagos: '2 Otunubi Street Ogba Ifako Road Lagos',
  Abuja: 'MTF 6, Paradise Estate Phase 2 Lifecamp',
}

export class TicketCardError extends Error {
  constructor(
    public readonly code:
      | 'registration_not_found'
      | 'masterclass_not_found'
      | 'participant_incomplete'
      | 'db_error',
    message: string,
    public readonly details?: string
  ) {
    super(message)
  }
}

function isLocation(value: string): value is 'Abuja' | 'Lagos' {
  return value === 'Abuja' || value === 'Lagos'
}

function ensureString(value: string | null | undefined) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function generateTicketCardData(
  supabase: SupabaseClient,
  registrationId: string
): Promise<TicketCardData> {
  const { data, error } = await supabase
    .from('masterclass_registrations')
    .select(
      [
        'id',
        'reg_number',
        'full_name',
        'gender',
        'location',
        'city_state',
        'phone',
        'age',
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
        'created_at',
      ].join(', ')
    )
    .eq('id', registrationId)
    .maybeSingle<TicketCardDbRow>()

  if (error) {
    throw new TicketCardError('db_error', 'Failed to read registration record.', error.message)
  }
  if (!data) {
    throw new TicketCardError('registration_not_found', 'Registration record was not found.')
  }

  const locationRaw = ensureString(data.location)
  if (!isLocation(locationRaw)) {
    throw new TicketCardError(
      'masterclass_not_found',
      `No masterclass data configured for location "${locationRaw || 'unknown'}".`
    )
  }

  const requiredStrings: Array<[string, string]> = [
    ['full_name', ensureString(data.full_name)],
    ['gender', ensureString(data.gender)],
    ['city_state', ensureString(data.city_state)],
    ['phone', ensureString(data.phone)],
    ['height_value', ensureString(data.height_value)],
    ['height_unit', ensureString(data.height_unit)],
    ['weight_value', ensureString(data.weight_value)],
    ['weight_unit', ensureString(data.weight_unit)],
    ['bust_chest_value', ensureString(data.bust_chest_value)],
    ['bust_chest_unit', ensureString(data.bust_chest_unit)],
    ['waist_value', ensureString(data.waist_value)],
    ['waist_unit', ensureString(data.waist_unit)],
    ['hips_value', ensureString(data.hips_value)],
    ['hips_unit', ensureString(data.hips_unit)],
    ['shoe_size', ensureString(data.shoe_size)],
  ]
  const missingFields = requiredStrings.filter(([, value]) => !value).map(([field]) => field)
  if (!data.reg_number || !Number.isFinite(data.reg_number)) missingFields.push('reg_number')
  if (!data.age || !Number.isFinite(data.age)) missingFields.push('age')
  if (missingFields.length > 0) {
    throw new TicketCardError(
      'participant_incomplete',
      'Participant data is incomplete for ticket generation.',
      `Missing fields: ${missingFields.join(', ')}`
    )
  }

  return {
    registrationId: data.id,
    regNumber: data.reg_number!,
    fullName: ensureString(data.full_name),
    gender: ensureString(data.gender),
    location: locationRaw,
    cityState: ensureString(data.city_state),
    phone: ensureString(data.phone),
    age: data.age!,
    heightValue: ensureString(data.height_value),
    heightUnit: ensureString(data.height_unit),
    weightValue: ensureString(data.weight_value),
    weightUnit: ensureString(data.weight_unit),
    bustChestValue: ensureString(data.bust_chest_value),
    bustChestUnit: ensureString(data.bust_chest_unit),
    waistValue: ensureString(data.waist_value),
    waistUnit: ensureString(data.waist_unit),
    hipsValue: ensureString(data.hips_value),
    hipsUnit: ensureString(data.hips_unit),
    hipsConverted: ensureString(data.hips_converted) || null,
    shoeSize: ensureString(data.shoe_size),
    address: MASTERCLASS_ADDRESS[locationRaw],
    issuedOn: data.created_at ?? new Date().toISOString(),
  }
}

export type TicketCardApiSuccess = {
  success: true
  data: TicketCardData
}

export type TicketCardApiError = {
  success: false
  error: {
    code:
      | 'invalid_payload'
      | 'unauthorized'
      | 'registration_not_found'
      | 'masterclass_not_found'
      | 'participant_incomplete'
      | 'db_error'
      | 'internal_error'
    message: string
    details?: string
  }
}
