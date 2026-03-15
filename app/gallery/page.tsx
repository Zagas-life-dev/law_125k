'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Link from 'next/link'
import { GALLERY_MEDIA } from '@/lib/gallery-data'

const PLAYBACK_RATE = 0.65

export default function GalleryPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = GALLERY_MEDIA.find((m) => m.id === selectedId)

  return (
    <main className="relative min-h-screen bg-luxury-black">
      <Navigation />
      <WhatsAppButton />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-3 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-[1920px] mx-auto"
        >
          <Link
            href="/#gallery"
            className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text hover:text-luxury-white/70 transition-colors inline-block mb-6"
          >
            ← Portfolio
          </Link>
          <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
            Gallery
          </span>
          <h1 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white leading-tight">
            Our Work
          </h1>
          <div className="w-20 h-px bg-luxury-white/30 mt-6" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 max-w-[1920px] mx-auto"
        >
          {GALLERY_MEDIA.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
                },
              }}
              className="group relative overflow-hidden cursor-pointer rounded-sm aspect-[3/4]"
              onClick={() => setSelectedId(item.id)}
            >
              <div className="absolute inset-0">
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
                    className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-xs text-luxury-white tracking-[0.2em] uppercase ultra-thin-text">
                    {item.title}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />

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
                  onLoadedMetadata={(e) => {
                    e.currentTarget.playbackRate = PLAYBACK_RATE
                  }}
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
                className="absolute top-4 right-4 text-luxury-white text-2xl w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
