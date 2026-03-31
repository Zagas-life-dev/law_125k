'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'

type Plan = {
  code: string
  title: string
  description: string
  price: number
}

type OnboardingData = {
  full_name: string | null
  phone: string | null
  gender: string | null
  city_state: string | null
  preferred_location: string | null
  selected_tracks: string[] | null
  scholarship_type: string | null
  scholarship_percent: number | null
  monthly_enabled: boolean | null
  monthly_amount: number | null
  due_date: string | null
  total_due: number | null
  amount_paid: number | null
  outstanding_balance: number | null
  completed: boolean | null
}

function StudentOnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedTrack = searchParams.get('track') ?? ''

  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')
  const [cityState, setCityState] = useState('')
  const [preferredLocation, setPreferredLocation] = useState('')
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [scholarshipType, setScholarshipType] = useState<'none' | 'percentage' | 'full'>('none')
  const [scholarshipPercent, setScholarshipPercent] = useState('')
  const [monthlyEnabled, setMonthlyEnabled] = useState(false)
  const [monthlyAmount, setMonthlyAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [computedTotal, setComputedTotal] = useState(0)
  const [computedOutstanding, setComputedOutstanding] = useState(0)

  const computeTotals = useMemo(() => {
    const base = plans
      .filter((plan) => selectedTracks.includes(plan.code))
      .reduce((sum, plan) => sum + plan.price, 0)
    const percent = scholarshipType === 'percentage' ? Math.max(0, Math.min(100, Number(scholarshipPercent) || 0)) : 0
    const scholarshipApplied =
      scholarshipType === 'full' ? base : scholarshipType === 'percentage' ? (base * percent) / 100 : 0
    const effective = Math.max(0, base - scholarshipApplied)
    const paid = Math.max(0, Number(amountPaid) || 0)
    const outstanding = Math.max(0, effective - paid)
    return { total: base, outstanding }
  }, [plans, selectedTracks, scholarshipType, scholarshipPercent, amountPaid])

  useEffect(() => {
    setComputedTotal(computeTotals.total)
    setComputedOutstanding(computeTotals.outstanding)
  }, [computeTotals])

  const getAccessToken = async () => {
    const supabase = getSupabaseBrowser()
    if (!supabase) throw new Error('Missing Supabase env vars.')
    const sessionRes = await supabase.auth.getSession()
    const token = sessionRes.data.session?.access_token
    if (!token) {
      router.push('/student')
      throw new Error('Session expired.')
    }
    return token
  }

  useEffect(() => {
    const load = async () => {
      try {
        setError('')
        const token = await getAccessToken()
        const [plansRes, onboardingRes] = await Promise.all([
          fetch('/api/student/plans'),
          fetch('/api/student/onboarding', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const plansJson = (await plansRes.json()) as { success: boolean; data?: Plan[] }
        if (!plansRes.ok || !plansJson.success) throw new Error('Failed to load plans.')
        const loadedPlans = plansJson.data ?? []
        setPlans(loadedPlans)

        const onboardingJson = (await onboardingRes.json()) as { success: boolean; data?: OnboardingData | null; error?: { message: string } }
        if (!onboardingRes.ok || !onboardingJson.success) throw new Error(onboardingJson.error?.message ?? 'Failed to load onboarding.')
        const onboarding = onboardingJson.data
        if (onboarding) {
          setFullName(onboarding.full_name ?? '')
          setPhone(onboarding.phone ?? '')
          setGender(onboarding.gender ?? '')
          setCityState(onboarding.city_state ?? '')
          setPreferredLocation(onboarding.preferred_location ?? '')
          setSelectedTracks(onboarding.selected_tracks ?? [])
          setScholarshipType((onboarding.scholarship_type as 'none' | 'percentage' | 'full') ?? 'none')
          setScholarshipPercent(String(onboarding.scholarship_percent ?? ''))
          setMonthlyEnabled(Boolean(onboarding.monthly_enabled))
          setMonthlyAmount(String(onboarding.monthly_amount ?? ''))
          setDueDate(onboarding.due_date ?? '')
          setAmountPaid(String(onboarding.amount_paid ?? ''))
        } else if (preselectedTrack && loadedPlans.some((plan) => plan.code === preselectedTrack)) {
          setSelectedTracks([preselectedTrack])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load onboarding.')
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [preselectedTrack, router])

  const toggleTrack = (code: string) => {
    setSelectedTracks((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
  }

  const save = async (completed: boolean) => {
    try {
      setIsSaving(true)
      setError('')
      setSuccess('')
      const token = await getAccessToken()
      const res = await fetch('/api/student/onboarding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          phone,
          gender,
          cityState,
          preferredLocation,
          selectedTracks,
          scholarshipType,
          scholarshipPercent,
          monthlyEnabled,
          monthlyAmount,
          dueDate,
          amountPaid,
          completed,
        }),
      })
      const json = (await res.json()) as { success: boolean; error?: { message: string } }
      if (!res.ok || !json.success) throw new Error(json.error?.message ?? 'Failed to save onboarding.')
      setSuccess(completed ? 'Onboarding completed. Redirecting to profile.' : 'Saved progress.')
      if (completed) router.push('/student/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-luxury-white">
        <p className="thin-text text-luxury-black/70">Loading onboarding...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-luxury-white px-6 py-14">
      <div className="max-w-4xl mx-auto border border-luxury-black/15 bg-white/70 rounded-3xl p-8 md:p-10 space-y-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-luxury-black/50 thin-text mb-2">Student Onboarding</p>
          <h1 className="editorial-text text-5xl text-luxury-black mb-3">Complete your profile</h1>
          <p className="thin-text text-luxury-black/70">Step flow: Account / Onboarding / Profile.</p>
        </div>

        <section className="grid md:grid-cols-2 gap-4">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
          <input value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Gender" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
          <input value={cityState} onChange={(e) => setCityState(e.target.value)} placeholder="City / State" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
          <input value={preferredLocation} onChange={(e) => setPreferredLocation(e.target.value)} placeholder="Preferred location (online/lagos/abuja/custom)" className="md:col-span-2 w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
        </section>

        <section className="space-y-3">
          <p className="text-sm uppercase tracking-wider thin-text text-luxury-black/60">Select track/plan</p>
          <div className="grid md:grid-cols-2 gap-3">
            {plans.map((plan) => {
              const active = selectedTracks.includes(plan.code)
              return (
                <button
                  key={plan.code}
                  type="button"
                  onClick={() => toggleTrack(plan.code)}
                  className={`text-left p-4 border ${active ? 'bg-luxury-black text-luxury-white border-luxury-black' : 'border-luxury-black/20 text-luxury-black'}`}
                >
                  <p className="editorial-text text-2xl">{plan.title}</p>
                  <p className={`thin-text text-sm mt-1 ${active ? 'text-luxury-white/70' : 'text-luxury-black/70'}`}>{plan.description}</p>
                  <p className={`thin-text text-sm mt-2 ${active ? 'text-luxury-white' : 'text-luxury-black'}`}>₦{plan.price.toLocaleString()}</p>
                </button>
              )
            })}
          </div>
          <p className="thin-text text-sm text-luxury-black/60">Pricing source is shared with `/courses` page.</p>
        </section>

        {/* <section className="grid md:grid-cols-2 gap-4">
          <select value={scholarshipType} onChange={(e) => setScholarshipType(e.target.value as 'none' | 'percentage' | 'full')} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none">
            <option value="none">No scholarship</option>
            <option value="percentage">Percentage scholarship</option>
            <option value="full">Full scholarship</option>
          </select>
          <input value={scholarshipPercent} onChange={(e) => setScholarshipPercent(e.target.value)} placeholder="Scholarship % (if percentage)" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
          <label className="md:col-span-2 flex items-center gap-2 thin-text text-luxury-black">
            <input type="checkbox" checked={monthlyEnabled} onChange={(e) => setMonthlyEnabled(e.target.checked)} />
            Enable monthly payment plan
          </label>
          {monthlyEnabled ? (
            <input value={monthlyAmount} onChange={(e) => setMonthlyAmount(e.target.value)} placeholder="Monthly amount" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
          ) : null}
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
          <input value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} placeholder="Amount paid (default 0)" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
          <div className="md:col-span-2 border border-luxury-black/15 p-4 bg-luxury-white">
            <p className="thin-text text-luxury-black">Computed total due: <span className="font-medium">₦{computedTotal.toLocaleString()}</span></p>
            <p className="thin-text text-luxury-black">Outstanding balance: <span className="font-medium">₦{computedOutstanding.toLocaleString()}</span></p>
          </div>
        </section> */}

        {error ? <p className="text-red-600 thin-text text-sm">{error}</p> : null}
        {success ? <p className="text-green-700 thin-text text-sm">{success}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => void save(false)} disabled={isSaving} className="px-8 py-4 border border-luxury-black/20 text-luxury-black thin-text tracking-wider uppercase disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Save Progress'}
          </button>
          <button type="button" onClick={() => void save(true)} disabled={isSaving} className="px-8 py-4 bg-luxury-black text-luxury-white thin-text tracking-wider uppercase disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Continue to Profile'}
          </button>
          <Link href="/courses" className="px-8 py-4 border border-luxury-black/20 text-luxury-black thin-text tracking-wider uppercase">
            View Courses
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function StudentOnboardingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-luxury-white">
          <p className="thin-text text-luxury-black/70">Loading onboarding...</p>
        </main>
      }
    >
      <StudentOnboardingContent />
    </Suspense>
  )
}
