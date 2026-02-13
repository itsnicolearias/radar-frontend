"use client"

import type React from "react"
import { motion } from "framer-motion"

interface CentralUserMarkerProps {
  initial: string
  label?: string
}

export const CentralUserMarker: React.FC<CentralUserMarkerProps> = ({ initial, label }) => {
  const { useUIStore } = require("@radar/features")
  const { isModalOpen } = useUIStore()

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
      style={{ pointerEvents: isModalOpen ? "none" : "auto", zIndex: isModalOpen ? 0 : 20 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-black text-lg border-2 bg-white from-[#00FFB3] to-[#1DE3F2] border-[#00FFB3]"
        style={{
          boxShadow: "0 0 30px rgba(0, 255, 179, 0.8), 0 0 60px rgba(29, 227, 242, 0.4)",
          transform: isModalOpen ? "none" : undefined,
        }}
      >
        {initial}
      </motion.div>
      <span className="mt-2 text-[#00FFB3] text-sm font-semibold">{label}</span>
    </div>
  )
}
