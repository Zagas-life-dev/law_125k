'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { BACKGROUND_VIDEO_MAX_SECONDS, BACKGROUND_VIDEO_RECENT_COUNT } from '@/lib/gallery-data'

const FADE_DURATION = 0.25

/**
 * Picks a random URL from `urls` that is not in `exclude`. If all are excluded, picks from full list.
 */
function pickNextUrl(urls: string[], exclude: string[]): string {
  const available = urls.filter((u) => !exclude.includes(u))
  const pool = available.length > 0 ? available : urls
  return pool[Math.floor(Math.random() * pool.length)]
}

export type UseBackgroundVideoCycleOptions = {
  maxRecent?: number
  maxSeconds?: number
}

/**
 * Hook for background video cycling with a rolling "last N played" exclusion.
 * Keeps a local array of the last N played URLs; they cannot be picked again until they leave the window.
 * State is updated with setState (and useEffect for initial recent list); no persistence.
 */
export function useBackgroundVideoCycle(
  urls: string[],
  options: UseBackgroundVideoCycleOptions = {}
) {
  const { maxRecent = BACKGROUND_VIDEO_RECENT_COUNT, maxSeconds = BACKGROUND_VIDEO_MAX_SECONDS } = options

  const [currentVideo, setCurrentVideo] = useState(() =>
    urls.length > 0 ? urls[Math.floor(Math.random() * urls.length)] : ''
  )
  const [transitioning, setTransitioning] = useState(false)
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([])

  const maxDurationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Mark the initial video as "recently played" once on mount so it's excluded from the next pick
  useEffect(() => {
    if (currentVideo) {
      setRecentlyPlayed((prev) => {
        if (prev.includes(currentVideo)) return prev
        return [...prev, currentVideo].slice(-maxRecent)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- only run once to seed initial video

  const playNextRandom = useCallback(() => {
    if (maxDurationTimeoutRef.current) {
      clearTimeout(maxDurationTimeoutRef.current)
      maxDurationTimeoutRef.current = null
    }
    setTransitioning(true)
    const t1 = setTimeout(() => {
      const next = pickNextUrl(urls, recentlyPlayed)
      setCurrentVideo(next)
      setRecentlyPlayed((prev) => [...prev, next].slice(-maxRecent))
      const t2 = setTimeout(() => setTransitioning(false), (FADE_DURATION + 0.15) * 1000)
      return () => clearTimeout(t2)
    }, FADE_DURATION * 1000)
    return () => clearTimeout(t1)
  }, [urls, recentlyPlayed, maxRecent])

  const onVideoPlay = useCallback(() => {
    if (maxDurationTimeoutRef.current) clearTimeout(maxDurationTimeoutRef.current)
    maxDurationTimeoutRef.current = setTimeout(playNextRandom, maxSeconds * 1000)
  }, [playNextRandom, maxSeconds])

  useEffect(() => () => {
    if (maxDurationTimeoutRef.current) clearTimeout(maxDurationTimeoutRef.current)
  }, [])

  return { currentVideo, transitioning, playNextRandom, onVideoPlay }
}
