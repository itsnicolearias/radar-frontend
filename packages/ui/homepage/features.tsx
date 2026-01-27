import { RadarIcon, Users, MessageCircle, Calendar, Shield, MapPin } from "lucide-react"
import { Card } from "../components/card"

const features = [
  {
    icon: RadarIcon,
    title: "Radar en tiempo real",
    description:
      "Visualizá personas cercanas en un radar circular interactivo. Descubrí quién está a tu alrededor en tiempo real.",
  },
  {
    icon: Users,
    title: "Perfiles completos",
    description: "Mirá fotos, nombres, edad e intereses. Conectá y enviá mensajes a personas que te interesen.",
  },
  {
    icon: MessageCircle,
    title: "Chats instantáneos",
    description: "Mensajería rápida y segura con personas cercanas. Conversá en tiempo real con tu comunidad local.",
  },
  {
    icon: Calendar,
    title: "Eventos cercanos",
    description: "Descubrí eventos próximos, mirá cuántas personas están interesadas y filtrá por categorías.",
  },
  {
    icon: Shield,
    title: "Privacidad total",
    description: "Distancia aproximada, modo invisible y protección de ubicación. Tu seguridad es nuestra prioridad.",
  },
  {
    icon: MapPin,
    title: "Geolocalización precisa",
    description: "Tecnología de ubicación avanzada para mostrarte exactamente qué está pasando cerca tuyo.",
  },
]

export function Features() {
  return (
    <section id="funcionalidades" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-3 sm:mb-4 text-balance">
            Funcionalidades principales
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 text-pretty">
            Todo lo que necesitás para conectar con tu entorno
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-5 sm:p-6 hover:shadow-lg transition-shadow border-2 border-gray-100">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#3EC8A7] rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1E3A5F] mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
