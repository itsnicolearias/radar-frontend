import React from "react"
import { motion } from "framer-motion"

interface RadarSignalMarkerProps {
  distance: number
  angle: number
  onClick?: () => void
}

export const RadarSignalMarker: React.FC<RadarSignalMarkerProps> = ({ distance, angle, onClick }) => {
  const markerStyle = {
    transform: `rotate(${angle}rad) translateX(${distance}px)`,
  }

  return (
    <motion.div
      style={markerStyle}
      className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#FF005C] rounded-full shadow-lg shadow-[#FF005C]/50 cursor-pointer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#FF005C]"
        animate={{ scale: [1, 2], opacity: [0.8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
    </motion.div>
  )
}
