'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { EDITORIAL_VIDEOS, EDITORIAL_MEDIA } from '@/lib/gallery-data'
import { useBackgroundVideoCycle } from '@/lib/useBackgroundVideoCycle'

const FADE_DURATION = 0.25

export default function EditorialStudioPage() {
  const { currentVideo, transitioning, playNextRandom, onVideoPlay } = useBackgroundVideoCycle(EDITORIAL_VIDEOS)

  return (
    <main className="relative">
      <Navigation />
      <WhatsAppButton />

      <section className="relative min-h-[70vh] bg-luxury-black flex items-center justify-center overflow-hidden">
        {/* Background: random editorial videos */}
        <div className="absolute inset-0 z-0">
          <video
            key={currentVideo}
            src={currentVideo}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onEnded={playNextRandom}
            onPlay={onVideoPlay}
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-luxury-black/60 pointer-events-none" />
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none z-[1]"
            animate={{ opacity: transitioning ? 1 : 0 }}
            transition={{ duration: FADE_DURATION, ease: 'easeInOut' }}
          />
        </div>

        <div className="container mx-auto px-6 lg:px-16 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              Editorial Studio
            </span>
            <h1 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
              Pose & Movement
            </h1>
            <div className="w-20 h-px bg-luxury-white/30 mx-auto mb-8" />
            <p className="text-lg md:text-xl text-luxury-white/70 max-w-2xl mx-auto leading-relaxed thin-text font-light">
              Editorial vs. commercial posing, expression, and camera command.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-luxury-white py-32">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <h2 className="editorial-text text-4xl md:text-5xl font-bold text-luxury-black mb-4">
                The Pose
              </h2>
              <p className="text-base md:text-lg text-luxury-black/70 leading-relaxed thin-text font-light">
                Develop editorial range, expressive control, and commercial clarity.
                Learn to collaborate with photographers and adapt to briefs across
                fashion campaigns.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Editorial posing and silhouette',
                'Commercial movement and energy',
                'Facial expression and eye control',
                'Styling awareness and angles',
                'Camera direction and feedback',
                'Portfolio-ready sequences',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 border-b border-luxury-black/10 pb-4">
                  <div className="w-1 h-1 bg-luxury-black rounded-full mt-2" />
                  <p className="text-sm text-luxury-black/70 leading-relaxed thin-text font-light">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-luxury-white pb-32">
        <div className="container mx-auto px-6 lg:px-16 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="editorial-text text-3xl md:text-4xl font-bold text-luxury-black">
                Editorial Gallery
              </h2>
              <span className="text-xs tracking-[0.2em] uppercase text-luxury-black/50 ultra-thin-text">
                Behind the frames
              </span>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {EDITORIAL_MEDIA.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-[3/4] overflow-hidden bg-luxury-black"
                >
                  <video
                    src={item.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-luxury-black/40 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
