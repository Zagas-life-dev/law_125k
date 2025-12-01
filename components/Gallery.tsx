'use client'

import { useInView } from 'react-intersection-observer'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'

export default function Gallery() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const galleryRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  })

  const galleryImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop',
      alt: 'Fashion Model 1',
      title: 'Editorial',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=900&fit=crop',
      alt: 'Fashion Model 2',
      title: 'Runway',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=700&h=1000&fit=crop',
      alt: 'Fashion Model 3',
      title: 'Portfolio',
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=900&fit=crop',
      alt: 'Fashion Model 4',
      title: 'Campaign',
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop',
      alt: 'Fashion Model 5',
      title: 'Editorial',
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop',
      alt: 'Fashion Model 6',
      title: 'Commercial',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <>
      <section
        ref={galleryRef}
        id="gallery"
        className="relative min-h-screen bg-luxury-white py-32 overflow-hidden"
      >
        <div className="px-6 lg:px-16 mb-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs text-luxury-black/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              Portfolio
            </span>
            <h2 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-black leading-tight mb-4">
              Our
              <br />
              Work
            </h2>
            <div className="w-20 h-px bg-luxury-black/30" />
          </motion.div>
        </div>

        {/* Asymmetric Grid */}
        <div className="px-6 lg:px-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                className={`group relative overflow-hidden bg-luxury-black cursor-pointer ${
                  index === 0 || index === 4 ? 'md:row-span-2' : ''
                }`}
                onClick={() => setSelectedImage(image.id)}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`relative overflow-hidden ${
                    index === 0 || index === 4 ? 'aspect-[2/3]' : 'aspect-[3/4]'
                  }`}
                >
                  <motion.img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-luxury-white tracking-[0.2em] uppercase ultra-thin-text">
                      {image.title}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Large Number */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="absolute bottom-16 right-16 hidden lg:block"
        >
          <span className="editorial-text text-[12rem] font-bold text-luxury-black/5">
            04
          </span>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-luxury-black/95 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages.find(img => img.id === selectedImage)?.src}
                alt="Gallery"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-luxury-white text-2xl w-12 h-12 flex items-center justify-center glassmorphism-light rounded-full hover:scale-110 transition-transform"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
