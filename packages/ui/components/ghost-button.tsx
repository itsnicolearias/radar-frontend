"use client"

import { motion } from "framer-motion"
import { Ghost } from 'lucide-react'
import { cn } from "../lib/utils"

interface GhostButtonProps {
  onClick: () => void
  isActive: boolean
}

export const GhostButton: React.FC<GhostButtonProps> = ({ onClick, isActive }) => {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Toggle invisible mode"
      className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border",
        isActive
          ? "bg-[#FF005C]/20 border-[#FF005C]/50 shadow-lg shadow-[#FF005C]/40"
          : "bg-[#1A1A1A] border-[#1DE3F2]/30 hover:border-[#00FFB3]/50 shadow-lg shadow-[#00FFB3]/10",
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.8, 1, 0.8] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Ghost
          className={cn(
            "w-6 h-6 transition-colors duration-300",
            isActive ? "text-[#FF005C]" : "text-[#00FFB3]",
          )}
        />
      </motion.div>
    </motion.button>
  )
}
