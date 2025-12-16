"use client"

import type React from "react"
import { motion } from "framer-motion"
import { EyeOff } from "lucide-react"

export const InvisibleBadge: React.FC = () => {
  return (
    <motion.div
      className="fixed top-28 left-1/2 -translate-x-1/2 z-40 bg-[#FF005C]/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg shadow-[#FF005C]/40 border border-[#FF005C]/50 flex items-center gap-2"
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <EyeOff className="w-4 h-4" />
      <span>Modo invisible activado</span>
    </motion.div>
  )
}
