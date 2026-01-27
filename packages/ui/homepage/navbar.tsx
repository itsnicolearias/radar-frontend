"use client"

import { RadarIcon } from "lucide-react"
import { ButtonNew } from "./ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg border-b border-white/5 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00FFB3] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,255,179,0.3)]">
              <RadarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">Radar</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-white/70 hover:text-[#00FFB3] transition-colors text-sm font-medium">
              Funcionalidades
            </a>
            <a href="#como-funciona" className="text-white/70 hover:text-[#00FFB3] transition-colors text-sm font-medium">
              Cómo funciona
            </a>
            <a href="#eventos" className="text-white/70 hover:text-[#00FFB3] transition-colors text-sm font-medium">
              Eventos
            </a>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <ButtonNew
              asChild
              variant="ghost"
              size="sm"
            >
              <a href="/login">Iniciar sesión</a>
            </ButtonNew>
            <ButtonNew
              asChild
              size="default"
              className="h-10 sm:h-11"
            >
              <a href="/register">Unirme</a>
            </ButtonNew>
          </div>
        </div>
      </div>
    </nav>
  )
}
