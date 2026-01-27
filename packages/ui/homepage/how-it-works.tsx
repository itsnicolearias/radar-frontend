const steps = [
  {
    number: 1,
    title: "Registrate",
    description: "Creá tu perfil y activá tu radar para empezar a explorar",
  },
  {
    number: 2,
    title: "Explorá",
    description: "Descubrí personas y eventos cercanos en tiempo real",
  },
  {
    number: 3,
    title: "Conectá",
    description: "Enviá solicitudes de manera segura y empezá a chatear",
  },
  {
    number: 4,
    title: "Disfrutá",
    description: "Viví la experiencia social local como nunca antes",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 px-6 bg-[#0A0E12]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Cómo <span className="text-[#1DE3F2]">funciona</span>
          </h2>
          <p className="text-lg text-[#C5C5C5]">
            Empezá a conectar en 4 simples pasos
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black shadow-lg shadow-[#00FFB3]/20">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-[#C5C5C5] leading-relaxed">{step.description}</p>

              {/* Optional connector for desktop */}
              {step.number < 4 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-[#00FFB3]/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
