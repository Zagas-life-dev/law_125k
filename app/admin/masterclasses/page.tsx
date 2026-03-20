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
}

export default function AdminMasterclassesPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<MasterclassRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<MasterclassRegistration | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return registrations
    return registrations.filter((r) => {
      return (
        r.full_name.toLowerCase().includes(q) ||
        (r.email ?? '').toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
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

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/masterclasses', label: 'Masterclasses' },
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
                          <span className="thin-text">{r.id}</span>
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
    </main>
  )
}

