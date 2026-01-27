import { Card } from "../components/card"


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
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-3 sm:mb-4 text-balance">
            Lo que dicen nuestros usuarios
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-5 sm:p-6 bg-white">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3EC8A7] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {testimonial.initial}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-[#1E3A5F] text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{testimonial.quote}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
