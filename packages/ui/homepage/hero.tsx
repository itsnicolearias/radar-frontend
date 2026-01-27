import { ButtonNew } from "./ui/button"
import { RadarAnimation } from "./radar-animation"

export function Hero() {
  return (
    <section className="pt-24 sm:pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
              Descubrí quién está <span className="text-[#00FFB3]">cerca tuyo</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Explorá tu entorno, conectá con personas y descubrí eventos en tiempo real con la app social más avanzada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <ButtonNew
                asChild
                size="lg"
                className="px-8"
              >
                <a href="/register">Unite a Radar</a>
              </ButtonNew>
              <ButtonNew
                asChild
                size="lg"
                variant="outline"
                className="px-8"
              >
                <a href="#funcionalidades">Saber más</a>
              </ButtonNew>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 flex justify-center">
            <div className="relative">
              {/* Background glow for the animation */}
              <div className="absolute inset-0 bg-[#00FFB3]/10 blur-[100px] rounded-full scale-150" />
              <RadarAnimation />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
