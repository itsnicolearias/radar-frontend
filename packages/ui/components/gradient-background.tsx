import type React from "react"
export function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full bg-background flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,179,0.12)_0%,transparent_70%)]" />
      {children}
    </div>
  )
}
