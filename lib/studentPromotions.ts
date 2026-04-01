export type StudentPromotionMessage = {
  id: string
  title: string
  body: string
  url?: string
  active?: boolean
}

// Add, edit, or disable student promo/motivation notifications here.
// Set active: false to keep a message without sending it.
export const STUDENT_PROMOTION_MESSAGES: StudentPromotionMessage[] = [
  {
    id: 'stay-consistent-week',
    title: 'Consistency Builds Greatness',
    body: 'Show up this week and keep refining your walk. Small daily effort creates standout results.',
    url: '/courses',
    active: true,
  },
  {
    id: 'portfolio-energy',
    title: 'Your Portfolio Is Your Voice',
    body: 'Take one step today to improve your portfolio presence and stay runway ready.',
    url: '/student/profile',
    active: true,
  },
  {
    id: 'confidence-focus',
    title: 'Confidence Check',
    body: 'Stand tall, practice posture, and own your look. Confidence is a skill you can train daily.',
    url: '/student/profile',
    active: true,
  },
]

export function getActiveStudentPromotionMessages() {
  return STUDENT_PROMOTION_MESSAGES.filter((item) => item.active !== false)
}

export function pickPromotionMessageForDate(date: Date) {
  const active = getActiveStudentPromotionMessages()
  if (!active.length) return null
  const daySeed = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
  const idx = Math.abs(daySeed) % active.length
  return active[idx]
}
