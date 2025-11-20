"use client"

import type React from "react"

import { motion } from "framer-motion"
import type { IRadarUser } from "@radar/types"

interface UserMarkerProps {
  user: IRadarUser
  position: { x: number; y: number }
  hasSignal: boolean
  onClick: () => void
  index: number
}

export const UserMarker: React.FC<UserMarkerProps> = ({ user, position, hasSignal, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 5,
      }}
    >
      {/* Signal indicator icon above user */}
      {hasSignal && (
        <motion.div
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg z-10"
          animate={{
            y: [0, -4, 0],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          🎵
        </motion.div>
      )}

      <motion.button
        onClick={onClick}
        className="relative w-12 h-12 rounded-full flex items-center justify-center font-semibold text-black text-sm border-2 cursor-pointer bg-white"
        style={{
          borderColor: "#00FFB3",
          boxShadow: "0 0 15px rgba(0, 255, 179, 0.5)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {user.displayName?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase()}
      </motion.button>
    </motion.div>
  )
}
