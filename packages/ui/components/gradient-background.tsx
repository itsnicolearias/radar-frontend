import type React from "react"
export function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full bg-black flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.12) 0%, transparent 70%)',
        }}
      />
      {children}
    </div>
  )
}
