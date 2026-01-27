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
    <section id="como-funciona" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-3 sm:mb-4 text-balance">
            Cómo funciona
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 text-pretty">
            Empezá a conectar en 4 simples pasos
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3EC8A7] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-white">
                {step.number}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1E3A5F] mb-2 sm:mb-3">{step.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
