'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const EDITORIAL_GALLERY_MEDIA = [
  {
    type: 'video' as const,
    src: 'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739393/c14d7b71-3a71-4fb4-91dc-82bf01add258_ly3ki1.mov',
  },
  {
    type: 'video' as const,
    src: 'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738661/SnapInsta.to_AQPtROaIxYpTnmrG5gYyXcZjGiD48NcP5zZDtIie26V0uuysFdGBnJ7bu5hEhOW8D3Ab4Qn01jPgTmHI48XKOcEl_ff3agd.mp4',
  },
  {
    type: 'video' as const,
    src: 'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738657/SnapInsta.to_AQOPctXf60kkq_Tf_sNT4h8ftLXhq6l6gkod16-rDED2POA33-GsnzqYxOVFvJRXafVKUDTOzn7dA1Xntbr2kx5OTTY4VVVJ2QiMhHk_hdojbu.mp4',
  },
  {
    type: 'image' as const,
    src: 'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738657/SnapInsta.to_645820956_18062292653673356_3911402741580432231_n_zlayeg.jpg',
  },
  {
    type: 'image' as const,
    src: 'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738656/SnapInsta.to_642624091_18062292671673356_3725490651833664552_n_gqfwew.jpg',
  },
]

export default function EditorialStudioPage() {
  return (
    <main className="relative">
      <Navigation />
      <WhatsAppButton />

      <section className="relative min-h-[70vh] bg-luxury-black flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              Editorial Studio
            </span>
            <h1 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
              Pose & Movement
            </h1>
            <div className="w-20 h-px bg-luxury-white/30 mx-auto mb-8" />
            <p className="text-lg md:text-xl text-luxury-white/70 max-w-2xl mx-auto leading-relaxed thin-text font-light">
              Editorial vs. commercial posing, expression, and camera command.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-luxury-white py-32">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <h2 className="editorial-text text-4xl md:text-5xl font-bold text-luxury-black mb-4">
                The Pose
              </h2>
              <p className="text-base md:text-lg text-luxury-black/70 leading-relaxed thin-text font-light">
                Develop editorial range, expressive control, and commercial clarity.
                Learn to collaborate with photographers and adapt to briefs across
                fashion campaigns.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Editorial posing and silhouette',
                'Commercial movement and energy',
                'Facial expression and eye control',
                'Styling awareness and angles',
                'Camera direction and feedback',
                'Portfolio-ready sequences',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 border-b border-luxury-black/10 pb-4">
                  <div className="w-1 h-1 bg-luxury-black rounded-full mt-2" />
                  <p className="text-sm text-luxury-black/70 leading-relaxed thin-text font-light">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-luxury-white pb-32">
        <div className="container mx-auto px-6 lg:px-16 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="editorial-text text-3xl md:text-4xl font-bold text-luxury-black">
                Editorial Gallery
              </h2>
              <span className="text-xs tracking-[0.2em] uppercase text-luxury-black/50 ultra-thin-text">
                Behind the frames
              </span>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {EDITORIAL_GALLERY_MEDIA.map((item) => (
                <div
                  key={item.src}
                  className="relative aspect-[3/4] overflow-hidden bg-luxury-black"
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt="Editorial studio"
                      className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  )}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-luxury-black/40 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
