'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
    setIsScrolled(latest > 50)
  })

  const navItems = [
    { name: 'Home', href: '/', number: '01' },
    { name: 'About', href: '/about', number: '02' },
    // { name: 'Syllabus', href: '/syllabus', number: '03' },
    { name: 'Courses', href: '/courses', number: '03' },
    { name: 'Gallery', href: '/gallery', number: '04' },
    { name: 'Apply', href: '/apply', number: '05' },
  ]

  return (
    <>
      {/* Minimal Top Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          isScrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-between">
            <Link href="/">
              <motion.div
                className="editorial-text text-2xl font-bold text-luxury-white"
                whileHover={{ scale: 1.1 }}
              >
                LAW
              </motion.div>
            </Link>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-luxury-white text-xs tracking-[0.2em] uppercase thin-text"
            >
              Menu
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-luxury-black"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 text-luxury-white text-2xl z-10"
            >
              ×
            </button>

            {/* Menu Content */}
            <div className="h-full flex items-center justify-center">
              <div className="w-full max-w-6xl px-6 lg:px-16">
                <nav className="space-y-4">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group block"
                      >
                        <div className="flex items-center gap-8 py-4 border-b border-luxury-white/10 group-hover:border-luxury-white/30 transition-colors">
                          <span className="text-sm text-luxury-white/40 tracking-widest font-mono w-12">
                            {item.number}
                          </span>
                          <span className="editorial-text text-4xl md:text-6xl lg:text-8xl font-bold text-luxury-white group-hover:text-luxury-white/70 transition-colors">
                            {item.name}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </nav>

                {/* Bottom Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-16 left-6 lg:left-16 flex flex-col gap-4 text-luxury-white/60 text-sm"
                >
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-1 opacity-50">Email</p>
                    <a href="mailto:enrol@lawmodelacademy.com" className="hover:text-luxury-white transition-colors">
                      enrol@lawmodelacademy.com
                    </a>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-1 opacity-50">Location</p>
                    <p>New York, NY</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
