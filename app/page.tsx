import Hero from '@/components/Hero'
import About from '@/components/About'
import Courses from '@/components/Courses'
import Gallery from '@/components/Gallery'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import WhatsAppButton from '@/components/WhatsAppButton'
import LogoGrid from '@/components/LogoGrid'

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <WhatsAppButton />
      <Hero />
      <About />
      <LogoGrid />
      <Courses />
      <Gallery />
      <CTA />
      <Footer />
    </main>
  )
}

