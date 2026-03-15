'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function OnlinePackagePage() {
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
              Remote training
            </span>
            <h1 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
              Online Package
            </h1>
            <div className="w-20 h-px bg-luxury-white/30 mx-auto mb-8" />
            <p className="text-lg md:text-xl text-luxury-white/70 max-w-2xl mx-auto leading-relaxed thin-text font-light">
              Catwalk fundamentals and industry know-how from anywhere. Core
              modules, feedback, and pathways to agencies—all online.
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
            className="space-y-16"
          >
            <div>
              <h2 className="editorial-text text-4xl md:text-5xl font-bold text-luxury-black mb-4">
                Catwalk online
              </h2>
              <p className="text-base md:text-lg text-luxury-black/70 leading-relaxed thin-text font-light mb-6">
                Build your walk remotely with structured sessions, video
                feedback, and clear progression. You’ll cover posture, pace,
                turns, and stage presence so you’re ready for runways and
                castings.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Walk fundamentals and posture',
                  'Pace, rhythm, and transitions',
                  'Stage presence and garment presentation',
                  'Video critique and refinement',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-luxury-black rounded-full mt-2" />
                    <p className="text-sm text-luxury-black/70 leading-relaxed thin-text font-light">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-luxury-black/60 thin-text">
                For in-person runway training, see{' '}
                <Link
                  href="/courses/academy-training"
                  className="text-luxury-black underline hover:no-underline"
                >
                  Catwalk Training
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="editorial-text text-4xl md:text-5xl font-bold text-luxury-black mb-4">
                The industry
              </h2>
              <p className="text-base md:text-lg text-luxury-black/70 leading-relaxed thin-text font-light mb-6">
                Understand how the business works: contracts, agency
                expectations, branding, and how to get in front of scouts and
                castings. The online package includes industry modules so you
                know what to expect and how to prepare.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Contracts and representation basics',
                  'Agency etiquette and casting readiness',
                  'Portfolio and branding strategy',
                  'Pathways with ISIS Models Africa',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-luxury-black rounded-full mt-2" />
                    <p className="text-sm text-luxury-black/70 leading-relaxed thin-text font-light">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-luxury-black/60 thin-text">
                <Link
                  href="/courses/industry-access"
                  className="text-luxury-black underline hover:no-underline"
                >
                  Learn more about Industry Access
                </Link>
                —agency, scouting, and in-person pathways.
              </p>
            </div>

            <div className="pt-4 border-t border-luxury-black/10">
              <p className="text-base text-luxury-black/70 leading-relaxed thin-text font-light mb-6">
                Flexible schedule, core curriculum, and direct line to the
                academy. Ideal if you’re outside our main cities or prefer
                learning from home first.
              </p>
              <Link
                href="/apply"
                className="inline-block px-12 py-4 bg-luxury-black text-luxury-white editorial-text text-lg tracking-wider uppercase hover:bg-luxury-black/90 transition-colors"
              >
                Apply for online package
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
