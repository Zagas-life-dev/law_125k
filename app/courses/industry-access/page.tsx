'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function IndustryAccessPage() {
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
              Industry Access
            </span>
            <h1 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
              Agency & Scouting
            </h1>
            <div className="w-20 h-px bg-luxury-white/30 mx-auto mb-8" />
            <p className="text-lg md:text-xl text-luxury-white/70 max-w-2xl mx-auto leading-relaxed thin-text font-light">
              Contracts, branding, and exposure to ISIS Models Africa and other agencies.
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
            {/* Important notice */}
            <div className="border-l-4 border-luxury-black bg-luxury-black/5 p-6 md:p-8">
              <p className="text-xs tracking-[0.2em] uppercase text-luxury-black/70 font-medium mb-3 ultra-thin-text">
                Notice — highly important
              </p>
              <p className="text-base md:text-lg text-luxury-black leading-relaxed thin-text font-light">
                LAW Model Academy is an <strong>academy</strong>, not an agency. We do{' '}
                <strong>not</strong> guarantee placements. We do provide exposure—to ISIS
                Models Africa and to <strong>other agencies</strong>—so you can be seen
                and considered. Outcomes depend on you, the market, and each agency.
              </p>
            </div>

            <div>
              <h2 className="editorial-text text-4xl md:text-5xl font-bold text-luxury-black mb-4">
                The Business
              </h2>
              <p className="text-base md:text-lg text-luxury-black/70 leading-relaxed thin-text font-light">
                Understand contracts, agency expectations, brand positioning, and
                the pathways that connect talent to professional opportunities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                'What is a Mother Agency',
                'What is are Sub-Agencies',
                'What is a Casting Director',
                'What are Fashion Weeks and how to prepare for them',
                'How to handle a Model contract and negotiate with agencies',
                'What are industry standards and expectations',
                'How to prepare for a casting',
                'How to carry yourself as a model',
                'How to live the models lifestyle',
                'Scouting in the industry, what agencies and brands are looking for',
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

      <Footer />
    </main>
  )
}
