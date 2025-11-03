"use client"

import type React from "react"
import { cn } from "../lib/utils"

interface RadarEventMarkerProps {
  title: string
  distance: number
  angle: number
  maxDistance: number
  onClick?: () => void
  className?: string
}

export const RadarEventMarker: React.FC<RadarEventMarkerProps> = ({
  title,
  distance,
  angle,
  maxDistance,
  onClick,
  className,
}) => {
  const normalizedDistance = Math.min(distance / maxDistance, 1)
  const radius = normalizedDistance * 45
  const x = 50 + radius * Math.cos(angle)
  const y = 50 + radius * Math.sin(angle)

  return (
    <div
      className={cn(
        "absolute w-10 h-10 rounded-full bg-[#FF4FD8] shadow-[0_0_20px_rgba(255,79,216,0.6)] cursor-pointer transition-all duration-300 hover:scale-110 animate-pulse",
        className,
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
      title={title}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-white" />
      </div>
    </div>
  )
}
