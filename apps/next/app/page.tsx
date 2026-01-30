"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RadarIcon, Users, MessageCircle, Calendar, Shield, MapPin, Check } from "lucide-react";
import { LandingNavbar } from "@/components/landing-navbar";

// Radar Animation Component
function RadarAnimation() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative aspect-square">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Concentric circles */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full"
              style={{
                width: `${100 - ring * 20}%`,
                height: `${100 - ring * 20}%`,
                top: `${ring * 10}%`,
                left: `${ring * 10}%`,
                borderColor: "rgba(0, 255, 179, 0.3)",
                borderWidth: "2px",
              }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: ring * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Sonar wave */}
          <motion.div
            className="absolute inset-0 border-2 border-[#00FFB3] rounded-full"
            animate={{ scale: [0.3, 2], opacity: [0.6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          />

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-5 h-5 bg-[#FF005C] rounded-full shadow-lg shadow-[#FF005C]/50"
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 10px rgba(255, 0, 92, 0.5)",
                  "0 0 20px rgba(255, 0, 92, 0.8)",
                  "0 0 10px rgba(255, 0, 92, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Scanning line */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute top-1/2 left-1/2 w-[2px] h-20 origin-bottom"
              style={{
                transformOrigin: "bottom center",
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(to top, transparent, rgba(0,255,179,0.8), transparent)",
              }}
            />
          </motion.div>

          {/* User markers */}
          <div
            className="absolute top-1/4 right-1/4 w-10 h-10 bg-white rounded-full border-2 border-[#00FFB3] flex items-center justify-center text-xs font-semibold text-black"
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            A
          </div>
          <div
            className="absolute bottom-1/3 left-1/4 w-10 h-10 bg-white rounded-full border-2 border-[#00FFB3] flex items-center justify-center text-xs font-semibold text-black"
            style={{
              animation: "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s",
            }}
          >
            B
          </div>
          <div
            className="absolute top-1/2 right-1/3 w-10 h-10 bg-white rounded-full border-2 border-[#00FFB3] flex items-center justify-center text-xs font-semibold text-black"
            style={{
              animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s",
            }}
          >
            C
          </div>
        </div>
      </div>
    </div>
  );
}

// Features Component
function Features() {
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
  ];

  return (
    <section id="funcionalidades" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.08) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-balance">
            Funcionalidades principales
          </h2>
          <p className="text-lg sm:text-xl text-[#C5C5C5]">
            Todo lo que necesitás para conectar con tu entorno
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-[#1A1A1A] border border-[#00FFB3]/20 rounded-2xl hover:border-[#00FFB3]/50 transition-all hover:shadow-lg hover:shadow-[#00FFB3]/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-[#C5C5C5] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Events Component
function Events() {
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
      color: "bg-[#1DE3F2]",
    },
    {
      icon: MapPin,
      title: "Feria gastronómica",
      distance: "3.8 km",
      interested: 234,
      color: "bg-[#00FFB3]",
    },
  ];

  const benefits = [
    "Filtrá eventos por categoría y distancia",
    "Mirá cuántas personas están interesadas",
    "Conectá con asistentes antes del evento",
    "Recibí notificaciones de eventos nuevos",
  ];

  return (
    <section id="eventos" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-balance">
              Eventos cerca tuyo
            </h2>
            <p className="text-lg sm:text-xl text-[#C5C5C5] mb-8 leading-relaxed">
              Descubrí los eventos más populares cerca tuyo y conectá con personas interesadas. Desde conciertos hasta
              meetups, nunca te pierdas lo que está pasando en tu ciudad.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Check className="w-5 h-5 text-[#00FFB3] shrink-0 mt-1" />
                  <span className="text-[#C5C5C5]">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#0F2B33] to-[#1A1A1A] rounded-3xl p-6 sm:p-8 border border-[#00FFB3]/20"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              {eventsList.map((event, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-[#1A1A1A] border border-[#00FFB3]/20 rounded-xl flex items-center gap-4 hover:border-[#00FFB3]/50 transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className={`w-12 h-12 ${event.color} rounded-lg flex items-center justify-center shrink-0`}
                  >
                    <event.icon className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{event.title}</h4>
                    <p className="text-xs text-[#C5C5C5]">
                      A {event.distance} • {event.interested} interesados
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-[#0A0E12] border-t border-[#00FFB3]/20 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center">
                <RadarIcon className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">Radar</span>
            </div>
            <p className="text-sm text-[#C5C5C5]">Descubrí quién está cerca tuyo</p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">Producto</h4>
            <ul className="space-y-2 text-[#C5C5C5] text-sm">
              <li>
                <a href="#funcionalidades" className="hover:text-[#00FFB3] transition-colors">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#eventos" className="hover:text-[#00FFB3] transition-colors">
                  Eventos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-[#C5C5C5] text-sm">
              <li>
                <a href="#" className="hover:text-[#00FFB3] transition-colors">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00FFB3] transition-colors">
                  Términos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">Seguinos</h4>
            <div className="flex gap-3">
              {["📷", "🐦", "📘"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-[#1A1A1A] border border-[#00FFB3]/30 rounded-full flex items-center justify-center hover:bg-[#00FFB3]/10 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#00FFB3]/20 pt-8 text-center text-[#C5C5C5] text-sm">
          <p>&copy; 2025 Radar. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 6,
      delay: i * 0.5,
    }));

    setParticles(generated);
  }, []);

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Navbar */}
      <LandingNavbar />

      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.12) 0%, transparent 70%)",
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 bg-[#00FFB3] rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance leading-tight">
                Descubrí quién está cerca tuyo
              </h1>
              
              <p className="text-lg sm:text-xl text-[#C5C5C5] mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Explorá tu entorno, conectá con personas y descubrí eventos en tiempo real.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center lg:justify-start"
              >
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center h-14 px-10 text-lg font-semibold bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black rounded-full hover:opacity-90 hover:shadow-xl transition-all shadow-lg shadow-[#00FFB3]/30"
                >
                  Unite a Radar
                </Link>
              </motion.div>
            </motion.div>

            {/* Right side - Radar animation */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-full max-w-md">
                <RadarAnimation />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Events Section */}
      <Events />

      {/* Footer */}
      <Footer />
    </div>
  );
}
