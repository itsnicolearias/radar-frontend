import { ButtonNew } from "./ui/button"
import { RadarAnimation } from "./radar-animation"

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-black relative overflow-hidden">
      {/* Additional Glow for Hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00FFB3]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Descubrí quién está <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2]">cerca tuyo</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#C5C5C5] mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Explorá tu entorno, conectá con personas y descubrí eventos en tiempo real con la app de geolocalización más avanzada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <ButtonNew
                asChild
                size="lg"
                className="w-full sm:w-auto h-14 rounded-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-bold text-lg hover:shadow-lg hover:shadow-[#00FFB3]/30 transition-all duration-300 active:scale-95"
              >
                <a href="/register">Unite a Radar</a>
              </ButtonNew>
              <ButtonNew
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 rounded-full border-[#00FFB3]/30 text-white font-bold text-lg hover:bg-[#00FFB3]/10 transition-all duration-300"
              >
                <a href="#funcionalidades">Saber más</a>
              </ButtonNew>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            {/* Radar Animation Container */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#00FFB3]/20 blur-[100px] rounded-full animate-pulse" />
              <RadarAnimation />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
