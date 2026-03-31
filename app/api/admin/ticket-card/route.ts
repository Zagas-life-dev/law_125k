import { NextResponse } from 'next/server'
import { getSupabaseAdminClient, requireAdmin } from '@/lib/supabaseAdmin'
import {
  generateTicketCardData,
  type TicketCardApiError,
  type TicketCardApiSuccess,
  TicketCardError,
} from '@/lib/ticketCard'

type AdminTicketCardRequest = {
  registrationId?: string
}

function badRequest(message: string, details?: string) {
  return NextResponse.json<TicketCardApiError>(
    { success: false, error: { code: 'invalid_payload', message, details } },
    { status: 400 }
  )
}

export async function POST(req: Request) {
  const check = await requireAdmin(req.headers.get('authorization'))
  if (!check.isAdmin) {
    return NextResponse.json<TicketCardApiError>(
      { success: false, error: { code: 'unauthorized', message: check.reason } },
      { status: 401 }
    )
  }

  let body: AdminTicketCardRequest
  try {
    body = (await req.json()) as AdminTicketCardRequest
  } catch {
    return badRequest('Invalid JSON body.')
  }

  const registrationId = (body.registrationId ?? '').trim()
  if (!registrationId) {
    return badRequest('registrationId is required.')
  }

  try {
    const ticketData = await generateTicketCardData(getSupabaseAdminClient(), registrationId)
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
