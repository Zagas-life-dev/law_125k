'use client'

import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const EDITORIAL_IMAGES = [
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1771771028/SaveClip.App_610542066_18097662157893332_8979088537474099440_n_mscs8n.webp',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1771771027/SaveClip.App_609552397_18097662214893332_4789506225843562602_n_rlaeqb.webp',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1771771027/SaveClip.App_610702440_18097662223893332_6033236831334538591_n_la0iem.webp',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1771771026/SaveClip.App_609549373_18097662244893332_4430383863596991914_n_qercbi.webp',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1771771026/SaveClip.App_609175735_18097662253893332_8146461371284243094_n_ozlh8w.webp',
]

export default function Courses() {
  const [editorialIndex, setEditorialIndex] = useState(0)
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    const t = setInterval(() => {
      setEditorialIndex((i) => (i + 1) % EDITORIAL_IMAGES.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const courses = [
    {
      id: 1,
      title: 'Catwalk Only',
      duration: 'Runway & stage',
      description: 'Focused runway and catwalk training. Signature walk, posture, stage presence, and garment presentation.',
      video: 'https://res.cloudinary.com/ddnlbizum/video/upload/v1771774448/SaveClip.App_AQMypVJ_NRsuoPxx9rf40hicu-swQmYMmfx_XU8iUBCj8zSbyUvgujHnuf-4QW3Sd923mknVFJiuqRtZbImvbfUU51F62aGCGL03aBo_bprbss_abdc51.mp4',
      href: '/courses/academy-training',
    },
    {
      id: 2,
      title: 'Polaroid Development',
      duration: 'Portfolio & scouting',
      description: 'Portfolio and polaroid development for scouting and castings. Build a professional presentation for agencies.',
      image: EDITORIAL_IMAGES[0],
      images: EDITORIAL_IMAGES,
      href: '/courses/editorial-studio',
    },
    {
      id: 3,
      title: 'Catwalk + Polaroid Development',
      duration: 'Full package',
      description: 'Full package: catwalk training and polaroid development combined for complete model readiness.',
      video: 'https://res.cloudinary.com/ddnlbizum/video/upload/v1771779018/SaveClip.App_AQOuWkKbKn1uRvCuu4B2setEg0SBCr_RBKwiItfJ8U9DGRZsSHn2vBg4GbfWEzZ6jw89tM4ISDP9xFzdCooJr-h962qL4vc-qXzKD2c_nw4kd7_70ff3b.mp4',
      href: '/apply',
    },
    {
      id: 4,
      title: 'Online Classes',
      duration: 'Remote training',
      description: 'Flexible remote training. Access core modules and feedback from anywhere.',
      image: 'https://res.cloudinary.com/ddnlbizum/image/upload/v1771779408/SaveClip.App_588120983_18327847240241700_8401602696163300717_n_xspmfl.jpg',
      href: '/apply',
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
                  {'video' in course && course.video ? (
                    <motion.video
                      src={course.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                    />
                  ) : 'images' in course && Array.isArray(course.images) && course.images.length > 0 ? (
                    <div className="absolute inset-0">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.img
                          key={editorialIndex}
                          src={course.images[editorialIndex % course.images.length]}
                          alt={course.title}
                          className="absolute inset-0 w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          whileHover={{ scale: 1.1 }}
                        />
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                    />
                  )}
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

      {/* Scroll Indicator + Programs link */}
      <div className="px-6 lg:px-16 mt-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 text-luxury-white/30 text-xs tracking-[0.2em] uppercase ultra-thin-text">
            <span>Scroll / Swipe →</span>
            <div className="flex-1 h-px bg-luxury-white/10" />
          </div>
          <Link
            href="/courses"
            className="text-xs tracking-[0.2em] uppercase text-luxury-white/60 hover:text-luxury-white transition-colors ultra-thin-text"
          >
            View all programs & pricing →
          </Link>
        </div>
      </div>
    </section>
  )
}
