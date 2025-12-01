'use client'

import { useInView } from 'react-intersection-observer'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

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
      {/* Video Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: videoScale }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
        </video>
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
          <span className="text-xs text-luxury-white/50 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
            Enrolment
          </span>
          <h2 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
            Begin Your
            <br />
            Journey
          </h2>
          <div className="w-24 h-px bg-luxury-white/30 mx-auto mb-12" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl text-luxury-white/70 mb-16 leading-relaxed max-w-3xl mx-auto thin-text font-light"
        >
          Join the ranks of elite models who have shaped the fashion industry.
          Your transformation starts here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
        >
          <motion.a
            href="#contact"
            className="group relative px-16 py-6 bg-luxury-white text-luxury-black tracking-[0.15em] uppercase text-sm font-medium overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Enrol Now</span>
            <motion.div
              className="absolute inset-0 bg-luxury-black"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-luxury-white z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              Enrol Now
            </span>
          </motion.a>
          <motion.a
            href="#courses"
            className="group relative px-16 py-6 border-2 border-luxury-white text-luxury-white tracking-[0.15em] uppercase text-sm font-medium overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Learn More</span>
            <motion.div
              className="absolute inset-0 bg-luxury-white"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-luxury-black z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              Learn More
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center md:text-left">
            <div>
              <p className="text-xs tracking-[0.15em] uppercase mb-3 text-luxury-white/50 ultra-thin-text">
                Email
              </p>
              <a
                href="mailto:enrol@lawmodelacademy.com"
                className="text-sm text-luxury-white hover:text-luxury-white/70 transition-colors"
              >
                enrol@lawmodelacademy.com
              </a>
            </div>
            <div>
              <p className="text-xs tracking-[0.15em] uppercase mb-3 text-luxury-white/50 ultra-thin-text">
                Phone
              </p>
              <a
                href="tel:+15551234567"
                className="text-sm text-luxury-white hover:text-luxury-white/70 transition-colors"
              >
                +1 (555) 123-4567
              </a>
            </div>
            <div>
              <p className="text-xs tracking-[0.15em] uppercase mb-3 text-luxury-white/50 ultra-thin-text">
                Location
              </p>
              <p className="text-sm text-luxury-white">
                Lagos, Nigeria
              </p>
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
