"use client"

import type React from "react"

export const RadarCompass: React.FC = () => {
  return (
    <div
      className="absolute z-20 flex items-center justify-center pointer-events-none select-none"
      style={{ top: 4, right: 16, width: 96, height: 96 }}
    >
      {/* Outer ring */}
      <div
        className="absolute w-full h-full rounded-full"
        style={{ border: "2px solid rgba(0, 255, 179, 0.4)" }}
      />

      {/* Compass rose with cardinal directions */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* North */}
        <div
          className="absolute text-[#00FFB3] font-bold"
          style={{ top: 8, fontSize: 14 }}
        >
          N
        </div>

        {/* East */}
        <div
          className="absolute text-[#00FFB3] font-bold"
          style={{ right: 8, fontSize: 14 }}
        >
          E
        </div>

        {/* South */}
        <div
          className="absolute text-[#00FFB3] font-bold"
          style={{ bottom: 8, fontSize: 14 }}
        >
          S
        </div>

        {/* West */}
        <div
          className="absolute text-[#00FFB3] font-bold"
          style={{ left: 8, fontSize: 14 }}
        >
          O
        </div>

        {/* Inner circle decorative line */}
        <div
          className="absolute w-8 h-8 rounded-full"
          style={{ border: "1px solid rgba(0, 255, 179, 0.3)" }}
        />

        {/* Center dot */}
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(0, 255, 179, 0.8)" }} />
      </div>
    </div>
  )
}
