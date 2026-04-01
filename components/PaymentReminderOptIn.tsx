'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'

type NotificationState = 'loading' | 'unsupported' | 'disabled' | 'enabled' | 'error'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i)
  return output
}

export default function PaymentReminderOptIn() {
  const [state, setState] = useState<NotificationState>('loading')
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [publicKey, setPublicKey] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
        setState('unsupported')
        return
      }

      try {
        const supabase = getSupabaseBrowser()
        if (!supabase) {
          setState('error')
          setMessage('Supabase client missing.')
          return
        }
        const sessionRes = await supabase.auth.getSession()
        const token = sessionRes.data.session?.access_token
        if (!token) {
          setState('disabled')
          return
        }

        const res = await fetch('/api/student/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = (await res.json()) as {
          success: boolean
          data?: { enabled: boolean; configured: boolean; publicKey: string }
          error?: { message: string }
        }

        if (!res.ok || !json.success || !json.data) {
          setState('error')
          setMessage(json.error?.message ?? 'Unable to load notification settings.')
          return
        }

        if (!json.data.configured || !json.data.publicKey) {
          setState('disabled')
          setMessage('Notifications are not configured yet.')
          return
        }

        setPublicKey(json.data.publicKey)
        setState(json.data.enabled ? 'enabled' : 'disabled')
      } catch {
        setState('error')
        setMessage('Unable to load notification settings.')
      }
    }
    void load()
  }, [])

  const enable = async () => {
    if (!publicKey) return
    setIsSaving(true)
    setMessage('')
    try {
      const supabase = getSupabaseBrowser()
      if (!supabase) throw new Error('Supabase unavailable.')
      const sessionRes = await supabase.auth.getSession()
      const token = sessionRes.data.session?.access_token
      if (!token) throw new Error('Session expired.')

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Notification permission denied.')
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      const res = await fetch('/api/student/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription.toJSON()),
      })
      const json = (await res.json()) as { success: boolean; error?: { message: string } }
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message ?? 'Failed to enable notifications.')
      }

      setState('enabled')
      setMessage('Payment reminders are enabled.')
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Failed to enable notifications.')
    } finally {
      setIsSaving(false)
    }
  }

  if (state === 'unsupported') return null

  return (
    <section className="border border-luxury-black/10 rounded-2xl p-5 bg-white/50">
      <p className="editorial-text text-2xl text-luxury-black mb-2">Payment Reminders</p>
      <p className="thin-text text-luxury-black/70">
        Get push reminders when payment is due: 7 days, 3 days, 1 day, due day, and every 3 days overdue.
      </p>
      <div className="mt-4 flex items-center gap-3">
        {state === 'enabled' ? (
          <span className="px-3 py-2 border border-green-700/20 text-green-700 thin-text uppercase tracking-wider text-xs">
            Enabled
          </span>
        ) : (
          <button
            type="button"
            onClick={() => void enable()}
            disabled={isSaving || state === 'loading'}
            className="px-5 py-3 bg-luxury-black text-luxury-white thin-text uppercase tracking-wider disabled:opacity-50"
          >
            {isSaving ? 'Enabling...' : 'Enable Notifications'}
          </button>
        )}
      </div>
      {message ? <p className="mt-3 thin-text text-sm text-luxury-black/75">{message}</p> : null}
    </section>
  )
}
