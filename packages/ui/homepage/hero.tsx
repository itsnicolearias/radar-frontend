import { ButtonNew } from "./ui/button"
import { RadarAnimation } from "./radar-animation"

export function Hero() {
  return (
    <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1E3A5F] via-[#2A5A7F] to-[#3EC8A7]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight text-balance">
              Descubrí quién está cerca tuyo
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed text-pretty">
              Explorá tu entorno, conectá con personas y descubrí eventos en tiempo real.
            </p>
            <ButtonNew
              asChild
              size="lg"
              className="bg-[#FF6F61] hover:bg-[#E55F51] text-white text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6 w-full sm:w-auto"
            >
              <a href="#lista-espera">Unite a Radar</a>
            </ButtonNew>
          </div>
          <div className="relative order-1 lg:order-2">
            <RadarAnimation />
          </div>
        </div>
      </div>
    </section>
  )
}
