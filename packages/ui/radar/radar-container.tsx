"use client"

import type React from "react"
import { cn } from "../lib/utils"
import { RadarCanvas } from "./radar-canvas"
import { RadarSignalMarker } from "../signals/radar-signal-marker"

interface RadarContainerProps {
  children: React.ReactNode
  className?: string
}

export const RadarContainer: React.FC<RadarContainerProps> = ({ children, className }) => {
  return (
    <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
      <RadarCanvas />
      <div className="relative w-full h-full max-w-md max-h-[600px]">
        {children}
        {process.env.IS_TEST && (
          <RadarSignalMarker
            distance={100}
            angle={0}
            note="This is a test signal"
            onClick={() => {}}
          />
        )}
      </div>
    </div>
  )
}
