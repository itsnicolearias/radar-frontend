import { Calendar, Users, MapPin, Check } from "lucide-react"

const eventsList = [
  {
    icon: Calendar,
    title: "Concierto en el parque",
    distance: "2.5 km",
    interested: 156,
    color: "bg-[#00FFB3]",
    textColor: "text-black",
  },
  {
    icon: Users,
    title: "Meetup de emprendedores",
    distance: "1.2 km",
    interested: 89,
    color: "bg-[#1DE3F2]",
    textColor: "text-black",
  },
  {
    icon: MapPin,
    title: "Feria gastronómica",
    distance: "3.8 km",
    interested: 234,
    color: "bg-[#FF005C]",
    textColor: "text-white",
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
    <section id="eventos" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Eventos <span className="text-[#FF005C]">cerca tuyo</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed">
              Descubrí lo que está pasando a la vuelta de la esquina. Desde conciertos masivos hasta reuniones íntimas, Radar te mantiene al tanto de todo.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-[#FF005C]/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-[#FF005C]" />
                  </div>
                  <span className="text-lg text-white/80">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative order-1 lg:order-2">
            {/* Decoration Glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#FF005C]/20 to-[#1DE3F2]/20 blur-3xl rounded-full" />

            <div className="relative bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group">
              {/* Card accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF005C] via-[#1DE3F2] to-[#00FFB3]" />

              <div className="space-y-4">
                {eventsList.map((event, index) => (
                  <div key={index} className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center gap-4 transition-colors">
                    <div
                      className={`w-14 h-14 ${event.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg`}
                    >
                      <event.icon className={`w-7 h-7 ${event.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-lg truncate">{event.title}</h4>
                      <p className="text-white/50">
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
