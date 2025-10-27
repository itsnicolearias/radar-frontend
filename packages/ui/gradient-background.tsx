import type { ReactNode } from "react"

interface GradientBackgroundProps {
  children: ReactNode
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      {children}
    </div>
  )
}
