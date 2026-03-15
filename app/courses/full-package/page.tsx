'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { VIDEOS } from '@/lib/gallery-data'
import { useBackgroundVideoCycle } from '@/lib/useBackgroundVideoCycle'

const FADE_DURATION = 0.25

const PACKAGE_MODULES = [
  {
    title: 'Catwalk Training',
    href: '/courses/academy-training',
    items: [
      'Signature walk and runway discipline',
      'Posture, pace, and stage presence',
      'Garment presentation and turns',
    ],
  },
  {
    title: 'Polaroid & Editorial',
    href: '/courses/editorial-studio',
    items: [
      'Portfolio and polaroid development',
      'Editorial posing and expression',
      'Camera command and styling awareness',
    ],
  },
  {
    title: 'Industry Access',
    href: '/courses/industry-access',
    items: [
      'Contracts and agency pathways',
      'Branding and casting readiness',
      'Scouting with ISIS Models Africa',
    ],
  },
]

export default function FullPackagePage() {
  const [currentVideo, setCurrentVideo] = useState(getRandomVideo)
  const [transitioning, setTransitioning] = useState(false)
  const maxDurationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const playNextRandom = useCallback(() => {
    if (maxDurationTimeoutRef.current) {
      clearTimeout(maxDurationTimeoutRef.current)
      maxDurationTimeoutRef.current = null
    }
    setTransitioning(true)
    const t1 = setTimeout(() => {
      setCurrentVideo(getRandomVideo())
      const t2 = setTimeout(() => setTransitioning(false), (FADE_DURATION + 0.15) * 1000)
      return () => clearTimeout(t2)
    }, FADE_DURATION * 1000)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => () => {
    if (maxDurationTimeoutRef.current) clearTimeout(maxDurationTimeoutRef.current)
  }, [])

  return (
    <main className="relative">
      <Navigation />
      <WhatsAppButton />

      <section className="relative min-h-[70vh] bg-luxury-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            key={currentVideo}
            src={currentVideo}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onEnded={playNextRandom}
            onPlay={onVideoPlay}
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-luxury-black/60 pointer-events-none" />
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none z-[1]"
            animate={{ opacity: transitioning ? 1 : 0 }}
            transition={{ duration: FADE_DURATION, ease: 'easeInOut' }}
          />
        </div>

        <div className="container mx-auto px-6 lg:px-16 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              Complete programme
            </span>
            <h1 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
              Full Package
            </h1>
            <div className="w-20 h-px bg-luxury-white/30 mx-auto mb-8" />
            <p className="text-lg md:text-xl text-luxury-white/70 max-w-2xl mx-auto leading-relaxed thin-text font-light">
              Catwalk, polaroid development, and industry access in one programme.
              Full model readiness for Africa and beyond.
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
            className="space-y-12"
          >
            <div>
              <h2 className="editorial-text text-4xl md:text-5xl font-bold text-luxury-black mb-4">
                What’s included
              </h2>
              <p className="text-base md:text-lg text-luxury-black/70 leading-relaxed thin-text font-light">
                The full package combines all three academy pillars: runway
                training, portfolio and editorial development, and pathways into
                the industry. One programme for end-to-end readiness.
              </p>
            </div>

            <div className="space-y-10">
              {PACKAGE_MODULES.map((mod) => (
                <div
                  key={mod.title}
                  className="border-b border-luxury-black/10 pb-8 last:border-0 last:pb-0"
                >
                  <Link
                    href={mod.href}
                    className="group block mb-4"
                  >
                    <h3 className="editorial-text text-2xl md:text-3xl font-bold text-luxury-black group-hover:text-luxury-black/80 transition-colors">
                      {mod.title}
                    </h3>
                  </Link>
                  <ul className="space-y-2">
                    {mod.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3"
                      >
                        <div className="w-1 h-1 bg-luxury-black rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-luxury-black/70 leading-relaxed thin-text font-light">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              <h2 className="editorial-text text-3xl md:text-4xl font-bold text-luxury-black mb-4">
                Why the full package
              </h2>
              <p className="text-base md:text-lg text-luxury-black/70 leading-relaxed thin-text font-light mb-6">
                Ideal if you want a single, coherent path from training to
                industry. You get runway skills, a strong book, and clear
                pathways to agencies and castings—all under one roof.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Unified curriculum and progression',
                  'Portfolio built alongside walk training',
                  'Direct link to agency and scouting',
                  'One enrolment, full academy access',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1 h-1 bg-luxury-black rounded-full mt-2" />
                    <p className="text-sm text-luxury-black/70 leading-relaxed thin-text font-light">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Link
                  href="/apply"
                  className="inline-block w-full sm:w-auto text-center px-12 py-4 bg-luxury-black text-luxury-white editorial-text text-lg tracking-wider uppercase hover:bg-luxury-black/90 transition-colors"
                >
                  Apply for full package
                </Link>
                <Link
                  href="/courses"
                  className="text-sm text-luxury-black/60 hover:text-luxury-black tracking-[0.1em] uppercase thin-text transition-colors"
                >
                  View individual programmes →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
