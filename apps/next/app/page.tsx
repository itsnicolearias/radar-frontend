import { Footer, Navbar } from "@radar/ui"
import { Hero } from "@radar/ui"
import { Features } from "@radar/ui"
import { HowItWorks } from "@radar/ui"
import { Events } from "@radar/ui"
import { Testimonials } from "@radar/ui"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Events />
      <Testimonials />
      <Footer />
    </main>
  )
}
