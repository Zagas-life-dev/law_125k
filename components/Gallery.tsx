'use client'

import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { GALLERY_MEDIA } from '@/lib/gallery-data'

const PLAYBACK_RATE = 0.65
const NUM_CONTAINERS = 13
const ROTATION_INTERVAL_MS = 9000
const TOTAL_ITEMS = GALLERY_MEDIA.length
// Each rotation steps by 13 so every slot gets a new set of items (no +1 shuffle)
const ROTATION_STEP = NUM_CONTAINERS

// Smooth, luxury transition: long crossfade, no bounce
const LUXURY_EASE = [0.22, 0.61, 0.36, 1]
const CROSSFADE_DURATION = 1

export default function Gallery() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [cycleIndex, setCycleIndex] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)

  const selected = GALLERY_MEDIA.find((m) => m.id === selectedId)

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + ROTATION_STEP) % TOTAL_ITEMS)
    }, ROTATION_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <section
        ref={galleryRef}
        id="gallery"
        className="relative min-h-screen bg-luxury-white py-32 overflow-hidden"
      >
        <div className="px-6 lg:px-16 mb-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs text-luxury-black/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              Portfolio
            </span>
            <h2 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-black leading-tight mb-4">
              Our
              <br />
              Work
            </h2>
            <div className="w-20 h-px bg-luxury-black/30" />
          </motion.div>
        </div>

        <div className="px-3 lg:px-8 max-w-[1920px] mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.2, ease: LUXURY_EASE }}
            className="grid grid-cols-2 md:grid-cols-5 gap-1.5"
          >
            {Array.from({ length: NUM_CONTAINERS }).map((_, slotIndex) => {
              // Each slot gets a unique item from the current set of 13 (cycleIndex + slotIndex) % total
              const mediaIndex = (cycleIndex + slotIndex) % TOTAL_ITEMS
              const item = GALLERY_MEDIA[mediaIndex]
              const isTall = slotIndex === 0 || slotIndex === 4

              return (
                <div
                  key={slotIndex}
                  className={`group relative overflow-hidden cursor-pointer ${
                    isTall ? 'md:row-span-2' : ''
                  }`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div
                    className={`relative overflow-hidden ${
                      isTall ? 'aspect-[2/3]' : 'aspect-[3/4]'
                    }`}
                  >
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: CROSSFADE_DURATION,
                          ease: LUXURY_EASE,
                        }}
                        className="absolute inset-0"
                      >
                        {item.type === 'video' ? (
                          <div className="absolute inset-0 w-full h-full">
                            <video
                              src={item.src}
                              muted
                              loop
                              playsInline
                              autoPlay
                              preload="metadata"
                              onLoadedMetadata={(e) => {
                                e.currentTarget.playbackRate = PLAYBACK_RATE
                              }}
                              className="absolute inset-0 min-w-full min-h-full w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        ) : (
                          <img
                            src={item.src}
                            alt={item.title}
                            loading="lazy"
                            className="block w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-luxury-white tracking-[0.2em] uppercase ultra-thin-text">
                            {item.title}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>

        <div className="px-6 lg:px-16 mt-12 flex justify-end">
          <Link
            href="/gallery"
            className="text-xs tracking-[0.2em] uppercase text-luxury-black/60 hover:text-luxury-black transition-colors ultra-thin-text"
          >
            View full gallery →
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="absolute bottom-16 right-16 hidden lg:block"
        >
          <span className="editorial-text text-[12rem] font-bold text-luxury-black/5">04</span>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedId && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-luxury-black/95 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-[90vw] h-[90vh] max-w-6xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.type === 'video' ? (
                <video
                  src={selected.src}
                  controls
                  autoPlay
                  preload="auto"
                  onLoadedMetadata={(e) => { e.currentTarget.playbackRate = PLAYBACK_RATE }}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <img
                  src={selected.src}
                  alt={selected.title}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain"
                />
              )}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 text-luxury-white text-2xl w-12 h-12 flex items-center justify-center glassmorphism-light rounded-full hover:scale-110 transition-transform"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
