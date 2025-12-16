"use client"

import type React from "react"

import { motion } from "framer-motion"
import type { IEventResponse } from "@radar/types"

interface EventMarkerProps {
  event: IEventResponse
  position: { x: number; y: number }
  onClick: () => void
  index: number
}

export const EventMarker: React.FC<EventMarkerProps> = ({ event, position, onClick, index }) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="absolute w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-2 bg-white font-semibold text-black text-sm"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        borderColor: "#FF005C",
        boxShadow: "0 0 15px rgba(255, 0, 92, 0.5)",
        zIndex: 5,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {event.title[0].toUpperCase()}
    </motion.button>
  )
}
