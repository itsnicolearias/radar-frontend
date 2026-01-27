import { RadarIcon, Users, MessageCircle, Calendar, Shield, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"

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
    <section id="funcionalidades" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Funcionalidades <span className="text-[#00FFB3]">principales</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto">
            Todo lo que necesitás para conectar con tu entorno de manera segura y divertida.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-[#1A1A1A] border-white/5 hover:border-[#00FFB3]/30 transition-all duration-300 group">
              <CardHeader className="pb-2">
                <div className="w-14 h-14 bg-[#00FFB3]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#00FFB3]/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-[#00FFB3]" />
                </div>
                <CardTitle className="text-xl font-bold text-white group-hover:text-[#00FFB3] transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
