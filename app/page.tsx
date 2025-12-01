import Hero from '@/components/Hero'
import About from '@/components/About'
import Courses from '@/components/Courses'
import Gallery from '@/components/Gallery'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <About />
      <Courses />
      <Gallery />
      <CTA />
      <Footer />
    </main>
  )
}

