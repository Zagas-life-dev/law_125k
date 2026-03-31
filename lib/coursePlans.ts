export type CoursePlanCode = 'catwalk' | 'portfolio_editorial' | 'both' | 'online'

export type CoursePlan = {
  code: CoursePlanCode
  title: string
  description: string
  price: number
  href: string
}

export const COURSE_PLANS: CoursePlan[] = [
  {
    code: 'catwalk',
    title: 'Catwalk Only',
    description:
      'Focused runway and catwalk training. Signature walk, posture, stage presence, and garment presentation.',
    price: 50000,
    href: '/courses/academy-training',
  },
  {
    code: 'portfolio_editorial',
    title: 'Polaroid Development',
    description:
      'Portfolio and polaroid development for scouting and castings. Build a professional presentation for agencies.',
    price: 80000,
    href: '/courses/editorial-studio',
  },
  {
    code: 'both',
    title: 'Catwalk + Polaroid Development',
    description:
      'Full package: catwalk training and polaroid development combined for complete model readiness.',
    price: 130000,
    href: '/courses/full-package',
  },
  {
    code: 'online',
    title: 'Online Classes',
    description: 'Flexible remote training. Catwalk and industry modules from anywhere.',
    price: 70000,
    href: '/courses/online-package',
  },
]

export const PLAN_PRICE_MAP = COURSE_PLANS.reduce<Record<string, number>>(
  (acc, plan) => ({ ...acc, [plan.code]: plan.price }),
  {}
)

export function normalizePlanCodes(input: unknown): CoursePlanCode[] {
  const values = Array.isArray(input)
    ? input
    : typeof input === 'string'
      ? input.split(',').map((item) => item.trim())
      : []
  const allowed = new Set(COURSE_PLANS.map((plan) => plan.code))
  const normalized = values
    .map((entry) => (typeof entry === 'string' ? entry.trim().toLowerCase() : ''))
    .filter((entry): entry is CoursePlanCode => allowed.has(entry as CoursePlanCode))
  return Array.from(new Set(normalized))
}

export function computeTotalFromPlans(codes: CoursePlanCode[]) {
  return codes.reduce((sum, code) => sum + (PLAN_PRICE_MAP[code] ?? 0), 0)
}
