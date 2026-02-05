"use client"

import type React from "react"

export const RadarCompass: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 z-20 w-24 h-24 flex items-center justify-center">
      {/* Outer ring */}
      <div className="absolute w-full h-full rounded-full border-2 border-[#00FFB3]/40" />

      {/* Compass rose with cardinal directions */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* North */}
        <div className="absolute top-2 text-[#00FFB3] font-bold text-sm">N</div>

        {/* East */}
        <div className="absolute right-2 text-[#00FFB3] font-bold text-sm">E</div>

        {/* South */}
        <div className="absolute bottom-2 text-[#00FFB3] font-bold text-sm">S</div>

        {/* West */}
        <div className="absolute left-2 text-[#00FFB3] font-bold text-sm">O</div>

        {/* Inner circle decorative line */}
        <div className="absolute w-8 h-8 rounded-full border border-[#00FFB3]/30" />

        {/* Center dot */}
        <div className="w-2 h-2 rounded-full bg-[#00FFB3]/80" />
      </div>
    </div>
  )
}
