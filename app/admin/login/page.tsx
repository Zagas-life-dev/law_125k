'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowser()
      if (!supabase) {
        throw new Error('Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.')
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        throw new Error(signInError.message)
      }

      const accessToken = data.session?.access_token
      if (!accessToken) {
        throw new Error('No session returned. Please try again.')
      }

      // Validate admin access
      const meRes = await fetch('/api/admin/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const me = (await meRes.json()) as { isAdmin: boolean; reason?: string }
      if (!meRes.ok || !me.isAdmin) {
        throw new Error(me.reason || 'You are not authorized as an admin.')
      }

      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-luxury-white px-6 py-16">
      <div className="w-full max-w-md border border-luxury-black/15 p-8 bg-white/60 backdrop-blur rounded-2xl">
        <h1 className="editorial-text text-4xl text-luxury-black mb-2">Admin Login</h1>
        <p className="thin-text text-luxury-black/70 mb-6">Sign in to manage masterclass registrations.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
            />
          </div>

          {error ? <p className="text-red-600 thin-text text-sm">{error}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-4 bg-luxury-black text-luxury-white thin-text tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}

