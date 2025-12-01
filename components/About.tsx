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
            <div className="aspect-[4/5] relative overflow-hidden bg-luxury-black">
              <motion.img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=1500&fit=crop"
                alt="About"
                className="w-full h-full object-cover grayscale"
                initial={{ scale: 1.2 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
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
                About
              </span>
              <h2 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-black mb-8 leading-tight">
                The
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
                Larry Walker Model Academy stands as a beacon of excellence in the
                fashion industry, cultivating the next generation of models with
                uncompromising standards and artistic vision.
              </p>
              <p>
                Our curriculum combines traditional modeling fundamentals with
                contemporary industry insights, ensuring our graduates are
                well-equipped for the global fashion stage.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 grid grid-cols-2 gap-8"
            >
              <div>
                <div className="text-5xl font-bold text-luxury-black mb-2">13+</div>
                <div className="text-sm text-luxury-black/60 tracking-wider uppercase">Years</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-luxury-black mb-2">500+</div>
                <div className="text-sm text-luxury-black/60 tracking-wider uppercase">Graduates</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
