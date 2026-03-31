import { NextResponse } from 'next/server'
import { COURSE_PLANS } from '@/lib/coursePlans'

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: COURSE_PLANS,
    },
    { status: 200 }
  )
}
