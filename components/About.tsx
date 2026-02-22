'use client'

import { useInView } from 'react-intersection-observer'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen bg-luxury-white overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-16 py-32">
        {/* Editorial Layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column - Large Image */}
          <motion.div
            ref={ref}
            style={{ y: imageY }}
            className="lg:col-span-7 relative"
          >
            <div className="aspect-[4/5] relative overflow-hidden bg-luxury-black group">
              <video
                src="https://res.cloudinary.com/ddnlbizum/video/upload/v1771782827/SaveClip.App_AQMhoqdZqjI-MO0r3qXIH3ZtwrFRpTNh5eOUi9la3L41riSVmwdk9Eho3-Cu8Z04Msp768-XLIGK6JRF-Ts5Qk0e_brsgum_003760.mp4"
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-[filter] duration-700 ease-out"
              />
              {/* Large Number Overlay */}
              <div className="absolute top-8 left-8">
                <span className="editorial-text text-[8rem] font-bold text-luxury-white/10">
                  02
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Text */}
          <motion.div
            style={{ y: textY }}
            className="lg:col-span-5 flex flex-col justify-center lg:pl-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-xs text-luxury-black/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
                The Academy
              </span>
              <h2 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-black mb-8 leading-tight">
                LAW Models
                <br />
                Academy
              </h2>
              <div className="w-20 h-px bg-luxury-black/30 mb-8" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6 text-base md:text-lg text-luxury-black/70 leading-relaxed thin-text font-light"
            >
              <p>
                LAW Models Academy is a luxury training institution led by founder
                and CEO Larry Walker Ologbosere. The academy produces runway-ready
                professionals for top fashion brands including Gucci, Alexander
                McQueen, and Prada.
              </p>
              <p>
                As the official scout and catwalk instructor for ISIS Models Africa
                events, the academy&apos;s curriculum bridges craft and industry access—from
                Africa&apos;s Next Super Model to Africa International Fashion Week.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8"
            >
              <div>
                <div className="text-5xl font-bold text-luxury-black mb-2">18</div>
                <div className="text-sm text-luxury-black/60 tracking-wider uppercase">Years Experience</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-luxury-black mb-2">10</div>
                <div className="text-sm text-luxury-black/60 tracking-wider uppercase">Years with ISIS</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-luxury-black mb-2">2012</div>
                <div className="text-sm text-luxury-black/60 tracking-wider uppercase">Academy Established</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
