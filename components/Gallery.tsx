'use client'

import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'

const GALLERY_MEDIA = [
  { id: 1, type: 'video' as const, src: 'https://res.cloudinary.com/ddnlbizum/video/upload/v1771780100/SaveClip.App_AQNljMyP5oxVaAHXpU0DQ-72WUZxYShWu6cuIqypVi5raWRIwVP4bcaVJW9fxuQMGUPlpAKEAeWYq1vZp1Q4pOEY1d9E_rkAbcpyG5o_gzsgb4.mp4', title: 'Work 01' },
  { id: 2, type: 'video' as const, src: 'https://res.cloudinary.com/ddnlbizum/video/upload/v1771780100/SaveClip.App_AQMXctBNzfd9eV04cvD6c3_5zB-2DWYyuR0FFn0m6u04Ydh3n4ixECTV6scCWHfoMs3LvI50Jc9M_zyU9VcyYOvBAx2yQPc-mBzeW5g_jvfmxq.mp4', title: 'Work 02' },
  { id: 3, type: 'video' as const, src: 'https://res.cloudinary.com/ddnlbizum/video/upload/v1771780100/SaveClip.App_AQMvktA3kLr544fctJ69upJjLCWr7I-LFQnckF8QavMdkpf9VfcokzMMu1NK0TyM3Sg3a-xNhNvhaCUV9AyMFp2bVPGbhrttpjj_ybk_m1p7vg.mp4', title: 'Work 03' },
  { id: 4, type: 'video' as const, src: 'https://res.cloudinary.com/ddnlbizum/video/upload/v1771780099/SaveClip.App_AQOa0D9e540Agfx54Q1gCYl-aIXcUa0K3ENGe8BAIAWbTrO-mIM7NGZXK-IpxtWiF-y98wfz9n7n40kftVeoS79Uf6x9DGsbaLpyImw_bg4ibm.mp4', title: 'Work 04' },
  { id: 5, type: 'video' as const, src: 'https://res.cloudinary.com/ddnlbizum/video/upload/v1771780099/SaveClip.App_AQOmfg42I8mhGK4loBOKNRVeDZschoq7i_BmQsSQtLoaHLaGgcEyXGqe7i8bUCEZ8z0NlH9Qf-pO3Qc1-gHA9ldAIwy53bYWOkP3utM_prbxit.mp4', title: 'Work 05' },
  { id: 6, type: 'image' as const, src: 'https://res.cloudinary.com/ddnlbizum/image/upload/v1771780099/SaveClip.App_530208701_18496610050070306_4761805726947106081_n_g515fw.jpg', title: 'Work 06' },
  { id: 7, type: 'video' as const, src: 'https://res.cloudinary.com/ddnlbizum/video/upload/v1771771023/SaveClip.App_AQMHkQDBERUOyJzdz8rxUIgq1mHdttCrY69aVro45KEjpLI9DnuRgZ9LL6aEKMnkH_2vQYyZVuoIFypdZp9chpviASa3NsE0lN_I720_lerrqj.mp4', title: 'Work 07' },
]

const PLAYBACK_RATE = 0.65

export default function Gallery() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const selected = GALLERY_MEDIA.find((m) => m.id === selectedId)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <>
      <section
        ref={galleryRef}
        id="gallery"
        className="relative min-h-screen bg-luxury-white py-32 overflow-hidden"
      >
        <div className="px-6 lg:px-16 mb-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs text-luxury-black/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              Portfolio
            </span>
            <h2 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-black leading-tight mb-4">
              Our
              <br />
              Work
            </h2>
            <div className="w-20 h-px bg-luxury-black/30" />
          </motion.div>
        </div>

        <div className="px-6 lg:px-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {GALLERY_MEDIA.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`group relative overflow-hidden cursor-pointer ${
                  index === 0 || index === 4 ? 'md:row-span-2' : ''
                }`}
                onClick={() => setSelectedId(item.id)}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`relative overflow-hidden ${
                    index === 0 || index === 4 ? 'aspect-[2/3]' : 'aspect-[3/4]'
                  }`}
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      muted
                      loop
                      playsInline
                      autoPlay
                      onLoadedMetadata={(e) => { e.currentTarget.playbackRate = PLAYBACK_RATE }}
                      className="block w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                  ) : (
                    <motion.img
                      src={item.src}
                      alt={item.title}
                      className="block w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.8 }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-luxury-white tracking-[0.2em] uppercase ultra-thin-text">
                      {item.title}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="px-6 lg:px-16 mt-12 flex justify-end">
          <Link
            href="/gallery"
            className="text-xs tracking-[0.2em] uppercase text-luxury-black/60 hover:text-luxury-black transition-colors ultra-thin-text"
          >
            View full gallery →
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="absolute bottom-16 right-16 hidden lg:block"
        >
          <span className="editorial-text text-[12rem] font-bold text-luxury-black/5">04</span>
        </motion.div>
      </section>

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
                  onLoadedMetadata={(e) => { e.currentTarget.playbackRate = PLAYBACK_RATE }}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <img
                  src={selected.src}
                  alt={selected.title}
                  className="max-w-full max-h-full object-contain"
                />
              )}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 text-luxury-white text-2xl w-12 h-12 flex items-center justify-center glassmorphism-light rounded-full hover:scale-110 transition-transform"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
