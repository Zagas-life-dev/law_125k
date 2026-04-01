import webpush from 'web-push'

const PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
const PRIVATE_KEY = process.env.WEB_PUSH_PRIVATE_KEY
const CONTACT_EMAIL = process.env.WEB_PUSH_CONTACT_EMAIL ?? 'admin@lawmodelsacademy.com'

let configured = false

export function isWebPushConfigured() {
  return Boolean(PUBLIC_KEY && PRIVATE_KEY)
}

export function getWebPushPublicKey() {
  return PUBLIC_KEY ?? ''
}

export function ensureWebPushConfigured() {
  if (configured) return
  if (!PUBLIC_KEY || !PRIVATE_KEY) {
    throw new Error(
      'Missing Web Push env vars. Set NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY and WEB_PUSH_PRIVATE_KEY.'
    )
  }
  webpush.setVapidDetails(`mailto:${CONTACT_EMAIL}`, PUBLIC_KEY, PRIVATE_KEY)
  configured = true
}

export async function sendWebPushNotification(
  subscription: {
    endpoint: string
    keys: { p256dh: string; auth: string }
  },
  payload: {
    title: string
    body: string
    url?: string
    icon?: string
    badge?: string
  }
) {
  ensureWebPushConfigured()
  await webpush.sendNotification(subscription, JSON.stringify(payload))
}
