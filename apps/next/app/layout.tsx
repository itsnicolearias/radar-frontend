import type React from "react"
import type { Metadata } from "next"
import { Providers } from "./providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Radar - Descubrí quién está cerca tuyo",
  description: "Explorá tu entorno, conectá con personas y descubrí eventos en tiempo real con Radar.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-black text-white">
        <Providers>
          <div className="relative min-h-screen overflow-hidden">
            {/* Background Radial Gradient as per Style Guide */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.12) 0%, transparent 70%)',
              }}
            />
            <div className="relative z-10 min-h-screen flex flex-col">
              {children}
            </div>
          </div>
        </Providers>
        <div id="modal-root" />
      </body>
    </html>
  )
}
