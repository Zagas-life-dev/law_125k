'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { HERO_MEDIA } from '@/lib/gallery-data'
import { useBackgroundVideoCycle } from '@/lib/useBackgroundVideoCycle'

const FADE_DURATION = 0.25

const HERO_VIDEO_URLS = HERO_MEDIA.map((m) => m.src)

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentVideo, transitioning, playNextRandom, onVideoPlay } = useBackgroundVideoCycle(HERO_VIDEO_URLS)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const videoScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.45])
  const videoOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -200])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Video Background - catwalk videos from gallery-data */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: videoScale, opacity: videoOpacity }}
      >
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
        <div className="absolute inset-0 bg-luxury-black/50 pointer-events-none" />
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none z-[1]"
          animate={{ opacity: transitioning ? 1 : 0 }}
          transition={{ duration: FADE_DURATION, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Asymmetric Layout */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full px-6 lg:px-16">
          <motion.div
            style={{ y: textY }}
            className="max-w-7xl mx-auto"
          >
            {/* Huge Overlapping Title */}
            <div className="relative">
              <motion.h1
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="editorial-text text-[10rem] md:text-[18rem] lg:text-[24rem] font-bold text-luxury-white leading-none tracking-tighter"
                style={{
                  textShadow: '0 0 100px rgba(0, 0, 0, 0.8)',
                  WebkitTextStroke: '2px rgba(255, 255, 255, 0.1)',
                }}
              >
                LAW
              </motion.h1>
              
              {/* Overlapping Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute -bottom-8 md:-bottom-16 left-0 flex items-center gap-4 md:gap-6 lg:gap-8"
              >
                <h2 className="text-4xl md:text-6xl lg:text-8xl text-luxury-white/90 font-thin tracking-[0.3em] uppercase thin-text">
                  MODEL
                </h2>
                <h2 className="text-4xl md:text-6xl lg:text-8xl text-luxury-white/90 font-thin tracking-[0.3em] uppercase thin-text">
                  ACADEMY
                </h2>
              </motion.div>
            </div>

            {/* Right Side Content */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-16 md:mt-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
            >
              <div className="max-w-md">
                <p className="text-lg md:text-xl text-luxury-white/70 leading-relaxed mb-6 thin-text font-light">
                  LAW Model Academy is a high-fashion training institution founded
                  by Larry Walker Ologbosere (CEO). We develop elite talent for
                  Africa’s premier runways and global fashion houses.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-px bg-luxury-white/40" />
                  <span className="text-xs text-luxury-white/50 tracking-[0.2em] uppercase ultra-thin-text">
                    Nigeria · Africa · Global
                  </span>
                </div>
              </div>

              {/* Large Number */}
              <div className="text-right">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                  className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold text-luxury-white/20 leading-none"
                >
                  01
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Right Corner Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 md:bottom-16 md:right-16 z-10"
      >
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-luxury-white/40 tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-12 bg-luxury-white/50"
          />
        </div>
      </motion.div>
    </section>
  )
}
