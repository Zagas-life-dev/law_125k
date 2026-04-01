'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'
import type { StudentApiError, StudentApiSuccess, StudentDetail } from '@/lib/studentModels'
import { CiBank, CiCalendarDate, CiCircleList, CiLocationOn, CiUser } from 'react-icons/ci'
import InstallAppPrompt from '@/components/InstallAppPrompt'
import PaymentReminderOptIn from '@/components/PaymentReminderOptIn'

const display = (value: unknown) => {
  if (value === null || value === undefined) return 'Not provided'
  if (typeof value === 'string' && !value.trim()) return 'Not provided'
  return String(value)
}

export default function StudentProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<StudentDetail | null>(null)
  const [activeSection, setActiveSection] = useState<'overview' | 'identity' | 'billing' | 'location' | 'tracking'>('overview')

  useEffect(() => {
    const load = async () => {
      try {
        setError('')
        const supabase = getSupabaseBrowser()
        if (!supabase) {
          router.push('/student')
          return
        }
        const sessionRes = await supabase.auth.getSession()
        const token = sessionRes.data.session?.access_token
        if (!token) {
          router.push('/student')
          return
        }

        const res = await fetch('/api/student/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = (await res.json()) as StudentApiSuccess<StudentDetail | null> | StudentApiError
        if (!res.ok || !json.success || !json.data) {
          const message = !json.success ? json.error.message : 'Failed to load profile.'
          throw new Error(message)
        }
        setData(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile.')
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [router])

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-luxury-white">
        <p className="thin-text text-luxury-black/70">Loading profile...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-luxury-white px-6 py-14">
        <div className="max-w-3xl mx-auto border border-luxury-black/15 bg-white/70 rounded-3xl p-8">
          <p className="text-red-600 thin-text">{error}</p>
          <div className="mt-4 flex gap-3">
            <button onClick={() => window.location.reload()} className="px-5 py-3 border border-luxury-black/20 thin-text uppercase tracking-wider">
              Retry
            </button>
            <Link href="/student/onboarding" className="px-5 py-3 bg-luxury-black text-luxury-white thin-text uppercase tracking-wider">
              Go to Onboarding
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-luxury-white px-6 py-14">
        <div className="max-w-3xl mx-auto border border-luxury-black/15 bg-white/70 rounded-3xl p-8">
          <p className="thin-text text-luxury-black/70">No profile found yet.</p>
          <Link href="/student/onboarding" className="inline-block mt-4 px-5 py-3 bg-luxury-black text-luxury-white thin-text uppercase tracking-wider">
            Start Onboarding
          </Link>
        </div>
      </main>
    )
  }

  const navItems: Array<{
    id: 'overview' | 'identity' | 'billing' | 'location' | 'tracking'
    label: string
    icon: React.ComponentType<{ className?: string }>
  }> = [
    { id: 'overview', label: 'Overview', icon: CiCircleList },
    { id: 'identity', label: 'Profile', icon: CiUser },
    { id: 'billing', label: 'Billing', icon: CiBank },
    { id: 'location', label: 'Location', icon: CiLocationOn },
    { id: 'tracking', label: 'Timeline', icon: CiCalendarDate },
  ]

  return (
    <main className="min-h-screen bg-luxury-white pb-24 md:pb-0">
      <InstallAppPrompt />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          <aside className="hidden md:flex md:flex-col border border-luxury-black/15 rounded-3xl bg-white/70 p-5 h-fit sticky top-6">
            <p className="text-xs tracking-[0.2em] uppercase text-luxury-black/50 thin-text">Student Dashboard</p>
            <h1 className="editorial-text text-3xl text-luxury-black mt-2 mb-6">Welcome, {display(data.identity.fullName)}</h1>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border thin-text uppercase tracking-wider text-left transition ${
                      active
                        ? 'bg-luxury-black text-luxury-white border-luxury-black'
                        : 'border-luxury-black/15 text-luxury-black hover:border-luxury-black/40'
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="mt-6 pt-5 border-t border-luxury-black/10 space-y-3">
              <Link href="/student/onboarding" className="block px-4 py-3 border border-luxury-black/20 rounded-xl text-luxury-black thin-text uppercase tracking-wider text-center">
                Edit Onboarding
              </Link>
              <Link href="/courses" className="block px-4 py-3 bg-luxury-black text-luxury-white rounded-xl thin-text uppercase tracking-wider text-center">
                View Courses
              </Link>
            </div>
          </aside>

          <section className="border border-luxury-black/15 bg-white/70 rounded-3xl p-5 md:p-8 space-y-5">
            <div className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
              <p className="text-xs tracking-[0.2em] uppercase text-luxury-black/50 thin-text mb-2">Student Dashboard</p>
              <h2 className="editorial-text text-4xl text-luxury-black mb-2">Your Portal</h2>
              <p className="thin-text text-luxury-black/70">
                Manage your profile, billing, and enrollment details from one place.
              </p>
            </div>

            <PaymentReminderOptIn />

            {activeSection === 'overview' ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <article className="border border-luxury-black/10 rounded-2xl p-4 bg-white/50">
                  <p className="thin-text text-luxury-black/60 text-xs uppercase tracking-[0.15em]">Onboarding</p>
                  <p className="editorial-text text-2xl text-luxury-black mt-2">{data.onboardingCompleted ? 'Completed' : 'In Progress'}</p>
                </article>
                <article className="border border-luxury-black/10 rounded-2xl p-4 bg-white/50">
                  <p className="thin-text text-luxury-black/60 text-xs uppercase tracking-[0.15em]">Outstanding</p>
                  <p className="editorial-text text-2xl text-luxury-black mt-2">₦{Number(data.billing.outstandingBalance ?? 0).toLocaleString()}</p>
                </article>
                <article className="border border-luxury-black/10 rounded-2xl p-4 bg-white/50">
                  <p className="thin-text text-luxury-black/60 text-xs uppercase tracking-[0.15em]">Tracks</p>
                  <p className="editorial-text text-2xl text-luxury-black mt-2">{data.enrollment.tracks.length || 0}</p>
                </article>
              </div>
            ) : null}

            {activeSection === 'identity' ? (
              <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                <p className="editorial-text text-2xl text-luxury-black mb-4">Identity</p>
                <div className="grid md:grid-cols-2 gap-4 thin-text text-luxury-black">
                  <p>Name: {display(data.identity.fullName)}</p>
                  <p>Phone: {display(data.identity.phone)}</p>
                  <p>Gender: {display(data.identity.gender)}</p>
                  <p>Email: {display(data.identity.email)}</p>
                  <p>User ID: {display(data.authLink.userId)}</p>
                  <p>Student ID: {display(data.studentId)}</p>
                </div>
              </section>
            ) : null}

            {activeSection === 'location' ? (
              <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                <p className="editorial-text text-2xl text-luxury-black mb-4">Location</p>
                <div className="grid md:grid-cols-2 gap-4 thin-text text-luxury-black">
                  <p>Preferred: {display(data.location.display)}</p>
                  <p>City / State: {display(data.identity.cityState)}</p>
                  <p>Mode: {display(data.location.mode)}</p>
                  <p>Custom Location: {display(data.location.customLocationText)}</p>
                </div>
              </section>
            ) : null}

            {activeSection === 'billing' ? (
              <>
                <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                  <p className="editorial-text text-2xl text-luxury-black mb-4">Billing Summary</p>
                  <div className="grid md:grid-cols-2 gap-4 thin-text text-luxury-black">
                    <p>Total Due: ₦{Number(data.billing.totalDue ?? 0).toLocaleString()}</p>
                    <p>Amount Paid: ₦{Number(data.billing.amountPaid ?? 0).toLocaleString()}</p>
                    <p>Outstanding: ₦{Number(data.billing.outstandingBalance ?? 0).toLocaleString()}</p>
                    <p>Due Date: {display(data.billing.dueDate)}</p>
                    <p>Monthly Plan: {data.billing.monthlyEnabled ? 'Enabled' : 'Disabled'}</p>
                    <p>Monthly Amount: {data.billing.monthlyEnabled ? `₦${Number(data.billing.monthlyAmount ?? 0).toLocaleString()}` : 'Not provided'}</p>
                  </div>
                </section>

                <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                  <p className="editorial-text text-2xl text-luxury-black mb-4">Scholarship & Status</p>
                  <div className="grid md:grid-cols-2 gap-4 thin-text text-luxury-black">
                    <p>Scholarship Type: {display(data.billing.scholarshipType)}</p>
                    <p>Scholarship Percent: {display(data.billing.scholarshipPercent)}</p>
                    <p>Scholarship Applied: ₦{Number(data.billing.scholarshipAmountApplied ?? 0).toLocaleString()}</p>
                    <p>Onboarding Completed: {data.onboardingCompleted ? 'Yes' : 'No'}</p>
                    <p>Profile Status: {display(data.identity.status)}</p>
                    <p>Last Updated: {display(data.updatedAt ?? data.createdAt)}</p>
                  </div>
                </section>
              </>
            ) : null}

            {activeSection === 'tracking' ? (
              <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
                <p className="editorial-text text-2xl text-luxury-black mb-2">Timeline</p>
                <p className="thin-text text-luxury-black/70">This section is ready for upcoming student activity, submissions, and progress history.</p>
              </section>
            ) : null}
          </section>
        </div>
        <nav className="md:hidden fixed left-0 right-0 bottom-0 z-30 border-t border-luxury-black/15 bg-luxury-white/95 backdrop-blur-sm px-2 py-2">
          <div className="grid grid-cols-5 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = activeSection === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg ${
                    active ? 'text-luxury-black bg-luxury-black/10' : 'text-luxury-black/55'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="text-[10px] thin-text uppercase tracking-wider">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
        <div className="md:hidden fixed right-4 bottom-24 z-20 flex flex-col gap-2">
          <Link href="/student/onboarding" className="px-4 py-2 border border-luxury-black/20 rounded-xl bg-luxury-white text-luxury-black thin-text uppercase tracking-wider text-center text-xs">
            Onboarding
          </Link>
          <Link href="/courses" className="px-4 py-2 rounded-xl bg-luxury-black text-luxury-white thin-text uppercase tracking-wider text-center text-xs">
            Courses
          </Link>
        </div>
      </div>
    </main>
  )
}
