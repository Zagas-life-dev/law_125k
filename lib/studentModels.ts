export type EnrollmentTrack = 'catwalk' | 'online' | 'both' | 'portfolio_editorial'

export type ScholarshipType = 'none' | 'percentage' | 'full'
export type PlanType = 'standard' | 'custom'
export type LocationMode = 'online' | 'lagos' | 'abuja' | 'custom'
export type StudentLinkageStatus = 'linked' | 'unlinked' | 'link_conflict'

export type StudentRow = {
  id: string
  user_id: string | null
  registration_id: string | null
  reg_number: number | null
  student_id: number | null
  status: string | null
  full_name: string | null
  email: string | null
  phone: string | null
  age: number | null
  gender: string | null
  city_state: string | null
  location_mode: string | null
  custom_location_text: string | null
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
  instagram_handle: string | null
  tiktok_or_other: string | null
  tracks: string[] | null
  plan_type: string | null
  custom_plan_name: string | null
  total_due: number | null
  amount_paid: number | null
  scholarship_type: string | null
  scholarship_percent: number | null
  scholarship_amount_applied: number | null
  outstanding_balance: number | null
  due_date: string | null
  monthly_enabled: boolean | null
  monthly_amount: number | null
  headshot_url: string | null
  profile_front_url: string | null
  profile_left_url: string | null
  profile_right_url: string | null
  profile_back_url: string | null
  full_body_front_url: string | null
  full_body_left_url: string | null
  full_body_right_url: string | null
  full_body_back_url: string | null
  walk_video_1_url: string | null
  walk_video_2_url: string | null
  admin_notes: string | null
  onboarding_completed: boolean | null
  created_at: string
  updated_at: string | null
}

export type StudentListItem = {
  id: string
  studentId: number | null
  fullName: string
  email: string | null
  phone: string
  headshotUrl: string | null
  locationDisplay: string
  enrollmentTracks: EnrollmentTrack[]
  linkageStatus: StudentLinkageStatus
  billingStatus: string
  createdAt: string
}

export type StudentDetail = {
  id: string
  studentId: number | null
  identity: {
    fullName: string
    email: string | null
    phone: string
    gender: string
    age: number | null
    status: string
    cityState: string
  }
  authLink: {
    status: StudentLinkageStatus
    userId: string | null
    userEmail: string | null
  }
  socials: {
    instagram: string | null
    tiktokOrOther: string | null
  }
  measurements: {
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
  }
  media: {
    headshotUrl: string | null
    walkVideos: [string | null, string | null]
    profileImages: {
      front: string | null
      left: string | null
      right: string | null
      back: string | null
    }
    fullBodyImages: {
      front: string | null
      left: string | null
      right: string | null
      back: string | null
    }
  }
  enrollment: {
    tracks: EnrollmentTrack[]
  }
  billing: {
    planType: PlanType
    customPlanName: string | null
    totalDue: number
    amountPaid: number
    scholarshipType: ScholarshipType
    scholarshipPercent: number
    scholarshipAmountApplied: number
    outstandingBalance: number
    dueDate: string | null
    monthlyEnabled: boolean
    monthlyAmount: number | null
  }
  location: {
    mode: LocationMode
    customLocationText: string | null
    display: string
  }
  notes: string | null
  onboardingCompleted: boolean
  updatedAt: string | null
  createdAt: string
}

export type StudentApiSuccess<T> = {
  success: true
  data: T
}

export type StudentApiError = {
  success: false
  error: {
    message: string
    details?: string
  }
}

const TRACK_VALUES: EnrollmentTrack[] = ['catwalk', 'online', 'both', 'portfolio_editorial']

export function parseEnrollmentTracks(value: unknown): EnrollmentTrack[] {
  if (!value) return []

  const list =
    typeof value === 'string'
      ? value.split(',').map((item) => item.trim())
      : Array.isArray(value)
        ? value
        : []

  const normalized = list
    .map((item) => (typeof item === 'string' ? item.trim().toLowerCase().replace('/', '_') : ''))
    .filter((item): item is EnrollmentTrack => TRACK_VALUES.includes(item as EnrollmentTrack))

  return Array.from(new Set(normalized))
}

export function parseLocationMode(value: unknown): LocationMode {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (normalized === 'online') return 'online'
  if (normalized === 'lagos') return 'lagos'
  if (normalized === 'abuja') return 'abuja'
  if (normalized === 'custom') return 'custom'
  return 'custom'
}

export function parseScholarshipType(value: unknown): ScholarshipType {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (normalized === 'full') return 'full'
  if (normalized === 'percentage') return 'percentage'
  return 'none'
}

export function parsePlanType(value: unknown): PlanType {
  return typeof value === 'string' && value.trim().toLowerCase() === 'custom' ? 'custom' : 'standard'
}

export function toMoney(value: unknown): number {
  const numeric =
    typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value.trim()) : 0
  if (!Number.isFinite(numeric) || numeric < 0) return 0
  return numeric
}

export function computeBilling(input: {
  totalDue: unknown
  amountPaid: unknown
  scholarshipType: unknown
  scholarshipPercent: unknown
}) {
  const totalDue = toMoney(input.totalDue)
  const amountPaid = toMoney(input.amountPaid)
  const scholarshipType = parseScholarshipType(input.scholarshipType)
  const scholarshipPercentRaw = toMoney(input.scholarshipPercent)
  const scholarshipPercent = Math.min(100, scholarshipPercentRaw)

  const scholarshipAmountApplied =
    scholarshipType === 'full'
      ? totalDue
      : scholarshipType === 'percentage'
        ? (totalDue * scholarshipPercent) / 100
        : 0

  const effectiveTotal = Math.max(0, totalDue - scholarshipAmountApplied)
  const outstandingBalance = Math.max(0, effectiveTotal - amountPaid)

  return {
    totalDue,
    amountPaid,
    scholarshipType,
    scholarshipPercent,
    scholarshipAmountApplied,
    outstandingBalance,
  }
}

export function formatBillingStatus(outstandingBalance: number, totalDue: number): string {
  if (!totalDue) return 'Not set'
  if (outstandingBalance <= 0) return 'Paid'
  return `Due: ₦${outstandingBalance.toLocaleString()}`
}

export function getStudentLinkageStatus(input: {
  userId: string | null
  studentEmail: string | null
  authEmail?: string | null
}): StudentLinkageStatus {
  if (!input.userId) return 'unlinked'
  if (input.authEmail && input.studentEmail) {
    const student = input.studentEmail.trim().toLowerCase()
    const auth = input.authEmail.trim().toLowerCase()
    if (student && auth && student !== auth) return 'link_conflict'
  }
  return 'linked'
}

export function optionalString(value: string | null | undefined) {
  const normalized = typeof value === 'string' ? value.trim() : ''
  return normalized || null
}

