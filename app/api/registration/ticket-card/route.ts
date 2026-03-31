import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'
import {
  generateTicketCardData,
  type TicketCardApiError,
  type TicketCardApiSuccess,
  TicketCardError,
} from '@/lib/ticketCard'

type RegistrationTicketCardRequest = {
  registrationId?: string
  regNumber?: number | string
  email?: string
}

function badRequest(message: string, details?: string) {
  return NextResponse.json<TicketCardApiError>(
    { success: false, error: { code: 'invalid_payload', message, details } },
    { status: 400 }
  )
}

function normalizeRegNumber(value: number | string | undefined) {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.floor(value)
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.trim())
    if (Number.isFinite(parsed)) return Math.floor(parsed)
  }
  return null
}

export async function POST(req: Request) {
  let body: RegistrationTicketCardRequest
  try {
    body = (await req.json()) as RegistrationTicketCardRequest
  } catch {
    return badRequest('Invalid JSON body.')
  }

  const registrationId = (body.registrationId ?? '').trim()
  const email = (body.email ?? '').trim().toLowerCase()
  const regNumber = normalizeRegNumber(body.regNumber)

  if (!registrationId || !email || !regNumber) {
    return badRequest('registrationId, email and regNumber are required.')
  }

  const supabase = getSupabaseAdminClient()
  const { data: ownerRecord, error: ownerError } = await supabase
    .from('masterclass_registrations')
    .select('id, email, reg_number')
    .eq('id', registrationId)
    .maybeSingle<{ id: string; email: string | null; reg_number: number | null }>()

  if (ownerError) {
    return NextResponse.json<TicketCardApiError>(
      { success: false, error: { code: 'db_error', message: 'Failed to verify registration ownership.', details: ownerError.message } },
      { status: 500 }
    )
  }

  if (!ownerRecord) {
    return NextResponse.json<TicketCardApiError>(
      { success: false, error: { code: 'registration_not_found', message: 'Registration record was not found.' } },
      { status: 404 }
    )
  }

  const emailMatches = (ownerRecord.email ?? '').trim().toLowerCase() === email
  const regMatches = ownerRecord.reg_number === regNumber
  if (!emailMatches || !regMatches) {
    return NextResponse.json<TicketCardApiError>(
      {
        success: false,
        error: {
          code: 'unauthorized',
          message: 'You are not authorized to generate this ticket.',
        },
      },
      { status: 401 }
    )
  }

  try {
    const ticketData = await generateTicketCardData(supabase, registrationId)
    return NextResponse.json<TicketCardApiSuccess>({ success: true, data: ticketData }, { status: 200 })
  } catch (error) {
    if (error instanceof TicketCardError) {
      const status =
        error.code === 'registration_not_found' || error.code === 'masterclass_not_found'
          ? 404
          : error.code === 'participant_incomplete'
            ? 422
            : 500
      return NextResponse.json<TicketCardApiError>(
        { success: false, error: { code: error.code, message: error.message, details: error.details } },
        { status }
      )
    }
    return NextResponse.json<TicketCardApiError>(
      { success: false, error: { code: 'internal_error', message: 'Unexpected server error.' } },
      { status: 500 }
    )
  }
}
