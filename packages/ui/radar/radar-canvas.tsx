"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "../lib/utils"

interface RadarCanvasProps {
  className?: string
  pulseSpeed?: number
}

export const RadarCanvas: React.FC<RadarCanvasProps> = ({ className, pulseSpeed = 2000 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(centerX, centerY) - 20

    let pulseOffset = 0

    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw concentric circles
      const numCircles = 5
      for (let i = 1; i <= numCircles; i++) {
        const radius = (maxRadius / numCircles) * i
        const opacity = 0.1 + (pulseOffset % 1) * 0.1

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 255, 179, ${opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      pulseOffset += 0.01
      animationRef.current = requestAnimationFrame(drawRadar)
    }

    drawRadar()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [pulseSpeed])

  return <canvas ref={canvasRef} width={400} height={400} className={cn("absolute inset-0 w-full h-full", className)} />
}
