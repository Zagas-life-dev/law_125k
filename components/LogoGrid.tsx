'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const brands = [
  { name: 'Chanel', logo: 'CHANEL' },
  { name: 'Gucci', logo: 'GUCCI' },
  { name: 'Louis Vuitton', logo: 'LOUIS VUITTON' },
  { name: 'Balenciaga', logo: 'BALENCIAGA' },
  { name: 'Dolce & Gabbana', logo: 'DOLCE & GABBANA' },
  { name: 'Burberry', logo: 'BURBERRY' },
  { name: 'Tommy Jeans', logo: 'TOMMY JEANS' },
  { name: 'H&M', logo: 'H&M' },
  { name: 'Dior', logo: 'DIOR' },
  { name: 'Zara', logo: 'ZARA' },
  { name: 'Zegna', logo: 'ZEGNA' },
  { name: 'Valentino', logo: 'VALENTINO' },
  { name: 'Prada', logo: 'PRADA' },
  { name: 'YSL Saint Laurent', logo: 'YSL SAINT LAURENT' },
  { name: 'Fendi', logo: 'FENDI' },
  { name: 'Dsquared2', logo: 'DSQUARED2' },
  { name: 'Alexander McQueen', logo: 'ALEXANDER MCQUEEN' },
]

export default function LogoGrid() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section ref={ref} className="py-24 bg-luxury-white">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs text-luxury-black/70 tracking-[0.2em] uppercase thin-text mb-6 block">
            Graduates Have Walked For
          </span>
        </motion.div>

        <div className="flex items-center justify-center gap-16 md:gap-24 lg:gap-32 flex-wrap">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="grayscale hover:grayscale-0 transition-all duration-500"
            >
              <div className="text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] text-luxury-black/40 hover:text-luxury-black/70 transition-colors thin-text">
                {brand.logo}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
