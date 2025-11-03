"use client"

import { useEffect, useState } from "react"

interface RadarCircleProps {
  nearbyCount: number
}

export function RadarCircle({ nearbyCount }: RadarCircleProps) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 1000)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Outer circles */}
      <div className="absolute w-80 h-80 rounded-full border border-primary/20" />
      <div className="absolute w-64 h-64 rounded-full border border-primary/30" />
      <div className="absolute w-48 h-48 rounded-full border border-primary/40" />

      {/* Center glow */}
      <div
        className={`absolute w-32 h-32 rounded-full bg-primary/20 blur-2xl transition-all duration-1000 ${pulse ? "scale-150 opacity-100" : "scale-100 opacity-50"}`}
      />

      {/* Center circle with count */}
      <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/50">
        <span className="text-4xl font-bold text-white">{nearbyCount}</span>
      </div>

      {/* Scanning line */}
      <div
        className={`absolute w-1 h-40 bg-gradient-to-t from-primary to-transparent origin-bottom transition-transform duration-2000 ${pulse ? "rotate-180" : "rotate-0"}`}
        style={{ transformOrigin: "bottom center" }}
      />
    </div>
  )
}
