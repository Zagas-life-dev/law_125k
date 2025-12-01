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
              {['Instagram', 'Twitter', 'LinkedIn'].map((social, index) => (
                <motion.a
                  key={social}
                  href="#"
                  className="text-xs text-luxury-white/50 hover:text-luxury-white tracking-[0.15em] uppercase transition-colors duration-300 ultra-thin-text"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {social}
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
                { name: 'About', href: '#about' },
                { name: 'Courses', href: '#courses' },
                { name: 'Gallery', href: '#gallery' },
                { name: 'Enrol', href: '#cta' },
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
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:enrol@lawmodelacademy.com"
                  className="text-sm text-luxury-white/70 hover:text-luxury-white transition-colors duration-300"
                >
                  enrol@lawmodelacademy.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+15551234567"
                  className="text-sm text-luxury-white/70 hover:text-luxury-white transition-colors duration-300"
                >
                  +1 (555) 123-4567
                </a>
              </li>
              <li>
                <p className="text-sm text-luxury-white/70">
                  Lagos, Nigeria
                </p>
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
