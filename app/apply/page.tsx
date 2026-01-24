'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    height: '',
    measurements: '',
    city: '',
    country: '',
    experience: '',
    photos: {
      front: null as File | null,
      profile: null as File | null,
      waistUp: null as File | null,
      fullBody: null as File | null,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, photoType: keyof typeof formData.photos) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photos: { ...prev.photos, [photoType]: file },
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // TODO: Implement form submission logic
    // This would typically send to an API endpoint
    
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Application submitted successfully! We will contact you soon.')
    }, 2000)
  }

  return (
    <main className="relative">
      <Navigation />
      <WhatsAppButton />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-luxury-black flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              Digital Scouting
            </span>
            <h1 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
              Apply Now
            </h1>
            <div className="w-20 h-px bg-luxury-white/30 mx-auto mb-8" />
            <p className="text-lg md:text-xl text-luxury-white/70 max-w-2xl mx-auto leading-relaxed thin-text font-light">
              Submit your application for consideration by our exclusive scouting team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="relative bg-luxury-white py-32">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-12"
          >
            {/* Personal Information */}
            <div>
              <h2 className="editorial-text text-3xl md:text-4xl font-bold text-luxury-black mb-8">
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none transition-colors thin-text"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none transition-colors thin-text"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none transition-colors thin-text"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none transition-colors thin-text"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none transition-colors thin-text"
                  />
                </div>
              </div>
            </div>

            {/* Physical Measurements */}
            <div>
              <h2 className="editorial-text text-3xl md:text-4xl font-bold text-luxury-black mb-8">
                Physical Measurements
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="height" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                    Height (cm)
                  </label>
                  <input
                    type="text"
                    id="height"
                    name="height"
                    required
                    placeholder="e.g., 175"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none transition-colors thin-text"
                  />
                </div>
                <div>
                  <label htmlFor="measurements" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                    Measurements (Bust-Waist-Hips)
                  </label>
                  <input
                    type="text"
                    id="measurements"
                    name="measurements"
                    required
                    placeholder="e.g., 86-61-86"
                    value={formData.measurements}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none transition-colors thin-text"
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                Previous Modeling Experience
              </label>
              <textarea
                id="experience"
                name="experience"
                rows={4}
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none transition-colors thin-text"
                placeholder="Please describe any previous modeling experience, training, or related work..."
              />
            </div>

            {/* Polaroid Photos */}
            <div>
              <h2 className="editorial-text text-3xl md:text-4xl font-bold text-luxury-black mb-8">
                Required Polaroids
              </h2>
              <p className="text-sm text-luxury-black/60 mb-8 thin-text">
                Please upload 4 professional polaroid-style photos (no makeup, natural lighting, plain background)
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { key: 'front' as const, label: 'Front View' },
                  { key: 'profile' as const, label: 'Profile View' },
                  { key: 'waistUp' as const, label: 'Waist Up' },
                  { key: 'fullBody' as const, label: 'Full Body' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                      {label}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => handleFileChange(e, key)}
                      className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none transition-colors thin-text file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-light file:bg-luxury-black file:text-luxury-white file:cursor-pointer"
                    />
                    {formData.photos[key] && (
                      <p className="text-xs text-luxury-black/40 mt-2 thin-text">
                        Selected: {formData.photos[key]?.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-12 py-4 bg-luxury-black text-luxury-white editorial-text text-lg tracking-wider uppercase hover:bg-luxury-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
