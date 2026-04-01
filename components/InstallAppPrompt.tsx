'use client'

import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type InstallAppPromptProps = {
  storageKey?: string
  installedKey?: string
  dismissedKey?: string
}

export default function InstallAppPrompt({
  storageKey = 'show-install-prompt-after-login',
  installedKey = 'pwa-installed',
  dismissedKey = 'pwa-install-dismissed',
}: InstallAppPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [shouldPromptAfterLogin, setShouldPromptAfterLogin] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    if (isStandalone) {
      window.localStorage.setItem(installedKey, '1')
      return
    }

    if (window.localStorage.getItem(installedKey) === '1') return
    if (window.localStorage.getItem(dismissedKey) === '1') return

    const shouldPrompt = window.sessionStorage.getItem(storageKey) === '1'
    if (shouldPrompt) {
      setShouldPromptAfterLogin(true)
      window.sessionStorage.removeItem(storageKey)
    }
  }, [dismissedKey, installedKey, storageKey])

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      const installEvent = event as BeforeInstallPromptEvent
      setDeferredPrompt(installEvent)
      if (shouldPromptAfterLogin) setVisible(true)
    }

    const onAppInstalled = () => {
      window.localStorage.setItem(installedKey, '1')
      setVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [installedKey, shouldPromptAfterLogin])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    setIsInstalling(true)
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      window.localStorage.setItem(installedKey, '1')
      window.localStorage.removeItem(dismissedKey)
    } else {
      window.localStorage.setItem(dismissedKey, '1')
    }
    setIsInstalling(false)
    setVisible(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    window.localStorage.setItem(dismissedKey, '1')
    setVisible(false)
  }

  if (!visible || !deferredPrompt) return null

  return (
    <div className="fixed inset-0 z-[250] bg-black/60 flex items-center justify-center p-5">
      <div className="w-full max-w-md rounded-2xl border border-luxury-black/20 bg-luxury-white p-6 shadow-2xl">
        <p className="editorial-text text-3xl text-luxury-black">Install App</p>
        <p className="thin-text text-luxury-black/70 mt-2">
          Add this app to your device for a faster dashboard experience and easier access.
        </p>
        <div className="mt-5 flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2 border border-luxury-black/25 thin-text uppercase tracking-wider"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={() => void handleInstall()}
            disabled={isInstalling}
            className="px-5 py-2 bg-luxury-black text-luxury-white thin-text uppercase tracking-wider disabled:opacity-50"
          >
            {isInstalling ? 'Please wait...' : 'Install'}
          </button>
        </div>
      </div>
    </div>
  )
}
