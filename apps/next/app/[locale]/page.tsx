"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RadarIcon, Users, MessageCircle, Calendar, Shield, MapPin, Check } from "lucide-react";

function LandingNavbar() {
  const t = useTranslations("landing");
  const locale = useLocale();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full blur-sm opacity-70" />
              <div className="relative w-full h-full bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-black"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold text-white">{t("brand")}</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-sm text-gray-300 hover:text-[#00FFB3] transition-colors">
              {t("nav.features")}
            </a>
            <a href="#eventos" className="text-sm text-gray-300 hover:text-[#00FFB3] transition-colors">
              {t("nav.events")}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2">
              {t("nav.login")}
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-black bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] hover:opacity-90 transition-opacity px-6 py-2 rounded-full"
            >
              {t("nav.register")}
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function RadarAnimation() {
  const t = useTranslations("landing");

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative aspect-square">
        <div className="absolute inset-0 flex items-center justify-center">
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

          <motion.div
            className="absolute inset-0 border-2 border-[#00FFB3] rounded-full"
            animate={{ scale: [0.3, 2], opacity: [0.6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          />

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
                background: "linear-gradient(to top, transparent, rgba(0,255,179,0.8), transparent)",
              }}
            />
          </motion.div>

          <div
            className="absolute top-1/4 right-1/4 w-10 h-10 bg-white rounded-full border-2 border-[#00FFB3] flex items-center justify-center text-xs font-semibold text-black"
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            {t("ui.markers.one")}
          </div>
          <div
            className="absolute bottom-1/3 left-1/4 w-10 h-10 bg-white rounded-full border-2 border-[#00FFB3] flex items-center justify-center text-xs font-semibold text-black"
            style={{
              animation: "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s",
            }}
          >
            {t("ui.markers.two")}
          </div>
          <div
            className="absolute top-1/2 right-1/3 w-10 h-10 bg-white rounded-full border-2 border-[#00FFB3] flex items-center justify-center text-xs font-semibold text-black"
            style={{
              animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s",
            }}
          >
            {t("ui.markers.three")}
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  const t = useTranslations("landing");

  const features = [
    {
      icon: RadarIcon,
      title: t("features.items.realTime.title"),
      description: t("features.items.realTime.description"),
    },
    {
      icon: Users,
      title: t("features.items.profiles.title"),
      description: t("features.items.profiles.description"),
    },
    {
      icon: MessageCircle,
      title: t("features.items.chats.title"),
      description: t("features.items.chats.description"),
    },
    {
      icon: Calendar,
      title: t("features.items.nearbyEvents.title"),
      description: t("features.items.nearbyEvents.description"),
    },
    {
      icon: Shield,
      title: t("features.items.privacy.title"),
      description: t("features.items.privacy.description"),
    },
    {
      icon: MapPin,
      title: t("features.items.geolocation.title"),
      description: t("features.items.geolocation.description"),
    },
  ];

  return (
    <section id="funcionalidades" className="relative py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-black">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.08) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="mb-10 sm:mb-14 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="rounded-2xl sm:rounded-3xl border border-[#00FFB3]/20 bg-[#11151A]/80 p-5 sm:p-7 lg:p-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 text-balance">
              {t("about.title")}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#C5C5C5] leading-relaxed max-w-4xl">{t("about.text")}</p>
          </div>
          <p className="text-lg sm:text-2xl lg:text-3xl font-semibold text-white text-center mt-7 sm:mt-9">{t("features.title")}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="h-full p-5 sm:p-6 bg-[#171B20] border border-[#00FFB3]/20 rounded-2xl hover:border-[#00FFB3]/50 transition-all hover:shadow-lg hover:shadow-[#00FFB3]/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center mb-4 sm:mb-5">
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 leading-snug">{feature.title}</h3>
              <p className="text-sm sm:text-base text-[#C5C5C5] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Events() {
  const t = useTranslations("landing");

  const eventsList = [
    {
      icon: Calendar,
      title: t("events.cards.concert"),
      distance: "2.5",
      interested: 156,
      color: "bg-[#FF005C]",
    },
    {
      icon: Users,
      title: t("events.cards.meetup"),
      distance: "1.2",
      interested: 89,
      color: "bg-[#1DE3F2]",
    },
    {
      icon: MapPin,
      title: t("events.cards.fair"),
      distance: "3.8",
      interested: 234,
      color: "bg-[#00FFB3]",
    },
  ];

  const benefits = [
    t("events.benefits.one"),
    t("events.benefits.two"),
    t("events.benefits.three"),
    t("events.benefits.four"),
  ];

  return (
    <section id="eventos" className="relative py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 text-balance">
              {t("events.title")}
            </h2>
            <h3 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-white mb-4 sm:mb-5 leading-snug">
              {t("events.heading")}
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-[#C5C5C5] mb-6 sm:mb-8 leading-relaxed">{t("events.text")}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-[#00FFB3]/15 bg-[#12161B]"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Check className="w-5 h-5 text-[#00FFB3] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#C5C5C5] leading-relaxed">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#0F2B33] to-[#1A1A1A] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-[#00FFB3]/20"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-3 sm:space-y-4">
              {eventsList.map((event, index) => (
                <motion.div
                  key={index}
                  className="p-3 sm:p-4 bg-[#13181D] border border-[#00FFB3]/20 rounded-xl sm:rounded-2xl flex items-start gap-3 sm:gap-4 hover:border-[#00FFB3]/50 transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${event.color} rounded-lg flex items-center justify-center shrink-0`}
                  >
                    <event.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="font-semibold text-white text-sm sm:text-base leading-snug">{event.title}</h4>
                    <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs text-[#D5D5D5]">
                      <span className="px-2.5 py-1 rounded-full border border-[#00FFB3]/30 bg-[#0F1418]">
                        {t("events.cards.away", { distance: t("events.cards.distanceKm", { distance: event.distance }) })}
                      </span>
                      <span className="px-2.5 py-1 rounded-full border border-[#00FFB3]/30 bg-[#0F1418]">
                        {t("events.cards.interested", { count: event.interested })}
                      </span>
                    </div>
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

function Footer() {
  const t = useTranslations("landing");

  return (
    <footer className="bg-[#0A0E12] border-t border-[#00FFB3]/20 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center">
                <RadarIcon className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">{t("brand")}</span>
            </div>
            <p className="text-sm text-[#C5C5C5]">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">{t("footer.product")}</h4>
            <ul className="space-y-2 text-[#C5C5C5] text-sm">
              <li>
                <a href="#funcionalidades" className="hover:text-[#00FFB3] transition-colors">
                  {t("nav.features")}
                </a>
              </li>
              <li>
                <a href="#eventos" className="hover:text-[#00FFB3] transition-colors">
                  {t("nav.events")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-[#C5C5C5] text-sm">
              <li>
                <a href="#" className="hover:text-[#00FFB3] transition-colors">
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00FFB3] transition-colors">
                  {t("footer.terms")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">{t("footer.follow")}</h4>
            <div className="flex gap-3">
              {[t("ui.social.instagram"), t("ui.social.x"), t("ui.social.facebook")].map((icon, i) => (
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
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; duration: number; delay: number }[]
  >([]);
  const t = useTranslations("landing");

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
      <LandingNavbar />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.12) 0%, transparent 70%)",
        }}
      />

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

      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
            <motion.div
              className="text-center lg:text-left space-y-6 sm:space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              variants={itemVariants}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-balance leading-tight">
                {t("hero.title")}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-[#C5C5C5] leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t("hero.subtitle")}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center lg:justify-start pt-2"
              >
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black rounded-full hover:opacity-90 hover:shadow-xl transition-all shadow-lg shadow-[#00FFB3]/30"
                >
                  {t("hero.cta")}
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex items-center justify-center mt-8 lg:mt-0"
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

      <Features />
      <Events />
      <Footer />
    </div>
  );
}
