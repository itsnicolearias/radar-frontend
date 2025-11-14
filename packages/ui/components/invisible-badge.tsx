"use client"

import { motion } from "framer-motion"

export const InvisibleBadge: React.FC = () => {
  return (
    <motion.div
      className="absolute top-28 left-1/2 -translate-x-1/2 bg-[#FF005C] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg shadow-[#FF005C]/30"
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      Modo invisible activado
    </motion.div>
  )
}
