import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Radar - Descubrí quién está cerca",
  description: "App social de geolocalización para descubrir y conectar con personas cercanas",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body>{children}</body>
    </html>
  )
}
