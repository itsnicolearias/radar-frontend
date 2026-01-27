import { Card, CardContent } from "../components/card"

const testimonials = [
  {
    initial: "M",
    name: "María González",
    location: "Buenos Aires",
    quote:
      "Finalmente puedo ver qué está pasando en mi ciudad. Radar me ayudó a descubrir eventos increíbles que nunca hubiera encontrado.",
    color: "#00FFB3",
  },
  {
    initial: "J",
    name: "Juan Pérez",
    location: "Córdoba",
    quote: "Radar me ayudó a conocer gente nueva de forma divertida y segura. La función de privacidad es excelente.",
    color: "#1DE3F2",
  },
  {
    initial: "L",
    name: "Laura Martínez",
    location: "Rosario",
    quote: "La mejor app para conectar con personas que comparten tus intereses. El radar en tiempo real es adictivo!",
    color: "#FF005C",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Comunidad <span className="text-[#00FFB3]">Radar</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto">
            Descubrí por qué miles de personas ya están conectando con su entorno.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-[#1A1A1A] border-white/5 hover:bg-[#1A1A1A]/80 transition-all group p-6">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-black font-bold text-xl shrink-0 shadow-lg"
                  style={{ backgroundColor: testimonial.color }}
                >
                  {testimonial.initial}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                  <p className="text-white/50 text-sm">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-lg text-white/80 leading-relaxed italic font-medium">
                "{testimonial.quote}"
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
