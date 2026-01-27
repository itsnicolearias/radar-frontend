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
    <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Cómo <span className="text-[#1DE3F2]">funciona</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto">
            Empezá a conectar con tu comunidad en pocos minutos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center group">
              <div className="w-20 h-20 bg-[#1A1A1A] border-2 border-[#1DE3F2]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-[#1DE3F2] group-hover:border-[#1DE3F2] group-hover:shadow-[0_0_20px_rgba(29,227,242,0.2)] transition-all">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#1DE3F2] transition-colors">{step.title}</h3>
              <p className="text-white/60 leading-relaxed px-4">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
