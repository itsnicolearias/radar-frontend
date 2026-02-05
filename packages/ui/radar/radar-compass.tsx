"use client"

import type React from "react"

export const RadarCompass: React.FC = () => {
  return (
    <div className="absolute top-2 right-2 z-20 w-14 h-14 flex items-center justify-center">
      {/* Outer ring */}
      <div className="absolute w-full h-full rounded-full border border-[#00FFB3]/40" />

      {/* Compass rose with cardinal directions */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* North */}
        <div className="absolute top-1 text-[#00FFB3] font-bold text-xs">N</div>

        {/* East */}
        <div className="absolute right-1 text-[#00FFB3] font-bold text-xs">E</div>

        {/* South */}
        <div className="absolute bottom-1 text-[#00FFB3] font-bold text-xs">S</div>

        {/* West */}
        <div className="absolute left-1 text-[#00FFB3] font-bold text-xs">O</div>

        {/* Center dot */}
        <div className="w-1 h-1 rounded-full bg-[#00FFB3]/60" />
      </div>
    </div>
  )
}
