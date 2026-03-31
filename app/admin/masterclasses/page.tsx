'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'
import { useRouter } from 'next/navigation'

type MasterclassRegistration = {
  id: string
  location: string
  full_name: string
  email: string | null
  phone: string
  age: number
  date_of_birth: string
  gender: string
  city_state: string
  height_value: string
  height_unit: string
  weight_value: string
  weight_unit: string
  bust_chest_value: string
  bust_chest_unit: string
  waist_value: string
  waist_unit: string
  hips_value: string
  hips_unit: string
  hips_converted: string | null
  shoe_size: string
  has_modeling_experience: string
  experience_types: string | null
  prior_training: string | null
  full_session_availability: string
  motivation: string
  goals: string
  expected_gain: string
  instagram_handle: string | null
  tiktok_or_other: string | null
  consent_photo_video: string
  referral_source: string
  headshot_url: string | null
  full_body_url: string | null
  walk_video_url: string | null
  created_at: string
  reg_number: number
}

type TicketCardApiResponse =
  | {
      success: true
      data: {
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
    }
  | { success: false; error: { code: string; message: string; details?: string } }

export default function AdminMasterclassesPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<MasterclassRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [generatingTicketId, setGeneratingTicketId] = useState<string | null>(null)
  const [selected, setSelected] = useState<MasterclassRegistration | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isTicketPreviewOpen, setIsTicketPreviewOpen] = useState(false)
  const [ticketPreviewDataUrl, setTicketPreviewDataUrl] = useState('')
  const [ticketPreviewName, setTicketPreviewName] = useState('')
  const [ticketPreviewRegNumber, setTicketPreviewRegNumber] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return registrations
    return registrations.filter((r) => {
      return (
        r.full_name.toLowerCase().includes(q) ||
        (r.email ?? '').toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.reg_number.toString().toLowerCase().includes(q)
      )
    })
  }, [query, registrations])

  const fetchRegistrations = async () => {
    setError('')
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowser()
      if (!supabase) throw new Error('Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.')

      const sessionRes = await supabase.auth.getSession()
      const accessToken = sessionRes.data.session?.access_token
      if (!accessToken) throw new Error('Session expired. Please log in again.')

      const res = await fetch('/api/admin/masterclass-registrations', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const json = (await res.json()) as { registrations?: MasterclassRegistration[]; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Failed to load registrations.')

      setRegistrations(json.registrations ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load registrations.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchRegistrations()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this registration? This cannot be undone.')) return
    setDeletingId(id)

    try {
      const supabase = getSupabaseBrowser()
      if (!supabase) throw new Error('Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.')

      const sessionRes = await supabase.auth.getSession()
      const accessToken = sessionRes.data.session?.access_token
      if (!accessToken) throw new Error('Session expired. Please log in again.')

      const res = await fetch(`/api/admin/masterclass-registrations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!res.ok) {
        const json = (await res.json()) as { error?: string }
        throw new Error(json.error ?? 'Delete failed.')
      }

      await fetchRegistrations()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = async () => {
    const supabase = getSupabaseBrowser()
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const createTicketCardImage = async (
    ticket: Extract<TicketCardApiResponse, { success: true }>['data'],
    headshotUrl?: string | null
  ) => {
    const W = 1600
    const H = 1020
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not initialize image renderer.')

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      const rad = Math.min(r, w / 2, h / 2)
      ctx.beginPath()
      ctx.moveTo(x + rad, y)
      ctx.arcTo(x + w, y, x + w, y + h, rad)
      ctx.arcTo(x + w, y + h, x, y + h, rad)
      ctx.arcTo(x, y + h, x, y, rad)
      ctx.arcTo(x, y, x + w, y, rad)
      ctx.closePath()
    }

    const drawCover = (img: ImageBitmap, x: number, y: number, w: number, h: number) => {
      const scale = Math.max(w / img.width, h / img.height)
      const sw = w / scale
      const sh = h / scale
      const sx = (img.width - sw) / 2
      const sy = (img.height - sh) / 2
      ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
    }

    const fitText = (text: string, maxW: number): string => {
      if (ctx.measureText(text).width <= maxW) return text
      let t = text
      while (ctx.measureText(`${t}...`).width > maxW && t.length > 1) t = t.slice(0, -1)
      return `${t}...`
    }

    const fillFitted = (text: string, x: number, y: number, maxW: number) => {
      ctx.fillText(fitText(text, maxW), x, y)
    }

    let imageBitmap: ImageBitmap | null = null
    if (headshotUrl) {
      try {
        const imageResponse = await fetch(headshotUrl)
        if (imageResponse.ok) {
          const blob = await imageResponse.blob()
          imageBitmap = await createImageBitmap(blob)
        }
      } catch {
        imageBitmap = null
      }
    }

    ctx.fillStyle = 'rgb(13,13,13)'
    ctx.fillRect(0, 0, W, H)

    const PAD = 34
    roundRect(PAD, PAD, W - PAD * 2, H - PAD * 2, 24)
    ctx.fillStyle = 'rgba(13,13,13,0.92)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    const photoX = 74
    const photoY = 74
    const photoW = 520
    const photoH = H - 148
    roundRect(photoX, photoY, photoW, photoH, 20)
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.34)'
    ctx.lineWidth = 1.4
    ctx.stroke()

    ctx.save()
    roundRect(photoX, photoY, photoW, photoH, 20)
    ctx.clip()
    if (imageBitmap) {
      drawCover(imageBitmap, photoX, photoY, photoW, photoH)
    } else {
      ctx.fillStyle = 'rgba(40,40,40,1)'
      ctx.fillRect(photoX, photoY, photoW, photoH)
      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.font = '600 20px "Courier New", monospace'
      ctx.fillText('NO HEADSHOT', photoX + 34, photoY + 56)
    }
    ctx.restore()

    ctx.fillStyle = 'rgba(210,210,210,0.82)'
    ctx.fillRect(photoX + 18, photoY + photoH - 14, photoW - 36, 4)

    const panelX = photoX + photoW + 54
    const panelW = W - panelX - 74
    let y = 92
    roundRect(panelX - 18, photoY, panelW + 18, photoH, 20)
    ctx.fillStyle = 'rgba(20,20,20,0.52)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.stroke()

    ctx.font = '500 11px "Courier New", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.72)'
    ctx.fillText('LAW MODELS ACADEMY / MASTERCLASS PASS', panelX, y)
    y += 18
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(panelX, y)
    ctx.lineTo(panelX + panelW, y)
    ctx.stroke()
    y += 74

    ctx.font = '800 96px Georgia, "Times New Roman", serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText('LAW', panelX, y)
    y += 34

    ctx.font = '400 18px "Courier New", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.78)'
    ctx.fillText('MASTERCLASS CREDENTIAL', panelX + 5, y)
    y += 58

    ctx.strokeStyle = 'rgba(255,255,255,0.16)'
    ctx.beginPath()
    ctx.moveTo(panelX, y)
    ctx.lineTo(panelX + panelW, y)
    ctx.stroke()
    y += 50

    ctx.font = '700 47px Georgia, "Times New Roman", serif'
    ctx.fillStyle = '#FFFFFF'
    const nameUpper = ticket.fullName.toUpperCase()
    fillFitted(nameUpper, panelX, y, panelW)
    const nameW = Math.min(ctx.measureText(nameUpper).width, panelW)
    y += 15
    ctx.strokeStyle = 'rgba(255,255,255,0.72)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(panelX, y)
    ctx.lineTo(panelX + nameW, y)
    ctx.stroke()
    y += 42

    const regNo = String(ticket.regNumber).padStart(8, '0')
    const col2 = panelX + panelW / 2 + 10
    const halfW = panelW / 2 - 18
    const rowGap = 56
    const detail = (label: string, value: string, x: number, yy: number, w: number, accent = false) => {
      ctx.font = '600 10px "Courier New", monospace'
      ctx.fillStyle = accent ? 'rgba(255,255,255,0.76)' : 'rgba(255,255,255,0.52)'
      ctx.fillText(label, x, yy)
      ctx.font = '500 19px "Times New Roman", Georgia, serif'
      ctx.fillStyle = accent ? '#FFFFFF' : 'rgba(255,255,255,0.92)'
      fillFitted(value, x, yy + 26, w)
    }

    detail('REG NUMBER', `#${regNo}`, panelX, y, halfW, true)
    detail('LOCATION', ticket.location.toUpperCase(), col2, y, halfW)
    y += rowGap
    detail('AGE', String(ticket.age), panelX, y, halfW)
    detail('GENDER', ticket.gender, col2, y, halfW)
    y += rowGap
    detail('CITY / STATE', ticket.cityState, panelX, y, panelW)
    y += rowGap
    detail('PHONE', ticket.phone, panelX, y, panelW)
    y += 56

    ctx.strokeStyle = 'rgba(255,255,255,0.14)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(panelX, y)
    ctx.lineTo(panelX + panelW, y)
    ctx.stroke()
    y += 28

    ctx.font = '600 11px "Courier New", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.74)'
    ctx.fillText('MODEL PROFILE MATRIX', panelX, y)
    y += 20

    const matrixH = 184
    roundRect(panelX, y, panelW, matrixH, 14)
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.09)'
    ctx.stroke()

    const statCols = 3
    const statW = panelW / statCols
    const stats = [
      { label: 'HEIGHT', value: `${ticket.heightValue} ${ticket.heightUnit.toUpperCase()}` },
      { label: 'WEIGHT', value: `${ticket.weightValue} ${ticket.weightUnit.toUpperCase()}` },
      { label: 'SHOE SIZE', value: ticket.shoeSize },
      { label: 'BUST/CHEST', value: `${ticket.bustChestValue} ${ticket.bustChestUnit.toUpperCase()}` },
      { label: 'WAIST', value: `${ticket.waistValue} ${ticket.waistUnit.toUpperCase()}` },
      { label: 'HIPS', value: `${ticket.hipsValue} ${ticket.hipsUnit.toUpperCase()}` },
    ]
    stats.forEach((s, i) => {
      const col = i % statCols
      const row = Math.floor(i / statCols)
      const sx = panelX + col * statW + 18
      const sy = y + 42 + row * 72
      ctx.font = '700 24px Georgia, "Times New Roman", serif'
      ctx.fillStyle = '#FFFFFF'
      fillFitted(s.value, sx, sy, statW - 28)
      ctx.font = '500 10px "Courier New", monospace'
      ctx.fillStyle = 'rgba(220,220,220,0.72)'
      ctx.fillText(s.label, sx, sy + 18)
    })

    y += matrixH + 34
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.beginPath()
    ctx.moveTo(panelX, y)
    ctx.lineTo(panelX + panelW, y)
    ctx.stroke()
    y += 24

    ctx.font = '400 13px "Courier New", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.42)'
    fillFitted(
      `MASTERCLASS: ${ticket.location.toUpperCase()}  •  ${new Date(ticket.issuedOn)
        .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        .toUpperCase()}`,
      panelX,
      y,
      panelW
    )
    y += 26
    ctx.font = '400 13px "Courier New", monospace'
    ctx.fillStyle = 'rgba(230,230,230,0.52)'
    fillFitted(`VENUE: ${ticket.address}`, panelX, y, panelW)

    return canvas.toDataURL('image/png')
  }

  const handleDownloadPreviewTicket = () => {
    if (!ticketPreviewDataUrl || ticketPreviewRegNumber === null) return
    const link = document.createElement('a')
    link.href = ticketPreviewDataUrl
    link.download = `law-masterclass-${String(ticketPreviewRegNumber).padStart(8, '0')}.png`
    link.click()
  }

  const handleGenerateTicket = async (registration: MasterclassRegistration) => {
    setError('')
    setGeneratingTicketId(registration.id)

    try {
      const supabase = getSupabaseBrowser()
      if (!supabase) throw new Error('Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.')

      const sessionRes = await supabase.auth.getSession()
      const accessToken = sessionRes.data.session?.access_token
      if (!accessToken) throw new Error('Session expired. Please log in again.')

      const res = await fetch('/api/admin/ticket-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ registrationId: registration.id }),
      })

      const json = (await res.json()) as TicketCardApiResponse
      if (!res.ok || !json.success) {
        const errorMessage =
          !json.success ? `${json.error.message}${json.error.details ? ` (${json.error.details})` : ''}` : 'Ticket generation failed.'
        throw new Error(errorMessage)
      }

      const previewDataUrl = await createTicketCardImage(json.data, registration.headshot_url)
      setTicketPreviewDataUrl(previewDataUrl)
      setTicketPreviewName(json.data.fullName)
      setTicketPreviewRegNumber(json.data.regNumber)
      setIsTicketPreviewOpen(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ticket generation failed.')
    } finally {
      setGeneratingTicketId(null)
    }
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/masterclasses', label: 'Masterclasses' },
    { href: '/admin/students', label: 'Students' },
  ]

  const openView = (r: MasterclassRegistration) => {
    setSelected(r)
    setIsViewOpen(true)
  }

  return (
    <main className="bg-luxury-white min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:block fixed top-0 left-0 h-screen w-72 bg-white/70 backdrop-blur border-r border-luxury-black/10 z-[50]">
        <div className="p-6 space-y-6">
          <div>
            <p className="editorial-text text-3xl text-luxury-black">ADMIN</p>
            <p className="thin-text text-luxury-black/60 mt-2">Manage masterclass registrations</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl border transition-colors ${
                  item.href === '/admin/masterclasses'
                    ? 'border-luxury-black/15 bg-luxury-black text-luxury-white'
                    : 'border-transparent hover:border-luxury-black/15 hover:bg-white/60 text-luxury-black'
                }`}
              >
                <span className="thin-text tracking-wider uppercase text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="w-full px-4 py-3 border border-luxury-black/15 rounded-xl hover:bg-white/60 thin-text tracking-wider uppercase text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur border-t border-luxury-black/10">
        <div className="flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 text-center py-4 thin-text tracking-wider uppercase text-xs ${
                item.href === '/admin/masterclasses' ? 'text-luxury-white bg-luxury-black' : 'text-luxury-black/70'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="md:pl-72 px-6 py-16 pb-28 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <div>
              <h1 className="editorial-text text-4xl text-luxury-black">Masterclass Registrations</h1>
              <p className="thin-text text-luxury-black/70 mt-2">Manage all masterclass registrations (non-student data).</p>
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, or ID..."
              className="w-full sm:w-96 px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
            />
          </div>

          {error ? <p className="text-red-600 thin-text text-sm mb-4">{error}</p> : null}

          <div className="border border-luxury-black/10 rounded-2xl overflow-hidden bg-white/60 backdrop-blur">
            {isLoading ? (
              <div className="p-8">
                <p className="thin-text text-luxury-black/70">Loading...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="text-left text-sm text-luxury-black/60 thin-text">
                      <th className="px-5 py-4">Passport</th>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Location</th>
                      <th className="px-5 py-4">Phone</th>
                      <th className="px-5 py-4">Age</th>
                      <th className="px-5 py-4">ID</th>
                      <th className="px-5 py-4">Created</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-t border-luxury-black/10">
                        <td className="px-5 py-4">
                          {r.headshot_url ? (
                            <div className="relative w-16 h-20 border border-luxury-black/15 rounded-md overflow-hidden">
                              <Image src={r.headshot_url} alt={`${r.full_name} headshot`} fill className="object-cover" unoptimized />
                            </div>
                          ) : (
                            <span className="text-xs text-luxury-black/40 thin-text">N/A</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <p className="thin-text text-luxury-black">{r.full_name}</p>
                          <p className="text-xs text-luxury-black/50 thin-text">{r.email ?? ''}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="thin-text">{r.location}</span>
                          <p className="text-xs text-luxury-black/50 thin-text">{r.city_state}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="thin-text">{r.phone}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="thin-text">{r.age}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="thin-text">{r.reg_number}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="thin-text">{new Date(r.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 items-center">
                            <button
                              type="button"
                              onClick={() => openView(r)}
                              className="px-4 py-2 border border-luxury-black/20 bg-white/50 text-luxury-black thin-text tracking-wider uppercase disabled:opacity-50"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              disabled={generatingTicketId === r.id}
                              onClick={() => void handleGenerateTicket(r)}
                              className="px-4 py-2 border border-luxury-black/20 bg-white/50 text-luxury-black thin-text tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {generatingTicketId === r.id ? 'Generating...' : '+Ticket'}
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === r.id}
                              onClick={() => handleDelete(r.id)}
                              className="px-4 py-2 bg-luxury-black text-luxury-white thin-text tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingId === r.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-10 text-center">
                          <p className="thin-text text-luxury-black/60">No registrations found.</p>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View modal */}
      {isViewOpen && selected ? (
        <div
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="View registration details"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsViewOpen(false)
          }}
        >
          <div className="w-full max-w-5xl bg-white/95 backdrop-blur border border-luxury-black/10 rounded-3xl p-6 md:p-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="editorial-text text-3xl text-luxury-black">Registration Details</p>
                <p className="thin-text text-luxury-black/70 mt-2">
                  ID: <span className="font-medium">{selected.id}</span> • {selected.full_name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 border border-luxury-black/20 rounded-xl thin-text tracking-wider uppercase text-sm"
              >
                Close
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-3">
                {selected.headshot_url ? (
                  <div className="relative w-full aspect-[4/5] border border-luxury-black/15 rounded-2xl overflow-hidden">
                    <Image src={selected.headshot_url} alt={`${selected.full_name} headshot`} fill className="object-cover" unoptimized />
                  </div>
                ) : null}

                {selected.full_body_url ? (
                  <div className="relative w-full aspect-[16/10] border border-luxury-black/15 rounded-2xl overflow-hidden">
                    <Image src={selected.full_body_url} alt={`${selected.full_name} full body`} fill className="object-cover" unoptimized />
                  </div>
                ) : null}

                {selected.walk_video_url ? (
                  <div className="border border-luxury-black/15 rounded-2xl overflow-hidden">
                    <video src={selected.walk_video_url} controls className="w-full h-auto block" />
                  </div>
                ) : null}
              </div>

              <div className="lg:col-span-2 space-y-6">
                <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                  <p className="editorial-text text-xl text-luxury-black">Personal Information</p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Name</p>
                      <p className="thin-text text-luxury-black">{selected.full_name}</p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Gender</p>
                      <p className="thin-text text-luxury-black">{selected.gender}</p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Age</p>
                      <p className="thin-text text-luxury-black">{selected.age}</p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Date of Birth</p>
                      <p className="thin-text text-luxury-black">{selected.date_of_birth}</p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Phone (WhatsApp)</p>
                      <p className="thin-text text-luxury-black">{selected.phone}</p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Email</p>
                      <p className="thin-text text-luxury-black">{selected.email ?? '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Residential City & State</p>
                      <p className="thin-text text-luxury-black">{selected.city_state}</p>
                    </div>
                  </div>
                </section>

                <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                  <p className="editorial-text text-xl text-luxury-black">Modeling Profile</p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Height</p>
                      <p className="thin-text text-luxury-black">
                        {selected.height_value} {selected.height_unit}
                      </p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Weight</p>
                      <p className="thin-text text-luxury-black">
                        {selected.weight_value} {selected.weight_unit}
                      </p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Bust / Chest</p>
                      <p className="thin-text text-luxury-black">
                        {selected.bust_chest_value} {selected.bust_chest_unit}
                      </p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Waist</p>
                      <p className="thin-text text-luxury-black">
                        {selected.waist_value} {selected.waist_unit}
                      </p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Hips</p>
                      <p className="thin-text text-luxury-black">
                        {selected.hips_value} {selected.hips_unit}
                        {selected.hips_converted ? ` (${selected.hips_converted})` : ''}
                      </p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Shoe Size</p>
                      <p className="thin-text text-luxury-black">{selected.shoe_size}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Experience</p>
                      <p className="thin-text text-luxury-black">{selected.has_modeling_experience}</p>
                      {selected.experience_types ? (
                        <p className="thin-text text-luxury-black/70 mt-1">{selected.experience_types}</p>
                      ) : null}
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Prior Training</p>
                      <p className="thin-text text-luxury-black">{selected.prior_training ?? '-'}</p>
                    </div>
                  </div>
                </section>

                <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                  <p className="editorial-text text-xl text-luxury-black">Availability, Motivation & Consent</p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Full Session Availability</p>
                      <p className="thin-text text-luxury-black">{selected.full_session_availability}</p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Location</p>
                      <p className="thin-text text-luxury-black">{selected.location}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Why join LAWModelsAcademy?</p>
                      <p className="thin-text text-luxury-black/90 break-words">{selected.motivation}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Modeling goals</p>
                      <p className="thin-text text-luxury-black/90 break-words">{selected.goals}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Expected gain</p>
                      <p className="thin-text text-luxury-black/90 break-words">{selected.expected_gain}</p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Consent to be photographed/recorded</p>
                      <p className="thin-text text-luxury-black">{selected.consent_photo_video}</p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">How did you hear about us?</p>
                      <p className="thin-text text-luxury-black">{selected.referral_source}</p>
                    </div>
                  </div>
                </section>

                <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                  <p className="editorial-text text-xl text-luxury-black">Social Media</p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Instagram</p>
                      <p className="thin-text text-luxury-black">{selected.instagram_handle ?? '-'}</p>
                    </div>
                    <div>
                      <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">TikTok / Other</p>
                      <p className="thin-text text-luxury-black">{selected.tiktok_or_other ?? '-'}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isTicketPreviewOpen && ticketPreviewDataUrl ? (
        <div
          className="fixed inset-0 z-[220] bg-black/70 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Ticket preview modal"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsTicketPreviewOpen(false)
          }}
        >
          <div className="w-full max-w-5xl bg-luxury-white border border-luxury-black/20 p-6 md:p-8 space-y-5">
            <div className="space-y-1">
              <p className="editorial-text text-3xl text-luxury-black">Ticket Preview</p>
              <p className="thin-text text-luxury-black/70">
                {ticketPreviewName} • Reg No:{' '}
                <span className="font-medium">
                  {ticketPreviewRegNumber !== null ? String(ticketPreviewRegNumber).padStart(8, '0') : '-'}
                </span>
              </p>
            </div>

            <div className="relative w-full aspect-[16/10] border border-luxury-black/20 bg-luxury-white">
              <Image src={ticketPreviewDataUrl} alt="Generated ticket preview" fill className="object-contain" unoptimized />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsTicketPreviewOpen(false)}
                className="px-8 py-3 border border-luxury-black/30 text-luxury-black thin-text tracking-wider uppercase"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownloadPreviewTicket}
                className="px-8 py-3 bg-luxury-black text-luxury-white thin-text tracking-wider uppercase"
              >
                Download Ticket
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

