"use client"

import type React from "react"
import { cn } from "../lib/utils"

interface RadarUserMarkerProps {
  initials: string
  distance: number
  angle: number
  maxDistance: number
  isCurrentUser?: boolean
  photoUrl?: string
  onClick?: () => void
  className?: string
}

export const RadarUserMarker: React.FC<RadarUserMarkerProps> = ({
  initials,
  distance,
  angle,
  maxDistance,
  isCurrentUser = false,
  photoUrl,
  onClick,
  className,
}) => {
  // Calculate position based on distance and angle
  const normalizedDistance = Math.min(distance / maxDistance, 1)
  const radius = normalizedDistance * 45 // 45% of container
  const x = 50 + radius * Math.cos(angle)
  const y = 50 + radius * Math.sin(angle)

  // Scale based on distance (closer = larger)
  const scale = isCurrentUser ? 1 : 0.7 + (1 - normalizedDistance) * 0.3

  return (
    <div
      className={cn(
        "absolute flex items-center justify-center rounded-full transition-all duration-300",
        isCurrentUser
          ? "w-16 h-16 bg-[#00FFB3] shadow-[0_0_20px_rgba(0,255,179,0.6)]"
          : "w-12 h-12 bg-[#00FFB3] shadow-[0_0_15px_rgba(0,255,179,0.4)] cursor-pointer hover:scale-110",
        className,
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
      onClick={onClick}
    >
      {photoUrl ? (
        <img src={photoUrl || "/placeholder.svg"} alt={initials} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span className="text-[#0E2A3E] font-bold text-sm">{initials}</span>
      )}
      {isCurrentUser && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[#00FFB3] text-xs font-semibold whitespace-nowrap">
          Tú
        </div>
      )}
    </div>
  )
}
