'use client'

import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const VIDEOS = [
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739808/WhatsApp_Video_2026-02-24_at_1.09.39_PM_upgoek.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739801/WhatsApp_Video_2026-02-24_at_1.09.42_PM_hqvjab.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739801/WhatsApp_Video_2026-02-24_at_1.09.21_PM_gzdinb.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739791/WhatsApp_Video_2026-02-24_at_1.09.23_PM_aeguij.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739660/c9bce72a-a0e1-48a8-bc0d-7c22f48c0a02_o8newb.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739597/b1622b9a-ddcb-408c-9f6f-96307071ca88_zw6lus.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739587/bea21f76-3146-440f-aa0d-0ee455145b15_xhumdd.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739559/acd8b7a4-648b-42b3-9d85-f13e8ea28a52_dahzs0.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739550/97413b02-42f0-461e-bbb7-61bf56f21e26_eomsuk.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739503/6597d819-82b9-41ee-909b-82e1297bd0cc_hpkbyo.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739437/9cb55d33-81ed-4235-9a44-6b39f4826616_rt7ahf.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739385/3fc61bd8-2f74-42a5-8a12-444f41229c37_zpqlsf.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739393/c14d7b71-3a71-4fb4-91dc-82bf01add258_ly3ki1.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738661/SnapInsta.to_AQPtROaIxYpTnmrG5gYyXcZjGiD48NcP5zZDtIie26V0uuysFdGBnJ7bu5hEhOW8D3Ab4Qn01jPgTmHI48XKOcEl_ff3agd.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738660/SnapInsta.to_AQMhww-y8LGif18Ao6ryEMvqGWzBaYDilwXOc8__84NYkVizy_j0ezgqulJyp5_8S1vTeLK85LfSf10tGw38-L5C_begzog.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738658/SnapInsta.to_AQNSc5d9F5Z3SGEpc9v7bz3nWF6OYYIany9PJWVuf5oMeNINxhS__4wJpIKz58A5vfppR6ERxSllEIHBHXnGCjkoryk7SLWT3nt-AtE_ztzawj.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738658/SnapInsta.to_AQPnrJCfWMiPSwq881LXnCoSPKo7xhRO7g_Xy8oOSWbLJLa0TiheBoIJvwLk2PoN-XQ2PpdQuDsgYmfQ0fjyOV5DR0gfZT2p8Leomy0_hwykcv.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738657/SnapInsta.to_AQOPctXf60kkq_Tf_sNT4h8ftLXhq6l6gkod16-rDED2POA33-GsnzqYxOVFvJRXafVKUDTOzn7dA1Xntbr2kx5OTTY4VVVJ2QiMhHk_hdojbu.mp4',
]

const IMAGES = [
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738657/SnapInsta.to_645820956_18062292653673356_3911402741580432231_n_zlayeg.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738657/SnapInsta.to_645734039_18062292644673356_2939021230728017371_n_njrcak.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738656/SnapInsta.to_642647919_18062292662673356_3669437639800723291_n_o0yc4f.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738656/SnapInsta.to_642624091_18062292671673356_3725490651833664552_n_gqfwew.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826713/efb1df05-1261-4ce4-8df0-2884890f59f7_did6xq.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826710/e43d2372-8ffd-4d47-a99f-10e1c7190739_ojcij9.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826710/e4dc543d-4293-4ea8-988a-64e270a51427_zsbd2h.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826708/d63bc34f-7c20-4cb2-9187-098f65ad2695_n8latr.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826706/c757335e-c736-4079-adcc-123303a37e01_tawzmb.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826705/bfe23419-0336-4ed4-b736-ad3b67a33b60_k904wi.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826815/32f98bd0-58a4-485f-a4c0-a3648936f3d8_aygxyb.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826814/9bb714c2-7b1b-45bb-8b20-8de8f692ce58_ellqwd.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826817/34ccfe70-d2b0-4c76-9009-dbe2f220816c_albwd0.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826813/016bebc7-b11d-4006-8046-7e72c019c921_qbhpxx.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826817/52b8e983-1f2d-43c7-8c6a-4697b50e347b_cwwhur.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826819/058dfc59-967b-4439-a5b7-eaca98d0e81e_cven62.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826818/52d0cf5a-26af-4124-ac11-4720a65c64fa_p3vqrl.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826819/58dfd727-d9c7-4b4e-b05c-913905c540bf_lckghg.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826819/68be2ad4-5422-4471-a48a-3bede2585fe9_pmkstj.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826820/70da40da-963f-4430-adbf-091b53031c71_kzm7yz.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826820/73af7265-06cf-44a8-b899-8e57fda1350f_hmfpdl.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826703/becacaf7-9485-43b2-aa27-9fb3adc25f55_xpvwgw.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826705/c1bc26d8-a1f1-4f7c-92d8-eff597844e03_tokmfw.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826702/822461b8-cd4d-44ac-bbb5-de27b66add08_yogqkf.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826702/badaaf11-d001-4aac-ba53-425bb1595991_bwyzcr.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826700/b687851c-7f07-4e2d-b29f-48421989f20d_uw2x07.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826702/53679a66-ec30-49ad-8ac9-c835244858e5_ibfdys.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826698/8745d5fa-25ce-472e-aa9a-23a1a318a0be_juidkh.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826698/6679fe4a-dbf2-4506-ab10-46c99255e90b_qchkl5.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826699/58875f7d-7b0c-4b04-bdf8-c9c0589442f5_omw88f.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826696/98765580-80ef-4cec-b16a-7783e5af1e6f_dkwbkw.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826694/542f5c39-11eb-481e-9120-384f3ae98f71_wijas4.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826693/07097389-aa79-4b05-b00d-c96c8f2c20ee_z8tdsp.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738656/SnapInsta.to_640315642_18061240670673356_3079675055752799357_n_zlhkmp.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738656/SnapInsta.to_514434667_18033987794673356_5170088275445025950_n_slw4up.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738656/SnapInsta.to_620483202_18057619997673356_2630186142050548869_n_aw5urt.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1771771028/SaveClip.App_618135322_18098988136893332_3370589530317688738_n_ebtook.webp',
]

