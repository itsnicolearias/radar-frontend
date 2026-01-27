import { Calendar, Users, MapPin, Check } from "lucide-react"

const eventsList = [
  {
    icon: Calendar,
    title: "Concierto en el parque",
    distance: "2.5 km",
    interested: 156,
    color: "bg-[#FF005C]",
  },
  {
    icon: Users,
    title: "Meetup de emprendedores",
    distance: "1.2 km",
    interested: 89,
    color: "bg-[#00FFB3]",
  },
  {
    icon: MapPin,
    title: "Feria gastronómica",
    distance: "3.8 km",
    interested: 234,
    color: "bg-[#1DE3F2]",
  },
]

const benefits = [
  "Filtrá eventos por categoría y distancia",
  "Mirá cuántas personas están interesadas",
  "Conectá con asistentes antes del evento",
  "Recibí notificaciones de eventos nuevos",
]

export function Events() {
  return (
    <section id="eventos" className="py-24 px-6 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#1DE3F2]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
              Eventos <span className="text-[#00FFB3]">cerca tuyo</span>
            </h2>
            <p className="text-lg text-[#C5C5C5] mb-8 leading-relaxed">
              Descubrí los eventos más populares cerca tuyo y conectá con personas interesadas. Nunca te pierdas lo que está pasando en tu ciudad.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-[#00FFB3]/10 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-[#00FFB3]" />
                  </div>
                  <span className="text-[#C5C5C5]">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="bg-gradient-to-br from-[#0A0E12] to-[#0F2B33] rounded-3xl p-8 border border-[#00FFB3]/20 shadow-2xl shadow-[#00FFB3]/10">
              <div className="space-y-4">
                {eventsList.map((event, index) => (
                  <div
                    key={index}
                    className="p-4 bg-[#1A1A1A] border border-[#00FFB3]/10 rounded-2xl flex items-center gap-4 hover:border-[#00FFB3]/30 transition-all group"
                  >
                    <div className={`w-14 h-14 ${event.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      <event.icon className="w-7 h-7 text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-base truncate">{event.title}</h4>
                      <p className="text-sm text-[#C5C5C5]">
                        A {event.distance} • {event.interested} interesados
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
