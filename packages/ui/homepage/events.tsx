import { Calendar, Users, MapPin, Check } from "lucide-react"
import { Card } from "../components/card"

const eventsList = [
  {
    icon: Calendar,
    title: "Concierto en el parque",
    distance: "2.5 km",
    interested: 156,
    color: "bg-[#FF6F61]",
  },
  {
    icon: Users,
    title: "Meetup de emprendedores",
    distance: "1.2 km",
    interested: 89,
    color: "bg-[#3EC8A7]",
  },
  {
    icon: MapPin,
    title: "Feria gastronómica",
    distance: "3.8 km",
    interested: 234,
    color: "bg-[#1E3A5F]",
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
    <section id="eventos" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4 sm:mb-6 text-balance">
              Eventos cerca tuyo
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed text-pretty">
              Descubrí los eventos más populares cerca tuyo y conectá con personas interesadas. Desde conciertos hasta
              meetups, nunca te pierdas lo que está pasando en tu ciudad.
            </p>
            <ul className="space-y-3 sm:space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#3EC8A7] shrink-0 mt-0.5 sm:mt-1" />
                  <span className="text-sm sm:text-base text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="bg-linear-to-br from-[#1E3A5F] to-[#3EC8A7] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="space-y-3 sm:space-y-4">
                {eventsList.map((event, index) => (
                  <Card key={index} className="p-3 sm:p-4 bg-white/95">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 ${event.color} rounded-lg flex items-center justify-center shrink-0`}
                      >
                        <event.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1E3A5F] text-sm sm:text-base truncate">{event.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          A {event.distance} • {event.interested} interesados
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
