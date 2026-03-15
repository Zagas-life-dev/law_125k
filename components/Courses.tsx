'use client'

import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { IMAGES as GALLERY_IMAGES } from '@/lib/gallery-data'

const CATWALK_VIDEOS = [
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738658/SnapInsta.to_AQPnrJCfWMiPSwq881LXnCoSPKo7xhRO7g_Xy8oOSWbLJLa0TiheBoIJvwLk2PoN-XQ2PpdQuDsgYmfQ0fjyOV5DR0gfZT2p8Leomy0_hwykcv.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739597/b1622b9a-ddcb-408c-9f6f-96307071ca88_zw6lus.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738660/SnapInsta.to_AQMhww-y8LGif18Ao6ryEMvqGWzBaYDilwXOc8__84NYkVizy_j0ezgqulJyp5_8S1vTeLK85LfSf10tGw38-L5C_begzog.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738658/SnapInsta.to_AQNSc5d9F5Z3SGEpc9v7bz3nWF6OYYIany9PJWVuf5oMeNINxhS__4wJpIKz58A5vfppR6ERxSllEIHBHXnGCjkoryk7SLWT3nt-AtE_ztzawj.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739402/5bccecbb-77e8-4cc3-bd27-427fddf3c94a_lwqpxf.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739476/87d31cbd-17f7-4467-8570-4495fcf7ec96_qycbwh.mov',
  // 'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739660/c9bce72a-a0e1-48a8-bc0d-7c22f48c0a02_o8newb.mov',
  // 'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739501/9f0cba07-5ac6-4027-aa8e-07794cb4a63f_qpcrpo.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739808/WhatsApp_Video_2026-02-24_at_1.09.39_PM_upgoek.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739791/WhatsApp_Video_2026-02-24_at_1.09.23_PM_aeguij.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739397/1ded101b-2f9f-4cca-9aba-01b02026e545_xi6c4i.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739597/b1622b9a-ddcb-408c-9f6f-96307071ca88_zw6lus.mov',
]

/** Polaroid + Catwalk (combined course) videos */
const POLAROID_CATWALK_VIDEOS = [
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739587/bea21f76-3146-440f-aa0d-0ee455145b15_xhumdd.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738661/SnapInsta.to_AQPtROaIxYpTnmrG5gYyXcZjGiD48NcP5zZDtIie26V0uuysFdGBnJ7bu5hEhOW8D3Ab4Qn01jPgTmHI48XKOcEl_ff3agd.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738657/SnapInsta.to_AQOPctXf60kkq_Tf_sNT4h8ftLXhq6l6gkod16-rDED2POA33-GsnzqYxOVFvJRXafVKUDTOzn7dA1Xntbr2kx5OTTY4VVVJ2QiMhHk_hdojbu.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739437/9cb55d33-81ed-4235-9a44-6b39f4826616_rt7ahf.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739393/c14d7b71-3a71-4fb4-91dc-82bf01add258_ly3ki1.mov',
]

/** Videos that should start at 6 seconds instead of 0 — use Cloudinary so_6 so they play from 6s */
const VIDEOS_START_AT_6_SEC = [
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739501/9f0cba07-5ac6-4027-aa8e-07794cb4a63f_qpcrpo.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739660/c9bce72a-a0e1-48a8-bc0d-7c22f48c0a02_o8newb.mov',
]

function getVideoSrc(url: string): string {
  if (VIDEOS_START_AT_6_SEC.some((u) => url.includes(u) || u.includes(url)))
    return url.replace('/upload/', '/upload/so_6/')
  return url
}

export default function Courses() {
  const [editorialIndex, setEditorialIndex] = useState(0)
  const [catwalkIndex, setCatwalkIndex] = useState(0)
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    const t = setInterval(() => {
      setEditorialIndex((i) => (i + 1) % GALLERY_IMAGES.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setCatwalkIndex((i) => (i + 1) % CATWALK_VIDEOS.length)
    }, 7000)
    return () => clearInterval(t)
  }, [])

  const courses = [
    {
      id: 1,
      title: 'Catwalk Only',
      duration: 'Runway & stage',
      description: 'Focused runway and catwalk training. Signature walk, posture, stage presence, and garment presentation.',
      videos: CATWALK_VIDEOS,
      href: '/courses/academy-training',
    },
    {
      id: 2,
      title: 'Polaroid Development',
      duration: 'Portfolio & scouting',
      description: 'Portfolio and polaroid development for scouting and castings. Build a professional presentation for agencies.',
      image: GALLERY_IMAGES[0],
      images: GALLERY_IMAGES,
      href: '/courses/editorial-studio',
    },
    {
      id: 3,
      title: 'Catwalk + Polaroid Development',
      duration: 'Full package',
      description: 'Full package: catwalk training and polaroid development combined for complete model readiness.',
      videos: POLAROID_CATWALK_VIDEOS,
      href: '/courses/full-package',
    },
    {
      id: 4,
      title: 'Online Classes',
      duration: 'Remote training',
      description: 'Flexible remote training. Catwalk and industry modules from anywhere.',
      image: 'https://res.cloudinary.com/ddnlbizum/image/upload/v1771779408/SaveClip.App_588120983_18327847240241700_8401602696163300717_n_xspmfl.jpg',
      href: '/courses/online-package',
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
                  {'videos' in course && Array.isArray(course.videos) && course.videos.length > 0 ? (
                    <div className="absolute inset-0">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.video
                          key={catwalkIndex}
                          src={getVideoSrc(course.videos[catwalkIndex % course.videos.length])}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          whileHover={{ scale: 1.1 }}
                        />
                      </AnimatePresence>
                    </div>
                  ) : 'video' in course && typeof course.video === 'string' ? (
                    <motion.video
                      src={course.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
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
                          loading="lazy"
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
                      loading="lazy"
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
