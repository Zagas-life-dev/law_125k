'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-luxury-black text-luxury-white py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <h3 className="editorial-text text-3xl font-bold mb-6 tracking-wider">
              LAW MODEL ACADEMY
            </h3>
            <p className="text-sm text-luxury-white/60 leading-relaxed max-w-md mb-6 thin-text font-light">
              Shaping the future of fashion, one model at a time. Excellence,
              elegance, and uncompromising standards since 2012.
            </p>
            <div className="flex items-center space-x-6">
              {[
                { name: 'Instagram', href: 'https://www.instagram.com/law_models_africa/' },
                { name: 'Twitter', href: '#' },
                { name: 'TikTok', href: '#' },
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="text-xs text-luxury-white/50 hover:text-luxury-white tracking-[0.15em] uppercase transition-colors duration-300 ultra-thin-text"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {social.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-luxury-white/40 ultra-thin-text">
              Navigation
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'About', href: '/about' },
                // { name: 'Syllabus', href: '/syllabus' },
                { name: 'Courses', href: '/courses' },
                { name: 'Gallery', href: '/gallery' },
                { name: 'Apply', href: '/apply' },
              ].map((link, index) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-sm text-luxury-white/70 hover:text-luxury-white transition-colors duration-300 relative group inline-block thin-text font-light"
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-luxury-white group-hover:w-full transition-all duration-300" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-luxury-white/40 ultra-thin-text">
              Contact
            </h4>
            <p className="text-xs text-luxury-white/50 mb-4 thin-text">
              Two branches: Lagos & Abuja. Click to open in Google Maps.
            </p>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:larrywalker@healandfeed.org"
                  className="text-sm text-luxury-white/70 hover:text-luxury-white transition-colors duration-300"
                >
                  larrywalker@healandfeed.org
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=MTF%206%2C%20Paradise%20Estate%20Phase%202%20Lifecamp%2C%20Abuja%2C%20Nigeria"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs tracking-[0.2em] uppercase text-luxury-white/40 hover:text-luxury-white ultra-thin-text mb-2 block transition-colors duration-300"
                >
                  Abuja Branch →
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=MTF%206%2C%20Paradise%20Estate%20Phase%202%20Lifecamp%2C%20Abuja%2C%20Nigeria"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-luxury-white/70 hover:text-luxury-white transition-colors duration-300"
                >
                  MTF 6, Paradise Estate Phase 2 Lifecamp
                </a>
                <p className="text-xs text-luxury-white/40 uppercase tracking-[0.12em] ultra-thin-text mt-2">
                  Abuja Manager
                </p>
                <a
                  href="tel:09039321128"
                  className="text-sm text-luxury-white/70 hover:text-luxury-white transition-colors duration-300 block mt-1"
                >
                  09039321128
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=2%20Otunubi%20Street%20Ogba%20Ifako%20Road%20Lagos%2C%20Nigeria"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs tracking-[0.2em] uppercase text-luxury-white/40 hover:text-luxury-white ultra-thin-text mb-2 block transition-colors duration-300"
                >
                  Lagos Branch →
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=2%20Otunubi%20Street%20Ogba%20Ifako%20Road%20Lagos%2C%20Nigeria"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-luxury-white/70 hover:text-luxury-white transition-colors duration-300"
                >
                  2 Otunubi Street Ogba Ifako Road Lagos
                </a>
                <a
                  href="tel:+254726960969"
                  className="text-sm text-luxury-white/70 hover:text-luxury-white transition-colors duration-300 block mt-1"
                >
                  +254 726 960969
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full h-px bg-luxury-white/10 mb-8 origin-left"
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-xs text-luxury-white/40 tracking-wider ultra-thin-text">
            © {currentYear} LAW Model Academy. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-xs text-luxury-white/40 ultra-thin-text">
            <a href="#" className="hover:text-luxury-white/60 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-luxury-white/60 transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
