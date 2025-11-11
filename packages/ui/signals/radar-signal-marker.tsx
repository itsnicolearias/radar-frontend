import React from "react"
import { View } from "react-native"
import { motion } from "framer-motion"

interface RadarSignalMarkerProps {
  distance: number
  angle: number
  onClick?: () => void
}

export const RadarSignalMarker: React.FC<RadarSignalMarkerProps> = ({ distance, angle, onClick }) => {
  const markerStyle = {
    transform: `rotate(${angle}deg) translateX(${distance}px)`,
  }

  return (
    <motion.div
      style={markerStyle}
      className="absolute top-1/2 left-1/2 w-4 h-4 bg-cyan-400 rounded-full"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    />
  )
}
