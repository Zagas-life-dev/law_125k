'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function SyllabusPage() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const modules = [
    {
      number: '01',
      title: 'The Walk',
      subtitle: 'Catwalk Training',
      description: 'Learn the fundamentals of runway walking, from high fashion editorial walks to commercial runway techniques. Master the art of commanding attention while showcasing garments with precision and elegance.',
      href: '/courses/academy-training',
      topics: [
        'High Fashion Editorial Walk',
        'Commercial Runway Techniques',
        'Pace and Rhythm Control',
        'Turning and Posing on Runway',
        'Garment Presentation',
        'Stage Presence and Confidence',
      ],
    },
    {
      number: '02',
      title: 'The Pose',
      subtitle: 'Editorial vs. Commercial Movement',
      description: 'Understand the nuanced differences between editorial and commercial posing. Develop versatility in movement, expression, and body language to adapt to various photography and campaign styles.',
      href: '/courses/editorial-studio',
      topics: [
        'Editorial Posing Techniques',
        'Commercial Movement Styles',
        'Facial Expression Mastery',
        'Body Language and Posture',
        'Working with Photographers',
        'Adapting to Different Briefs',
      ],
    },
    {
      number: '03',
      title: 'The Business',
      subtitle: 'Managing Agency Relationships',
      description: 'Navigate the business side of modeling, including contract negotiations, agency relationships, and career management. Learn how to work effectively with ISIS Models and other industry professionals.',
      href: '/courses/industry-access',
      topics: [
        'Agency Relationship Management',
        'Contract Understanding and Negotiation',
        'Portfolio Development',
        'Networking and Industry Connections',
        'Career Planning and Strategy',
        'Professional Communication',
      ],
    },
  ]

  return (
    <main className="relative">
      <Navigation />
      <WhatsAppButton />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-luxury-black flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              Curriculum
            </span>
            <h1 className="editorial-text text-7xl md:text-8xl lg:text-9xl font-bold text-luxury-white mb-8 leading-tight">
              Class Syllabus
            </h1>
            <div className="w-20 h-px bg-luxury-white/30 mx-auto mb-8" />
            <p className="text-lg md:text-xl text-luxury-white/70 max-w-2xl mx-auto leading-relaxed thin-text font-light">
              Comprehensive training covering every aspect of professional modeling
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section ref={ref} className="relative bg-luxury-white py-32">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="space-y-32">
            {modules.map((module, index) => (
              <motion.div
                key={module.number}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start"
              >
                {/* Left - Number and Title */}
                <div className="lg:col-span-4">
                  <div className="sticky top-32">
                    <Link
                      href={module.href}
                      aria-label={`View ${module.title} course`}
                      className="group block cursor-pointer"
                    >
                      <div className="relative mb-8">
                        <span className="editorial-text text-[12rem] md:text-[16rem] font-bold text-luxury-black/5 absolute -top-8 -left-4 pointer-events-none">
                          {module.number}
                        </span>
                        <span className="editorial-text text-6xl md:text-7xl font-bold text-luxury-black relative z-10">
                          {module.number}
                        </span>
                      </div>
                      <h2 className="editorial-text text-4xl md:text-5xl font-bold text-luxury-black mb-4 leading-tight">
                        {module.title}
                      </h2>
                      <div className="w-20 h-px bg-luxury-black/30 mb-6" />
                      <p className="text-sm text-luxury-black/60 tracking-wider uppercase thin-text mb-8">
                        {module.subtitle}
                      </p>
                      <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-luxury-black/70 group-hover:text-luxury-black transition-colors ultra-thin-text">
                        View Course
                        <span className="text-luxury-black/40">→</span>
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Right - Content */}
                <div className="lg:col-span-8">
                  <p className="text-base md:text-lg text-luxury-black/70 leading-relaxed thin-text font-light mb-12">
                    {module.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {module.topics.map((topic, topicIndex) => (
                      <motion.div
                        key={topic}
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: index * 0.2 + topicIndex * 0.1 }}
                        className="flex items-start gap-4 pb-6 border-b border-luxury-black/10"
                      >
                        <div className="w-1 h-1 bg-luxury-black rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-luxury-black/70 leading-relaxed thin-text font-light">
                          {topic}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-luxury-black py-32">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="editorial-text text-5xl md:text-6xl font-bold text-luxury-white mb-8 leading-tight">
              Ready to Begin?
            </h2>
            <div className="w-20 h-px bg-luxury-white/30 mx-auto mb-8" />
            <p className="text-base md:text-lg text-luxury-white/70 leading-relaxed thin-text font-light mb-12">
              Join LAW Model Academy and transform your modeling career with
              comprehensive training from industry masters.
            </p>
            <motion.a
              href="/apply"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block px-12 py-4 bg-luxury-white text-luxury-black editorial-text text-lg tracking-wider uppercase hover:bg-luxury-white/90 transition-colors"
            >
              Apply Now
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
