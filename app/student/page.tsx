'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'
import Link from 'next/link'

export default function StudentAuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowser()
      if (!supabase) throw new Error('Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.')

      let destination = '/student/onboarding'

      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.')
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() || null, role: 'student' },
          },
        })
        if (signUpError) throw new Error(signUpError.message)
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (signInError) throw new Error(signInError.message)

        const sessionRes = await supabase.auth.getSession()
        const token = sessionRes.data.session?.access_token

        if (token) {
          const profileRes = await fetch('/api/student/profile', {
            headers: { Authorization: `Bearer ${token}` },
          })
          const profileJson = (await profileRes.json()) as { success?: boolean; data?: unknown }
          if (profileRes.ok && profileJson.success && profileJson.data) {
            destination = '/student/profile'
          }
        }
      }

      router.push(destination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-luxury-white px-6 py-14">
      <div className="max-w-xl mx-auto border border-luxury-black/15 bg-white/70 rounded-3xl p-8 md:p-10">
        <p className="text-xs tracking-[0.2em] uppercase text-luxury-black/50 thin-text mb-2">Student Portal</p>
        <h1 className="editorial-text text-5xl text-luxury-black mb-3">Welcome</h1>
        <p className="thin-text text-luxury-black/70 mb-7">
          Sign in or create your student account to complete registration and choose your plan.
        </p>

        <div className="flex border border-luxury-black/15 mb-6">
          <button type="button" onClick={() => setMode('signin')} className={`flex-1 py-3 thin-text uppercase tracking-wider ${mode === 'signin' ? 'bg-luxury-black text-luxury-white' : 'text-luxury-black'}`}>Sign In</button>
          <button type="button" onClick={() => setMode('signup')} className={`flex-1 py-3 thin-text uppercase tracking-wider ${mode === 'signup' ? 'bg-luxury-black text-luxury-white' : 'text-luxury-black'}`}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' ? (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
              required
            />
          ) : null}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
            required
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider thin-text text-luxury-black/60">Password</span>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs thin-text uppercase tracking-wider text-luxury-black/70 underline"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
              required
              minLength={6}
            />
          </div>
          {mode === 'signup' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider thin-text text-luxury-black/60">Confirm Password</span>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-xs thin-text uppercase tracking-wider text-luxury-black/70 underline"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
                required
                minLength={6}
              />
            </div>
          ) : null}

          {error ? <p className="text-red-600 thin-text text-sm">{error}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-4 bg-luxury-black text-luxury-white thin-text tracking-wider uppercase disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Continue'}
          </button>
        </form>

        <div className="mt-6">
          <Link href="/registration" className="text-sm thin-text text-luxury-black/70 underline">
            Continue as guest registration
          </Link>
        </div>
      </div>
    </main>
  )
}
