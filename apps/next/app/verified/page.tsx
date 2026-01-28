"use client"

import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function VerifiedPage() {
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Radial BG background for brand consistency */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,255,179,0.15) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center max-w-md w-full"
      >
        <div className="mb-8 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="w-24 h-24 text-[#00FFB3]" />
          </motion.div>
          {/* Subtle glow effect behind the icon */}
          <motion.div
            className="absolute inset-0 bg-[#00FFB3]/20 blur-3xl rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <h1 className="text-white text-3xl font-bold mb-4 animate-fade-in">
          ¡Felicidades!
        </h1>

        <p className="text-[#C5C5C5] text-lg mb-12 leading-relaxed max-w-[280px] sm:max-w-none">
          Has verificado tu cuenta, ahora podrás ser visible para todos los usuarios de Radar.
        </p>

        <div className="w-full space-y-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black rounded-full hover:opacity-90 hover:shadow-lg hover:shadow-[#00FFB3]/20 transition-all active:scale-95"
            role="button"
            aria-label="Registrarse"
          >
            Registrarse
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full h-14 text-lg font-semibold border-2 border-[#00FFB3] text-[#00FFB3] bg-transparent rounded-full hover:bg-[#00FFB3]/10 transition-all active:scale-95"
            role="button"
            aria-label="Iniciar sesión"
          >
            Iniciar sesión
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
