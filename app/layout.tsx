import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond, Cormorant_Upright } from 'next/font/google'
import './globals.css'
import CustomCursor from '@/components/CustomCursor'
import LoadingScreen from '@/components/LoadingScreen'
import ParticleSystem from '@/components/ParticleSystem'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600'],
  variable: '--font-inter',
})

const cormorantGaramond = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant-garamond',
})

const cormorantUpright = Cormorant_Upright({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant-upright',
})

export const metadata: Metadata = {
  title: 'LAW Model Academy | Larry Walker Model Academy',
  description: 'High-fashion modeling academy with cinematic, editorial excellence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${cormorantGaramond.variable} ${cormorantUpright.variable} font-sans antialiased cursor-none`}>
        <CustomCursor />
        <LoadingScreen />
        <ParticleSystem />
        {children}
      </body>
    </html>
  )
}

