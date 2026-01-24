'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Courses() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const courses = [
    {
      id: 1,
      title: 'The Walk',
      duration: 'Catwalk Training',
      description: 'Signature walk, stage control, posture, and runway discipline.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop',
      href: '/courses/academy-training',
    },
    {
      id: 2,
      title: 'Editorial Studio',
      duration: 'Pose & Movement',
      description: 'Editorial vs. commercial posing, expression, and camera command.',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
      href: '/courses/editorial-studio',
    },
    {
      id: 3,
      title: 'Industry Access',
      duration: 'Agency & Scouting',
      description: 'Contracts, branding, and pathways through ISIS Models Africa.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop',
      href: '/courses/industry-access',
    },
  ]

  return (
    <section
      id="courses"
      className="relative min-h-screen bg-luxury-black py-32 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 lg:px-16 mb-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
            Academy Pillars
          </span>
          <h2 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white leading-tight mb-4">
            Training
            <br />
            System
          </h2>
          <div className="w-20 h-px bg-luxury-white/30" />
        </motion.div>
      </div>

      {/* Independent Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-4 scrollbar-hidden">
        <div className="flex gap-8 px-6 lg:px-16 snap-x snap-mandatory">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex-shrink-0 w-[90vw] md:w-[60vw] lg:w-[40vw] group cursor-pointer snap-start"
            >
              <Link href={course.href} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-luxury-gray">
                  <motion.img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-luxury-white">
                    <div className="mb-4">
                      <span className="text-xs tracking-[0.2em] uppercase opacity-60 ultra-thin-text">
                        {course.duration}
                      </span>
                    </div>
                    <h3 className="editorial-text text-4xl md:text-5xl font-semibold mb-3">
                      {course.title}
                    </h3>
                    <p className="text-sm opacity-70 leading-relaxed thin-text font-light">
                      {course.description}
                    </p>
                  </div>

                  {/* Large Number */}
                  <div className="absolute top-8 right-8">
                    <span className="editorial-text text-[6rem] font-bold text-luxury-white/10">
                      {String(course.id).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="px-6 lg:px-16 mt-16">
        <div className="flex items-center gap-4 text-luxury-white/30 text-xs tracking-[0.2em] uppercase ultra-thin-text">
          <span>Scroll / Swipe →</span>
          <div className="flex-1 h-px bg-luxury-white/10" />
        </div>
      </div>
    </section>
  )
}
