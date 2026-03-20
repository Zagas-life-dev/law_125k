'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'

type MeResponse = { isAdmin: boolean; userId?: string; email?: string; reason?: string }

export default function AdminDashboardPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [me, setMe] = useState<MeResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const check = async () => {
      try {
        const supabase = getSupabaseBrowser()
        if (!supabase) {
          router.push('/admin/login')
          return
        }

        const sessionRes = await supabase.auth.getSession()
        const accessToken = sessionRes.data.session?.access_token
        if (!accessToken) {
          router.push('/admin/login')
          return
        }

        const res = await fetch('/api/admin/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const json = (await res.json()) as MeResponse
        if (!res.ok || !json.isAdmin) {
          setError(json.reason || 'Not authorized.')
          router.push('/admin/login')
          return
        }

        setMe(json)
      } catch (e) {
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    void check()
  }, [router])

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-luxury-white">
        <p className="thin-text text-luxury-black/70">Loading...</p>
      </main>
    )
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/masterclasses', label: 'Masterclasses' },
  ]

  const handleLogout = async () => {
    const supabase = getSupabaseBrowser()
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/admin/login')
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
                  item.href === '/admin'
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
                item.href === '/admin' ? 'text-luxury-white bg-luxury-black' : 'text-luxury-black/70'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="md:pl-72 px-6 py-16 pb-28 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="editorial-text text-5xl text-luxury-black">Admin Dashboard</h1>
            <p className="thin-text text-luxury-black/70 mt-2">
              {me?.email ? `Signed in as ${me.email}` : error ? error : ''}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/admin/masterclasses"
              className="border border-luxury-black/15 bg-white/60 backdrop-blur rounded-2xl p-7 hover-lift transition"
            >
              <p className="editorial-text text-2xl text-luxury-black">Masterclass Registrations</p>
              <p className="thin-text text-luxury-black/70 mt-2">Manage all non-student masterclass registration data.</p>
            </Link>
          </div>

          <p className="thin-text text-luxury-black/50 mt-10">Student management will be added next.</p>
        </div>
      </div>
    </main>
  )
}

