const testimonials = [
  {
    initial: "M",
    name: "María González",
    location: "Buenos Aires",
    quote:
      "Finalmente puedo ver qué está pasando en mi ciudad. Radar me ayudó a descubrir eventos increíbles que nunca hubiera encontrado.",
  },
  {
    initial: "J",
    name: "Juan Pérez",
    location: "Córdoba",
    quote: "Radar me ayudó a conocer gente nueva de forma divertida y segura. La función de privacidad es excelente.",
  },
  {
    initial: "L",
    name: "Laura Martínez",
    location: "Rosario",
    quote: "La mejor app para conectar con personas que comparten tus intereses. El radar en tiempo real es adictivo!",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-[#0A0E12]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Lo que dicen <span className="text-[#FF005C]">nuestros usuarios</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A] border border-[#00FFB3]/10 rounded-2xl p-8 hover:border-[#00FFB3]/30 transition-all flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center text-black font-bold text-xl shrink-0 shadow-lg shadow-[#00FFB3]/20">
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{testimonial.name}</h4>
                  <p className="text-sm text-[#C5C5C5]">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-[#C5C5C5] leading-relaxed italic flex-1">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
