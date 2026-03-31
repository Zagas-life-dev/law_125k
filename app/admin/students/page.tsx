'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'
import type {
  StudentApiError,
  StudentApiSuccess,
  StudentDetail,
  StudentLinkageStatus,
  StudentListItem,
} from '@/lib/studentModels'

function displayOrFallback(value: string | null | undefined) {
  return value && value.trim() ? value : 'Not provided'
}

function formatTrack(track: string) {
  return track.replace('_', '/').toUpperCase()
}

export default function AdminStudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<StudentListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selected, setSelected] = useState<StudentDetail | null>(null)
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [addForm, setAddForm] = useState({
    registrationId: '',
    userId: '',
    status: 'active',
    tracksCsv: '',
    totalDue: '',
    amountPaid: '',
    adminNotes: '',
  })
  const [editForm, setEditForm] = useState({
    userId: '',
    status: 'active',
    tracksCsv: '',
    totalDue: '',
    amountPaid: '',
    adminNotes: '',
  })

  const linkageBadgeClass: Record<StudentLinkageStatus, string> = {
    linked: 'border-green-700/20 text-green-700',
    unlinked: 'border-amber-700/20 text-amber-700',
    link_conflict: 'border-red-700/20 text-red-700',
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/masterclasses', label: 'Masterclasses' },
    { href: '/admin/students', label: 'Students' },
  ]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return students
    return students.filter((student) =>
      [student.fullName, student.email ?? '', student.phone, student.id].some((value) =>
        value.toLowerCase().includes(q)
      )
    )
  }, [query, students])

  const getAdminAccessToken = async () => {
    const supabase = getSupabaseBrowser()
    if (!supabase) throw new Error('Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.')

    const sessionRes = await supabase.auth.getSession()
    const accessToken = sessionRes.data.session?.access_token
    if (!accessToken) throw new Error('Session expired. Please log in again.')
    return accessToken
  }

  const fetchStudents = async () => {
    setError('')
    setIsLoading(true)
    try {
      const accessToken = await getAdminAccessToken()
      const res = await fetch('/api/admin/students', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const json = (await res.json()) as StudentApiSuccess<StudentListItem[]> | StudentApiError
      if (!res.ok || !json.success) {
        throw new Error(!json.success ? json.error.message : 'Failed to load students.')
      }
      setStudents(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchStudents()
  }, [])

  const handleOpenDetail = async (id: string) => {
    setError('')
    setLoadingDetailId(id)
    try {
      const accessToken = await getAdminAccessToken()
      const res = await fetch(`/api/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const json = (await res.json()) as StudentApiSuccess<StudentDetail> | StudentApiError
      if (!res.ok || !json.success) {
        throw new Error(!json.success ? json.error.message : 'Failed to load student profile.')
      }
      setSelected(json.data)
      setEditForm({
        userId: json.data.authLink.userId ?? '',
        status: json.data.identity.status || 'active',
        tracksCsv: json.data.enrollment.tracks.join(', '),
        totalDue: String(json.data.billing.totalDue ?? ''),
        amountPaid: String(json.data.billing.amountPaid ?? ''),
        adminNotes: json.data.notes ?? '',
      })
      setIsDetailOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load student profile.')
    } finally {
      setLoadingDetailId(null)
    }
  }

  const handleLogout = async () => {
    const supabase = getSupabaseBrowser()
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleAddStudent = async () => {
    setError('')
    setIsSaving(true)
    try {
      const accessToken = await getAdminAccessToken()
      const payload = {
        registrationId: addForm.registrationId.trim(),
        userId: addForm.userId.trim() || null,
        status: addForm.status.trim(),
        enrollmentTracks: addForm.tracksCsv
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        totalDue: addForm.totalDue,
        amountPaid: addForm.amountPaid,
        adminNotes: addForm.adminNotes.trim() || null,
      }
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })
      const json = (await res.json()) as StudentApiSuccess<{ registrationId: string }> | StudentApiError
      if (!res.ok || !json.success) {
        throw new Error(!json.success ? json.error.message : 'Failed to add student.')
      }
      setIsAddOpen(false)
      setAddForm({
        registrationId: '',
        userId: '',
        status: 'active',
        tracksCsv: '',
        totalDue: '',
        amountPaid: '',
        adminNotes: '',
      })
      await fetchStudents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add student.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveStudentChanges = async () => {
    if (!selected) return
    setError('')
    setIsSaving(true)
    try {
      const accessToken = await getAdminAccessToken()
      const payload = {
        userId: editForm.userId.trim() || null,
        status: editForm.status.trim(),
        adminNotes: editForm.adminNotes.trim() || null,
        enrollmentTracks: editForm.tracksCsv
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        billing: {
          totalDue: editForm.totalDue,
          amountPaid: editForm.amountPaid,
        },
      }
      const res = await fetch(`/api/admin/students/${selected.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })
      const json = (await res.json()) as StudentApiSuccess<{ id: string }> | StudentApiError
      if (!res.ok || !json.success) {
        throw new Error(!json.success ? json.error.message : 'Failed to update student.')
      }
      await fetchStudents()
      await handleOpenDetail(selected.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="bg-luxury-white min-h-screen">
      <div className="hidden md:block fixed top-0 left-0 h-screen w-72 bg-white/70 backdrop-blur border-r border-luxury-black/10 z-[50]">
        <div className="p-6 space-y-6">
          <div>
            <p className="editorial-text text-3xl text-luxury-black">ADMIN</p>
            <p className="thin-text text-luxury-black/60 mt-2">Manage students</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl border transition-colors ${
                  item.href === '/admin/students'
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

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur border-t border-luxury-black/10">
        <div className="flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 text-center py-4 thin-text tracking-wider uppercase text-xs ${
                item.href === '/admin/students' ? 'text-luxury-white bg-luxury-black' : 'text-luxury-black/70'
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
              <h1 className="editorial-text text-4xl text-luxury-black">Students</h1>
              <p className="thin-text text-luxury-black/70 mt-2">Identity, media, enrollment, billing, scholarship and location.</p>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, or ID..."
              className="w-full sm:w-96 px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
            />
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="px-5 py-3 bg-luxury-black text-luxury-white thin-text tracking-wider uppercase"
            >
              Add Student
            </button>
          </div>

          {error ? <p className="text-red-600 thin-text text-sm mb-4">{error}</p> : null}

          <div className="border border-luxury-black/10 rounded-2xl overflow-hidden bg-white/60 backdrop-blur">
            {isLoading ? (
              <div className="p-8">
                <p className="thin-text text-luxury-black/70">Loading...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px]">
                  <thead>
                    <tr className="text-left text-sm text-luxury-black/60 thin-text">
                      <th className="px-5 py-4">Headshot</th>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Location</th>
                      <th className="px-5 py-4">Phone</th>
                      <th className="px-5 py-4">Tracks</th>
                      <th className="px-5 py-4">Link</th>
                      <th className="px-5 py-4">Billing</th>
                      <th className="px-5 py-4">Created</th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((student) => (
                      <tr key={student.id} className="border-t border-luxury-black/10">
                        <td className="px-5 py-4">
                          {student.headshotUrl ? (
                            <div className="relative w-16 h-20 border border-luxury-black/15 rounded-md overflow-hidden">
                              <Image src={student.headshotUrl} alt={`${student.fullName} headshot`} fill className="object-cover" unoptimized />
                            </div>
                          ) : (
                            <span className="text-xs text-luxury-black/45 thin-text">Not uploaded</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <p className="thin-text text-luxury-black">{student.fullName}</p>
                          <p className="text-xs text-luxury-black/50 thin-text">{student.email ?? 'Not provided'}</p>
                        </td>
                        <td className="px-5 py-4 thin-text">{student.locationDisplay}</td>
                        <td className="px-5 py-4 thin-text">{student.phone}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 flex-wrap">
                            {student.enrollmentTracks.length > 0 ? (
                              student.enrollmentTracks.map((track) => (
                                <span key={track} className="px-2 py-1 border border-luxury-black/20 text-xs thin-text uppercase tracking-wider">
                                  {formatTrack(track)}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-luxury-black/45 thin-text">Not set</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-1 border text-xs thin-text uppercase tracking-wider ${linkageBadgeClass[student.linkageStatus]}`}>
                            {student.linkageStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 thin-text">{student.billingStatus}</td>
                        <td className="px-5 py-4 thin-text">{new Date(student.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => void handleOpenDetail(student.id)}
                            disabled={loadingDetailId === student.id}
                            className="px-4 py-2 border border-luxury-black/20 bg-white/50 text-luxury-black thin-text tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingDetailId === student.id ? 'Loading...' : 'View Profile'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-5 py-10 text-center">
                          <p className="thin-text text-luxury-black/60">No students found.</p>
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

      {isDetailOpen && selected ? (
        <div
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Student profile details"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsDetailOpen(false)
          }}
        >
          <div className="w-full max-w-6xl bg-white/95 backdrop-blur border border-luxury-black/10 rounded-3xl p-6 md:p-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="editorial-text text-3xl text-luxury-black">Student Profile</p>
                <p className="thin-text text-luxury-black/70 mt-2">
                  ID: <span className="font-medium">{selected.id}</span> - {selected.identity.fullName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 border border-luxury-black/20 rounded-xl thin-text tracking-wider uppercase text-sm"
              >
                Close
              </button>
            </div>

            <div className="space-y-6">
              <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                <p className="editorial-text text-xl text-luxury-black">Identity</p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Name</p><p className="thin-text text-luxury-black">{selected.identity.fullName}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Email</p><p className="thin-text text-luxury-black">{displayOrFallback(selected.identity.email)}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Phone</p><p className="thin-text text-luxury-black">{selected.identity.phone}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Gender</p><p className="thin-text text-luxury-black">{selected.identity.gender}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Age</p><p className="thin-text text-luxury-black">{selected.identity.age ?? 'Not provided'}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Status</p><p className="thin-text text-luxury-black">{selected.identity.status}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Student ID</p><p className="thin-text text-luxury-black">{selected.studentId ?? 'Not assigned'}</p></div>
                </div>
              </section>

              <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                <p className="editorial-text text-xl text-luxury-black">Account Linkage</p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Link Status</p>
                    <span className={`px-2 py-1 border text-xs thin-text uppercase tracking-wider ${linkageBadgeClass[selected.authLink.status]}`}>
                      {selected.authLink.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">User ID</p><p className="thin-text text-luxury-black break-all">{displayOrFallback(selected.authLink.userId)}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Auth Email</p><p className="thin-text text-luxury-black">{displayOrFallback(selected.authLink.userEmail)}</p></div>
                </div>
              </section>

              <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                <p className="editorial-text text-xl text-luxury-black">Measurements</p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Height</p><p className="thin-text text-luxury-black">{displayOrFallback(selected.measurements.heightValue)} {displayOrFallback(selected.measurements.heightUnit)}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Weight</p><p className="thin-text text-luxury-black">{displayOrFallback(selected.measurements.weightValue)} {displayOrFallback(selected.measurements.weightUnit)}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Shoe size</p><p className="thin-text text-luxury-black">{displayOrFallback(selected.measurements.shoeSize)}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Bust/Chest</p><p className="thin-text text-luxury-black">{displayOrFallback(selected.measurements.bustChestValue)} {displayOrFallback(selected.measurements.bustChestUnit)}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Waist</p><p className="thin-text text-luxury-black">{displayOrFallback(selected.measurements.waistValue)} {displayOrFallback(selected.measurements.waistUnit)}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Hips</p><p className="thin-text text-luxury-black">{displayOrFallback(selected.measurements.hipsValue)} {displayOrFallback(selected.measurements.hipsUnit)} {selected.measurements.hipsConverted ? `(${selected.measurements.hipsConverted})` : ''}</p></div>
                </div>
              </section>

              <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                <p className="editorial-text text-xl text-luxury-black">Socials</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Instagram</p><p className="thin-text text-luxury-black">{displayOrFallback(selected.socials.instagram)}</p></div>
                  <div><p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">TikTok / Other</p><p className="thin-text text-luxury-black">{displayOrFallback(selected.socials.tiktokOrOther)}</p></div>
                </div>
              </section>

              <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                <p className="editorial-text text-xl text-luxury-black">Media</p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-2">Headshot</p>
                    {selected.media.headshotUrl ? (
                      <div className="relative w-full aspect-[4/5] border border-luxury-black/15 rounded-xl overflow-hidden">
                        <Image src={selected.media.headshotUrl} alt="Headshot" fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="border border-dashed border-luxury-black/20 rounded-xl p-5 text-sm thin-text text-luxury-black/50">Not uploaded</div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-2">Catwalk Videos</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {selected.media.walkVideos.map((video, idx) => (
                        <div key={`walk-video-${idx}`} className="border border-luxury-black/15 rounded-xl overflow-hidden">
                          {video ? (
                            <video src={video} controls className="w-full h-auto block" />
                          ) : (
                            <div className="p-5 text-sm thin-text text-luxury-black/50">Not uploaded</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-6 mt-6">
                  <div>
                    <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-2">Profile Angles</p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selected.media.profileImages).map(([key, url]) => (
                        <div key={key} className="border border-luxury-black/15 rounded-xl overflow-hidden">
                          {url ? (
                            <div className="relative w-full aspect-[3/4]">
                              <Image src={url} alt={`Profile ${key}`} fill className="object-cover" unoptimized />
                            </div>
                          ) : (
                            <div className="p-4 text-sm thin-text text-luxury-black/50">{key}: Not uploaded</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-2">Full-body Angles</p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selected.media.fullBodyImages).map(([key, url]) => (
                        <div key={key} className="border border-luxury-black/15 rounded-xl overflow-hidden">
                          {url ? (
                            <div className="relative w-full aspect-[3/4]">
                              <Image src={url} alt={`Full body ${key}`} fill className="object-cover" unoptimized />
                            </div>
                          ) : (
                            <div className="p-4 text-sm thin-text text-luxury-black/50">{key}: Not uploaded</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                <p className="editorial-text text-xl text-luxury-black">Enrollment & Billing</p>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-2">Tracks</p>
                    <div className="flex gap-2 flex-wrap">
                      {selected.enrollment.tracks.length > 0 ? (
                        selected.enrollment.tracks.map((track) => (
                          <span key={track} className="px-2 py-1 border border-luxury-black/20 text-xs thin-text uppercase tracking-wider">
                            {formatTrack(track)}
                          </span>
                        ))
                      ) : (
                        <span className="thin-text text-luxury-black/50">Not set</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em]">Billing</p>
                    <p className="thin-text text-luxury-black">Plan: {selected.billing.planType}{selected.billing.customPlanName ? ` (${selected.billing.customPlanName})` : ''}</p>
                    <p className="thin-text text-luxury-black">Total Due: ₦{selected.billing.totalDue.toLocaleString()}</p>
                    <p className="thin-text text-luxury-black">Amount Paid: ₦{selected.billing.amountPaid.toLocaleString()}</p>
                    <p className="thin-text text-luxury-black">Scholarship: {selected.billing.scholarshipType}{selected.billing.scholarshipType === 'percentage' ? ` (${selected.billing.scholarshipPercent}%)` : ''}</p>
                    <p className="thin-text text-luxury-black">Scholarship Applied: ₦{selected.billing.scholarshipAmountApplied.toLocaleString()}</p>
                    <p className="thin-text text-luxury-black font-medium">Outstanding: ₦{selected.billing.outstandingBalance.toLocaleString()}</p>
                    <p className="thin-text text-luxury-black">Due Date: {displayOrFallback(selected.billing.dueDate)}</p>
                    <p className="thin-text text-luxury-black">Monthly Installment: {selected.billing.monthlyEnabled ? `Enabled (₦${(selected.billing.monthlyAmount ?? 0).toLocaleString()})` : 'Disabled'}</p>
                  </div>
                </div>
              </section>

              <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                <p className="editorial-text text-xl text-luxury-black">Location & Notes</p>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Location Mode</p>
                    <p className="thin-text text-luxury-black">{selected.location.mode}</p>
                    <p className="thin-text text-luxury-black/70 mt-1">Display: {selected.location.display}</p>
                    {selected.location.mode === 'custom' ? (
                      <p className="thin-text text-luxury-black/70 mt-1">Custom: {displayOrFallback(selected.location.customLocationText)}</p>
                    ) : null}
                  </div>
                  <div>
                    <p className="thin-text text-xs text-luxury-black/60 uppercase tracking-[0.2em] mb-1">Admin Notes</p>
                    <p className="thin-text text-luxury-black whitespace-pre-wrap break-words">{displayOrFallback(selected.notes)}</p>
                  </div>
                </div>
              </section>

              <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                <p className="editorial-text text-xl text-luxury-black">Edit Student</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <input
                    value={editForm.userId}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, userId: e.target.value }))}
                    placeholder="Link User ID (optional)"
                    className="md:col-span-2 w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
                  />
                  <input
                    value={editForm.status}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                    placeholder="Status"
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
                  />
                  <input
                    value={editForm.tracksCsv}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, tracksCsv: e.target.value }))}
                    placeholder="Tracks (comma separated)"
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
                  />
                  <input
                    value={editForm.totalDue}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, totalDue: e.target.value }))}
                    placeholder="Total due"
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
                  />
                  <input
                    value={editForm.amountPaid}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, amountPaid: e.target.value }))}
                    placeholder="Amount paid"
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
                  />
                  <textarea
                    value={editForm.adminNotes}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, adminNotes: e.target.value }))}
                    placeholder="Admin notes"
                    className="md:col-span-2 w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => void handleSaveStudentChanges()}
                    disabled={isSaving}
                    className="px-5 py-3 bg-luxury-black text-luxury-white thin-text tracking-wider uppercase disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}

      {isAddOpen ? (
        <div
          className="fixed inset-0 z-[210] bg-black/70 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Add student modal"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsAddOpen(false)
          }}
        >
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur border border-luxury-black/10 rounded-3xl p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="editorial-text text-3xl text-luxury-black">Add Student</p>
                <p className="thin-text text-luxury-black/70 mt-2">Create student profile from existing registration ID.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 border border-luxury-black/20 rounded-xl thin-text tracking-wider uppercase text-sm"
              >
                Close
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={addForm.registrationId}
                onChange={(e) => setAddForm((prev) => ({ ...prev, registrationId: e.target.value }))}
                placeholder="Registration ID"
                className="md:col-span-2 w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
              />
              <input
                value={addForm.userId}
                onChange={(e) => setAddForm((prev) => ({ ...prev, userId: e.target.value }))}
                placeholder="Auth User ID (optional)"
                className="md:col-span-2 w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
              />
              <input
                value={addForm.status}
                onChange={(e) => setAddForm((prev) => ({ ...prev, status: e.target.value }))}
                placeholder="Status"
                className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
              />
              <input
                value={addForm.tracksCsv}
                onChange={(e) => setAddForm((prev) => ({ ...prev, tracksCsv: e.target.value }))}
                placeholder="Tracks (comma separated)"
                className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
              />
              <input
                value={addForm.totalDue}
                onChange={(e) => setAddForm((prev) => ({ ...prev, totalDue: e.target.value }))}
                placeholder="Total due"
                className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
              />
              <input
                value={addForm.amountPaid}
                onChange={(e) => setAddForm((prev) => ({ ...prev, amountPaid: e.target.value }))}
                placeholder="Amount paid"
                className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
              />
              <textarea
                value={addForm.adminNotes}
                onChange={(e) => setAddForm((prev) => ({ ...prev, adminNotes: e.target.value }))}
                placeholder="Admin notes"
                rows={3}
                className="md:col-span-2 w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none thin-text"
              />
            </div>
            <div className="flex justify-end mt-5">
              <button
                type="button"
                onClick={() => void handleAddStudent()}
                disabled={isSaving}
                className="px-5 py-3 bg-luxury-black text-luxury-white thin-text tracking-wider uppercase disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
