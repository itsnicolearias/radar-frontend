"use client"

import { useState } from "react"
import { GradientBackground } from "@/components/ui/gradient-background"
import { RadarCircle } from "@/components/radar/radar-circle"
import { Button } from "@/components/ui/button"
import { Radar, MessageCircle, Users, User } from "lucide-react"
import Link from "next/link"

export default function RadarPage() {
  const [nearbyCount] = useState(10)

  return (
    <GradientBackground>
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">Radar</h1>
          <Button variant="ghost" size="icon">
            <User className="w-6 h-6" />
          </Button>
        </header>

        {/* Radar display */}
        <div className="flex-1 flex items-center justify-center px-6">
          <RadarCircle nearbyCount={nearbyCount} />
        </div>

        {/* Bottom navigation */}
        <nav className="bg-card/50 backdrop-blur-lg border-t border-border">
          <div className="flex items-center justify-around px-6 py-4">
            <Link href="/radar" className="flex flex-col items-center gap-1 text-primary">
              <Radar className="w-6 h-6" />
              <span className="text-xs font-medium">Radar</span>
            </Link>

            <Link
              href="/chats"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Chats</span>
            </Link>

            <Link
              href="/connections"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Conexiones</span>
            </Link>

            <Link
              href="/profile"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Perfil</span>
            </Link>
          </div>
        </nav>
      </div>
    </GradientBackground>
  )
}
