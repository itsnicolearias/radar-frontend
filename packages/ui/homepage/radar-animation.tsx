"use client"

import { motion } from "framer-motion"

export function RadarAnimation() {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md mx-auto aspect-square flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[#00FFB3]/10 blur-[60px] rounded-full" />

      {/* Concentric rings from Style Guide */}
      {[1, 2, 3, 4].map((ring) => (
        <motion.div
          key={ring}
          className="absolute border-2 rounded-full"
          style={{
            width: `${100 - ring * 20}%`,
            height: `${100 - ring * 20}%`,
            borderColor: 'rgba(0, 255, 179, 0.3)',
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: ring * 0.4,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Pulsing signal wave */}
      <motion.div
        className="absolute w-1/2 h-1/2 rounded-full border-2 border-[#00FFB3]"
        animate={{
          scale: [0.8, 2],
          opacity: [0.6, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut'
        }}
      />

      {/* Center dot */}
      <motion.div
        className="relative w-4 h-4 bg-[#FF005C] rounded-full z-10"
        animate={{
          boxShadow: [
            '0 0 10px rgba(255, 0, 92, 0.5)',
            '0 0 20px rgba(255, 0, 92, 0.8)',
            '0 0 10px rgba(255, 0, 92, 0.5)',
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* User avatars (floating) */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-12 h-12 bg-[#1A1A1A] rounded-full border-2 border-[#00FFB3] flex items-center justify-center text-white font-bold shadow-lg shadow-[#00FFB3]/20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        A
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-[#1A1A1A] rounded-full border-2 border-[#00FFB3] flex items-center justify-center text-white font-bold shadow-lg shadow-[#00FFB3]/20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        B
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-0 w-12 h-12 bg-[#1A1A1A] rounded-full border-2 border-[#FF005C] flex items-center justify-center text-white font-bold shadow-lg shadow-[#FF005C]/20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        C
      </motion.div>
    </div>
  )
}
