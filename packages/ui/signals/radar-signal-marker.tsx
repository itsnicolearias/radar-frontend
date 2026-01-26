"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { SignalPopover } from "./signal-popover"

interface RadarSignalMarkerProps {
  distance: number
  angle: number
  note?: string
  isNew?: boolean
  onClick?: () => void
}

export const RadarSignalMarker: React.FC<RadarSignalMarkerProps> = ({
  distance,
  angle,
  note,
  isNew,
  onClick,
}) => {
  const { useUIStore } = require("@radar/features")
  const { isModalOpen } = useUIStore()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const markerStyle = {
    transform: isModalOpen ? 'none' : `rotate(${angle}rad) translateX(${distance}px)`,
    pointerEvents: isModalOpen ? 'none' : 'auto',
    zIndex: isModalOpen ? 0 : undefined,
  }

  const handleMarkerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPopoverOpen(!isPopoverOpen)
    onClick?.()
  }

  return (
    <motion.div
      style={markerStyle}
      className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#FF005C] rounded-full shadow-lg shadow-[#FF005C]/50 cursor-pointer"
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        boxShadow: isNew
          ? [
              "0 0 20px rgba(255, 0, 92, 0.5)",
              "0 0 40px rgba(255, 0, 92, 0.8)",
              "0 0 20px rgba(255, 0, 92, 0.5)",
            ]
          : "0 0 10px rgba(255, 0, 92, 0.5)",
      }}
      transition={{
        duration: 0.5,
        boxShadow: {
          duration: 2,
          repeat: Infinity,
        },
      }}
      onClick={handleMarkerClick}
    >
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#FF005C]"
        animate={{ scale: [1, 2], opacity: [0.8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      {isPopoverOpen && <SignalPopover note={note} onClose={() => setIsPopoverOpen(false)} />}
    </motion.div>
  )
}
