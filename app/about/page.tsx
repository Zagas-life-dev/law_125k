'use client'

import { useInView } from 'react-intersection-observer'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import LogoGrid from '@/components/LogoGrid'
import GeographyMap from '@/components/GeographyMap'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function AboutPage() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50])

  return (
    <main className="relative">
      <Navigation />
      <WhatsAppButton />
      
      {/* Hero Section - Prestige Style */}
      <section className="relative min-h-screen bg-luxury-black flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              The Master
            </span>
            <h1 className="editorial-text text-7xl md:text-8xl lg:text-9xl font-bold text-luxury-white mb-8 leading-tight">
              Larry Walker
            </h1>
            <div className="w-20 h-px bg-luxury-white/30 mx-auto mb-8" />
            <p className="text-lg md:text-xl text-luxury-white/70 max-w-2xl mx-auto leading-relaxed thin-text font-light">
              Exclusive Catwalk Instructor & CEO, LAW Models Academy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Prestige Numbers Section */}
      <section className="relative bg-luxury-white py-32 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { number: '15+', label: 'Years Experience', sublabel: 'Industry Mastery' },
              { number: '9', label: 'Years with ISIS Models', sublabel: 'Exclusive Partnership' },
              { number: '30+', label: 'Global Fashion Weeks', sublabel: 'International Presence' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="relative">
                  <span className="editorial-text text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-luxury-black/5 absolute -top-8 left-1/2 transform -translate-x-1/2">
                    {stat.number.replace('+', '')}
                  </span>
                  <div className="relative z-10">
                    <div className="text-7xl md:text-8xl lg:text-9xl font-bold text-luxury-black mb-4 editorial-text">
                      {stat.number}
                    </div>
                    <div className="text-sm text-luxury-black/60 tracking-[0.2em] uppercase mb-2 ultra-thin-text">
                      {stat.label}
                    </div>
                    <div className="text-xs text-luxury-black/40 tracking-wider uppercase thin-text">
                      {stat.sublabel}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Story Section - Editorial Layout */}
      <section
        ref={sectionRef}
        className="relative min-h-screen bg-luxury-black overflow-hidden"
      >
        <div className="container mx-auto px-6 lg:px-16 py-32">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Column - Large Image */}
            <motion.div
              ref={ref}
              style={{ y: imageY }}
              className="lg:col-span-7 relative"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-luxury-black">
                <motion.img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=1500&fit=crop"
                  alt="Larry Walker"
                  className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000"
                  initial={{ scale: 1.2 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Large Number Overlay */}
                <div className="absolute top-8 left-8">
                  <span className="editorial-text text-[8rem] font-bold text-luxury-white/10">
                    02
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Text */}
            <motion.div
              style={{ y: textY }}
              className="lg:col-span-5 flex flex-col justify-center lg:pl-16"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
                  The Journey
                </span>
                <h2 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
                  From Model
                  <br />
                  To Master
                </h2>
                <div className="w-20 h-px bg-luxury-white/30 mb-8" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6 text-base md:text-lg text-luxury-white/70 leading-relaxed thin-text font-light"
              >
                <p>
                  Osagie Ologbosere, known professionally as Larry Walker, is a
                  renowned catwalk instructor with 15 years of experience in the
                  modeling industry. As the CEO of LAW Models Academy, he has
                  produced successful models who have graced the runways of the
                  world's most prestigious fashion houses.
                </p>
                <p>
                  After completing his education, Larry Walker began his modeling
                  career, quickly catching the attention of industry experts with his
                  poise, elegance, and natural talent. His ability to effortlessly
                  embody different styles and showcase the vision of designers made
                  him a sought-after model, gracing numerous runways and appearing in
                  prestigious campaigns.
                </p>
                <p>
                  While the glitz and glamour of the modeling world were fulfilling,
                  Larry Walker felt a calling to share his knowledge and help aspiring
                  models navigate the industry. This pivotal moment led him to
                  transition into becoming a model instructor, guiding aspiring models
                  through both the development and business aspects of modeling.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logo Grid - Fashion Brands */}
      <LogoGrid />

      {/* Partnership Section */}
      <section className="relative min-h-screen bg-luxury-black overflow-hidden py-32">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* ISIS Partnership */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
                Exclusive Partnership
              </span>
              <h3 className="editorial-text text-5xl md:text-6xl font-bold text-luxury-white mb-6 leading-tight">
                ISIS Models Africa
              </h3>
              <div className="w-20 h-px bg-luxury-white/30 mb-8" />
              <p className="text-base md:text-lg text-luxury-white/70 leading-relaxed thin-text font-light mb-6">
                Larry Walker's reputation for expertise, professionalism, and genuine
                care for his students made him the exclusive catwalk instructor and
                scout for ISIS Models Africa—the continent's premier modeling agency.
                This partnership, spanning over 9 years and counting, has changed the
                lives of countless youths across Africa.
              </p>
              <p className="text-base md:text-lg text-luxury-white/70 leading-relaxed thin-text font-light">
                He serves as the official catwalk instructor for ISIS Models' premier
                fashion events, including Africa's Next Super Model, Nigeria's Next
                Super Model, and Africa International Fashion Week.
              </p>
            </motion.div>

            {/* Impact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
                Legacy
              </span>
              <h3 className="editorial-text text-5xl md:text-6xl font-bold text-luxury-white mb-6 leading-tight">
                Transforming Lives
              </h3>
              <div className="w-20 h-px bg-luxury-white/30 mb-8" />
              <p className="text-base md:text-lg text-luxury-white/70 leading-relaxed thin-text font-light mb-6">
                Through LAW Models Academy, Larry Walker has created a platform that
                transforms aspiring models into industry professionals. His graduates
                have walked for the world's most prestigious fashion houses, proving
                that with the right guidance, dedication, and training, dreams can
                become reality.
              </p>
              <p className="text-base md:text-lg text-luxury-white/70 leading-relaxed thin-text font-light">
                His approach combines traditional modeling fundamentals with
                contemporary industry insights, ensuring graduates are well-equipped
                for the global fashion stage.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Geography Map */}
      <GeographyMap />

      {/* Contact Section */}
      <section className="relative bg-luxury-white overflow-hidden py-32">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <span className="text-xs text-luxury-black/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              Contact
            </span>
            <h3 className="editorial-text text-4xl md:text-5xl font-bold text-luxury-black mb-8 leading-tight">
              Get In Touch
            </h3>
            <div className="w-20 h-px bg-luxury-black/30 mx-auto mb-12" />
            <div className="space-y-6 text-base md:text-lg text-luxury-black/70 leading-relaxed thin-text font-light">
              <p>
                <a href="tel:+2348124128223" className="hover:text-luxury-black transition-colors border-b border-luxury-black/20 hover:border-luxury-black/60">
                  +234 812 412 8223
                </a>
              </p>
              <p>
                <a href="mailto:larrywalker@healandfeed.org" className="hover:text-luxury-black transition-colors border-b border-luxury-black/20 hover:border-luxury-black/60">
                  larrywalker@healandfeed.org
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
