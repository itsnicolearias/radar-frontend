"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import { Button } from "@radar/ui"
import { RadarIcon } from 'lucide-react'

export default function WelcomePage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2,
  }))

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-radial from-[#00FFB3]/10 via-transparent to-transparent pointer-events-none" />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1.5 h-1.5 bg-[#00FFB3] rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.2, 0.5],
            y: [0, -30, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 flex flex-col items-center justify-between min-h-screen px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo and title */}
        <motion.div className="flex-1 flex flex-col items-center justify-center space-y-8" variants={itemVariants}>
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] flex items-center justify-center animate-radar-glow border-2 border-[#00FFB3]/50"
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 255, 179, 0.4), 0 0 40px rgba(29, 227, 242, 0.2)",
                "0 0 40px rgba(0, 255, 179, 0.8), 0 0 60px rgba(29, 227, 242, 0.4)",
                "0 0 20px rgba(0, 255, 179, 0.4), 0 0 40px rgba(29, 227, 242, 0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <RadarIcon className="w-12 h-12 text-black" />
          </motion.div>

          <motion.h1 className="text-5xl font-bold text-center text-balance text-white" variants={itemVariants}>
            RADAR
          </motion.h1>

          <motion.p
            className="text-xl text-center text-balance max-w-md text-[#C5C5C5]"
            variants={itemVariants}
          >
            Descubrí quién está cerca de vos en tiempo real
          </motion.p>
        </motion.div>

        {/* Action buttons */}
        <motion.div className="w-full max-w-sm space-y-4" variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-[#00FFB3]/50"
            >
              <Link href="/register">Registrarme</Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              className="w-full h-14 text-lg font-semibold border-2 border-[#00FFB3] text-[#00FFB3] bg-transparent rounded-2xl hover:bg-[#00FFB3]/10 transition-all"
            >
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
