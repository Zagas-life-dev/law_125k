'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'
import { CiGrid41, CiLogout, CiShoppingTag, CiUser } from 'react-icons/ci'
import InstallAppPrompt from '@/components/InstallAppPrompt'

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

  const navItems: Array<{
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }> = [
    { href: '/admin', label: 'Dashboard', icon: CiGrid41 },
    { href: '/admin/masterclasses', label: 'Masterclasses', icon: CiShoppingTag },
    { href: '/admin/students', label: 'Students', icon: CiUser },
  ]

  const handleLogout = async () => {
    const supabase = getSupabaseBrowser()
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <main className="bg-luxury-white min-h-screen">
      <InstallAppPrompt />
      {/* Desktop sidebar */}
      <div className="hidden md:block fixed top-0 left-0 h-screen w-72 bg-white/70 backdrop-blur border-r border-luxury-black/10 z-[50]">
        <div className="p-6 space-y-6">
          <div>
            <p className="editorial-text text-3xl text-luxury-black">ADMIN</p>
            <p className="thin-text text-luxury-black/60 mt-2">Manage masterclass registrations</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                    item.href === '/admin'
                      ? 'border-luxury-black/15 bg-luxury-black text-luxury-white'
                      : 'border-transparent hover:border-luxury-black/15 hover:bg-white/60 text-luxury-black'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="thin-text tracking-wider uppercase text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="w-full px-4 py-3 border border-luxury-black/15 rounded-xl hover:bg-white/60 thin-text tracking-wider uppercase text-sm flex items-center justify-center gap-2"
          >
            <CiLogout className="text-xl" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur border-t border-luxury-black/10">
        <div className="grid grid-cols-3 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg ${
                  item.href === '/admin' ? 'text-luxury-black bg-luxury-black/10' : 'text-luxury-black/60'
                }`}
              >
                <Icon className="text-xl" />
                <span className="thin-text tracking-wider uppercase text-[10px]">{item.label}</span>
              </Link>
            )
          })}
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
            <Link
              href="/admin/students"
              className="border border-luxury-black/15 bg-white/60 backdrop-blur rounded-2xl p-7 hover-lift transition"
            >
              <p className="editorial-text text-2xl text-luxury-black">Students</p>
              <p className="thin-text text-luxury-black/70 mt-2">View student profiles, media, enrollment tracks and billing details.</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

