'use client'

import { useInView } from 'react-intersection-observer'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/** Same as Hero – single background video */
const HERO_VIDEO_URL =
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772467044/Untitled_design_2_hyrnxg.mp4'

export default function CTA() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative min-h-screen bg-luxury-black flex items-center justify-center overflow-hidden"
    >
      {/* Video Background – same as hero, framed on lower portion */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: videoScale }}
      >
        <video
          src={HERO_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-luxury-black/70" />
      </motion.div>

      {/* Content */}
      <motion.div
        ref={ref}
        style={{ y: textY }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
    
          <h2 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
            Apply to
            <br />
            The Academy
          </h2>
          <div className="w-24 h-px bg-luxury-white/30 mx-auto mb-12" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl text-luxury-white/70 mb-16 leading-relaxed max-w-3xl mx-auto thin-text font-light"
        >
          Submit your measurements and polaroids for review by the LAW Models
          Academy admissions team and begin your professional journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
        >
          <motion.a
            href="/apply"
            className="group relative px-16 py-6 bg-luxury-white text-luxury-black tracking-[0.15em] uppercase text-sm font-medium overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Apply Now</span>
            <motion.div
              className="absolute inset-0 bg-luxury-black"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-luxury-white z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              Apply Now
            </span>
          </motion.a>
          <motion.a
            href="/syllabus"
            className="group relative px-16 py-6 border-2 border-luxury-white text-luxury-white tracking-[0.15em] uppercase text-sm font-medium overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">View Syllabus</span>
            <motion.div
              className="absolute inset-0 bg-luxury-white"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-luxury-black z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              View Syllabus
            </span>
          </motion.a>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glassmorphism-light p-8 lg:p-12 rounded-sm max-w-4xl mx-auto"
        >
          <p className="text-sm text-luxury-white/70 mb-8 text-center thin-text">
            We have two branches: one in Lagos and one in Abuja. Click a branch or address to open in Google Maps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center md:text-left">
            <div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=MTF%206%2C%20Paradise%20Estate%20Phase%202%20Lifecamp%2C%20Abuja%2C%20Nigeria"
                target="_blank"
                rel="noreferrer"
                className="text-xs tracking-[0.15em] uppercase mb-3 text-luxury-white/50 hover:text-luxury-white ultra-thin-text block transition-colors"
              >
                Abuja Branch →
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=MTF%206%2C%20Paradise%20Estate%20Phase%202%20Lifecamp%2C%20Abuja%2C%20Nigeria"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-luxury-white/80 hover:text-luxury-white transition-colors"
              >
                MTF 6, Paradise Estate Phase 2 Lifecamp
              </a>
              <p className="text-xs text-luxury-white/50 mt-2 uppercase tracking-[0.12em] ultra-thin-text">
                Abuja Manager
              </p>
              <a
                href="tel:09039321128"
                className="text-sm text-luxury-white hover:text-luxury-white/70 transition-colors block mt-2"
              >
                09039321128
              </a>
            </div>
            <div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=2%20Otunubi%20Street%20Ogba%20Ifako%20Road%20Lagos%2C%20Nigeria"
                target="_blank"
                rel="noreferrer"
                className="text-xs tracking-[0.15em] uppercase mb-3 text-luxury-white/50 hover:text-luxury-white ultra-thin-text block transition-colors"
              >
                Lagos Branch →
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=2%20Otunubi%20Street%20Ogba%20Ifako%20Road%20Lagos%2C%20Nigeria"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-luxury-white/80 hover:text-luxury-white transition-colors"
              >
                2 Otunubi Street Ogba Ifako Road Lagos
              </a>
              <a
                href="tel:+254726960969"
                className="text-sm text-luxury-white hover:text-luxury-white/70 transition-colors block mt-2"
              >
                +254 726 960969
              </a>
            </div>
            <div>
              <p className="text-xs tracking-[0.15em] uppercase mb-3 text-luxury-white/50 ultra-thin-text">
                Email
              </p>
              <a
                href="mailto:larrywalker@healandfeed.org"
                className="text-sm text-luxury-white hover:text-luxury-white/70 transition-colors"
              >
                larrywalker@healandfeed.org
              </a>
            </div>
          </div>
        </motion.div>

        {/* Large Number */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="absolute bottom-16 right-16 hidden lg:block"
        >
          <span className="editorial-text text-[12rem] font-bold text-luxury-white/5">
            05
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
