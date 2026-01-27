"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function WelcomePage() {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Generate particles only on the client (avoid hydration mismatch)
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

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center animate-fade-in">
      {/* Radial BG */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,255,179,0.15) 0%, transparent 70%)",
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

      {/* MAIN CONTENT (OPTICAL CENTERED LIKE PROTOTYPE) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-50 mt-6">
        <div className="animate-scale-in flex flex-col items-center">
          {/* Radar slightly closer to the title → optical vertical alignment */}
          <div className="w-44 h-44 mx-auto mb-6 relative">
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute border-2 rounded-full"
                style={{
                  width: `${100 - ring * 20}%`,
                  height: `${100 - ring * 20}%`,
                  top: `${ring * 10}%`,
                  left: `${ring * 10}%`,
                  borderColor: "rgba(0, 255, 179, 0.3)",
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
          </div>

          {/* Title aligned visually to radar */}
          <h1 className="text-white mb-3 text-4xl font-bold tracking-wide animate-slide-up">
            RADAR
          </h1>

          <p className="text-white/90 text-center max-w-xs animate-slide-up-delay">
            Descubrí quién está cerca de vos en tiempo real
          </p>
        </div>
      </div>

      {/* BUTTONS — always visible */}
      {/* Buttons — Link styled as buttons */}
<div className="w-full px-6 pb-10 space-y-4 relative z-50 animate-slide-up-delay-2">
  <Link
    href="/register"
    className="inline-flex items-center justify-center w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black rounded-full hover:opacity-90 hover:shadow-lg transition-all shadow-[#00FFB3]/30"
    aria-label="Registrarme"
    role="button"
  >
    Registrarme
  </Link>

  <Link
    href="/login"
    className="inline-flex items-center justify-center w-full h-14 text-lg font-semibold border-2 border-[#00FFB3] text-[#00FFB3] bg-transparent rounded-full hover:bg-[#00FFB3]/10 transition-all"
    aria-label="Iniciar sesión"
    role="button"
  >
    Iniciar sesión
  </Link>
</div>

    </div>
  );
}