// Build a single list of media so each slot gets a unique item (no duplicates in view)
const GALLERY_MEDIA: { id: number; type: 'video' | 'image'; src: string; title: string }[] = [
  ...VIDEOS.map((src, i) => ({ id: i + 1, type: 'video' as const, src, title: `Work ${String(i + 1).padStart(2, '0')}` })),
  ...IMAGES.map((src, i) => ({ id: VIDEOS.length + i + 1, type: 'image' as const, src, title: `Work ${String(VIDEOS.length + i + 1).padStart(2, '0')}` })),
]

const PLAYBACK_RATE = 0.65
const NUM_CONTAINERS = 13
const ROTATION_INTERVAL_MS = 9000
const TOTAL_ITEMS = GALLERY_MEDIA.length
// Each rotation steps by 13 so every slot gets a new set of items (no +1 shuffle)
const ROTATION_STEP = NUM_CONTAINERS

// Smooth, luxury transition: long crossfade, no bounce
const LUXURY_EASE = [0.22, 0.61, 0.36, 1]
const CROSSFADE_DURATION = 1

export default function Gallery() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [cycleIndex, setCycleIndex] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)

  const selected = GALLERY_MEDIA.find((m) => m.id === selectedId)

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + ROTATION_STEP) % TOTAL_ITEMS)
    }, ROTATION_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

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
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.2, ease: LUXURY_EASE }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6"
          >
            {Array.from({ length: NUM_CONTAINERS }).map((_, slotIndex) => {
              // Each slot gets a unique item from the current set of 13 (cycleIndex + slotIndex) % total
              const mediaIndex = (cycleIndex + slotIndex) % TOTAL_ITEMS
              const item = GALLERY_MEDIA[mediaIndex]
              const isTall = slotIndex === 0 || slotIndex === 4

              return (
                <div
                  key={slotIndex}
                  className={`group relative overflow-hidden cursor-pointer ${
                    isTall ? 'md:row-span-2' : ''
                  }`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div
                    className={`relative overflow-hidden ${
                      isTall ? 'aspect-[2/3]' : 'aspect-[3/4]'
                    }`}
                  >
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: CROSSFADE_DURATION,
                          ease: LUXURY_EASE,
                        }}
                        className="absolute inset-0"
                      >
                        {item.type === 'video' ? (
                          <div className="absolute inset-0 w-full h-full">
                            <video
                              src={item.src}
                              muted
                              loop
                              playsInline
                              autoPlay
                              onLoadedMetadata={(e) => {
                                e.currentTarget.playbackRate = PLAYBACK_RATE
                              }}
                              className="absolute inset-0 min-w-full min-h-full w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        ) : (
                          <img
                            src={item.src}
                            alt={item.title}
                            className="block w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-luxury-white tracking-[0.2em] uppercase ultra-thin-text">
                            {item.title}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
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
