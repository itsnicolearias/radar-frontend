import { RadarIcon, Users, MessageCircle, Calendar, Shield, MapPin } from "lucide-react"

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
    <section id="funcionalidades" className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Funcionalidades <span className="text-[#00FFB3]">principales</span>
          </h2>
          <p className="text-lg text-[#C5C5C5] max-w-2xl mx-auto">
            Todo lo que necesitás para conectar con tu entorno de manera rápida y segura.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A] border border-[#00FFB3]/20 rounded-2xl p-8 hover:border-[#00FFB3]/50 transition-all group"
            >
              <div className="w-12 h-12 bg-[#00FFB3]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-[#00FFB3]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-[#C5C5C5] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
