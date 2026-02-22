'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
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

const PLAYBACK_RATE = 0.75

export default function GalleryPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = GALLERY_MEDIA.find((m) => m.id === selectedId)

  return (
    <main className="relative min-h-screen bg-luxury-black">
      <Navigation />
      <WhatsAppButton />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <Link
            href="/#gallery"
            className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text hover:text-luxury-white/70 transition-colors inline-block mb-6"
          >
            ← Portfolio
          </Link>
          <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
            Gallery
          </span>
          <h1 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white leading-tight">
            Our Work
          </h1>
          <div className="w-20 h-px bg-luxury-white/30 mt-6" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto"
        >
          {GALLERY_MEDIA.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, scale: 0.96 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="group relative overflow-hidden cursor-pointer rounded-sm aspect-[3/4]"
              onClick={() => setSelectedId(item.id)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0">
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    onLoadedMetadata={(e) => { e.currentTarget.playbackRate = PLAYBACK_RATE }}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-luxury-white tracking-[0.2em] uppercase ultra-thin-text">
                    {item.title}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />

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
                className="absolute top-4 right-4 text-luxury-white text-2xl w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
