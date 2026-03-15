'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const BRANCHES = [
  { id: 'abuja' as const, label: 'Abuja', whatsapp: '2349039321128' },
  { id: 'lagos' as const, label: 'Lagos', whatsapp: '254726960969' },
]

const programs = [
  {
    number: '01',
    title: 'Catwalk Only',
    description: 'Focused runway and catwalk training. Signature walk, posture, stage presence, and garment presentation.',
    price: 50000,
    href: '/courses/academy-training',
  },
  {
    number: '02',
    title: 'Polaroid Development',
    description: 'Portfolio and polaroid development for scouting and castings. Build a professional presentation for agencies.',
    price: 80000,
    href: '/courses/editorial-studio',
  },
  {
    number: '03',
    title: 'Catwalk + Polaroid Development',
    description: 'Full package: catwalk training and polaroid development combined for complete model readiness.',
    price: 130000,
    note: '50K + 80K',
    href: '/courses/full-package',
  },
  {
    number: '04',
    title: 'Online Classes',
    description: 'Flexible remote training. Catwalk and industry modules from anywhere.',
    price: 70000,
    href: '/courses/online-package',
  },
]

function formatNaira (n: number) {
  return `₦${(n / 1000).toFixed(0)}K`
}

function formatNairaFull (n: number) {
  return `₦${n.toLocaleString()}`
}

function whatsAppPayUrl (
  program: { title: string; price: number },
  branch: typeof BRANCHES[number]
) {
  const branchLabel = branch.label
  const text = encodeURIComponent(
    `Hi, I'm interested in the ${branchLabel} branch. I would like to make payment for: ${program.title} (${formatNairaFull(program.price)}). Please guide me through the process.`
  )
  return `https://wa.me/${branch.whatsapp}?text=${text}`
}

function whatsAppGeneralPayUrl (branch: typeof BRANCHES[number]) {
  const text = encodeURIComponent(
    `Hi, I'm interested in the ${branch.label} branch. I would like to make payment for a LAW Model Academy program. Please guide me through the process.`
  )
  return `https://wa.me/${branch.whatsapp}?text=${text}`
}

export default function CoursesPage() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [branch, setBranch] = useState<typeof BRANCHES[number]>(BRANCHES[0])

  return (
    <main className="relative">
      <Navigation />
      <WhatsAppButton />

      {/* Hero */}
      <section className="relative min-h-[70vh] bg-luxury-black flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              Programs
            </span>
            <h1 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
              Academy
              <br />
              Courses
            </h1>
            <div className="w-20 h-px bg-luxury-white/30 mx-auto mb-8" />
            <p className="text-lg md:text-xl text-luxury-white/70 max-w-2xl mx-auto leading-relaxed thin-text font-light">
              Choose the program that fits your goals. All prices in NGN.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Registration fee notice */}
      <section className="relative bg-luxury-white py-8 border-b border-luxury-black/10">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left"
          >
            <span className="text-xs tracking-[0.2em] uppercase text-luxury-black/50 ultra-thin-text">
              One-time registration fee
            </span>
            <span className="editorial-text text-2xl md:text-3xl font-bold text-luxury-black">
              ₦25,000
            </span>
            <span className="text-sm text-luxury-black/60 thin-text font-light">
              (applies to all programs)
            </span>
          </motion.div>
          {/* Branch selector */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4 mt-10"
          >
            <span className="text-xs tracking-[0.2em] uppercase text-luxury-black/50 ultra-thin-text">
              Select your branch for payment
            </span>
            <div className="flex items-center gap-2 p-1 border border-luxury-black/10 rounded-sm">
              {BRANCHES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBranch(b)}
                  className={`px-6 py-2.5 text-xs tracking-[0.2em] uppercase transition-colors ultra-thin-text ${
                    branch.id === b.id
                      ? 'bg-luxury-black text-luxury-white'
                      : 'text-luxury-black/60 hover:text-luxury-black hover:bg-luxury-black/5'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs grid */}
      <section ref={ref} className="relative bg-luxury-white py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {programs.map((program, index) => (
              <motion.div
                key={program.number}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="group border border-luxury-black/10 hover:border-luxury-black/20 transition-colors overflow-hidden"
              >
                <div className="p-8 lg:p-10 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-6 mb-6">
                    <span className="editorial-text text-6xl md:text-7xl font-bold text-luxury-black/10 group-hover:text-luxury-black/20 transition-colors">
                      {program.number}
                    </span>
                    <div className="text-right">
                      <div className="editorial-text text-3xl md:text-4xl font-bold text-luxury-black">
                        {formatNaira(program.price)}
                      </div>
                      {program.note && (
                        <div className="text-xs text-luxury-black/50 tracking-wider uppercase mt-1 ultra-thin-text">
                          {program.note}
                        </div>
                      )}
                    </div>
                  </div>
                  <h2 className="editorial-text text-2xl md:text-3xl font-bold text-luxury-black mb-4">
                    {program.title}
                  </h2>
                  <p className="text-base text-luxury-black/70 leading-relaxed thin-text font-light mb-8 flex-1">
                    {program.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-6">
                    <a
                      href={whatsAppPayUrl(program, branch)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-luxury-black text-luxury-white text-xs tracking-[0.2em] uppercase hover:bg-luxury-black/90 transition-colors ultra-thin-text"
                    >
                      Make payment
                      <span aria-hidden>→</span>
                    </a>
                    <Link
                      href={program.href}
                      className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-luxury-black/70 hover:text-luxury-black transition-colors ultra-thin-text"
                    >
                      {program.href === '/apply' ? 'Apply for this program' : 'View details'}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-luxury-black py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="editorial-text text-4xl md:text-5xl font-bold text-luxury-white mb-6 leading-tight">
              Ready to enrol?
            </h2>
            <div className="w-20 h-px bg-luxury-white/30 mx-auto mb-6" />
            <p className="text-base text-luxury-white/70 leading-relaxed thin-text font-light mb-6">
              Submit your application or make payment via WhatsApp ({branch.label} branch). Our team will guide you through the next steps.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {BRANCHES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBranch(b)}
                  className={`px-4 py-2 text-xs tracking-[0.2em] uppercase border transition-colors ${
                    branch.id === b.id
                      ? 'bg-luxury-white text-luxury-black border-luxury-white'
                      : 'text-luxury-white/70 border-luxury-white/30 hover:text-luxury-white hover:border-luxury-white/50'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={whatsAppGeneralPayUrl(branch)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-12 py-4 bg-[#25D366] text-white editorial-text text-sm tracking-[0.2em] uppercase hover:bg-[#20bd5a] transition-colors"
              >
                Pay via WhatsApp
              </a>
              <Link
                href="/apply"
                className="inline-block px-12 py-4 bg-luxury-white text-luxury-black editorial-text text-sm tracking-[0.2em] uppercase hover:bg-luxury-white/90 transition-colors border border-luxury-white/30"
              >
                Apply Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
