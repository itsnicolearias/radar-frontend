"use client"

import { RadarIcon } from "lucide-react"
import { ButtonNew } from "./ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-[#1A1A1A]/50 backdrop-blur-lg border-b border-[#00FFB3]/20 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center">
              <RadarIcon className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Radar</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-[#C5C5C5] hover:text-[#00FFB3] transition-colors text-sm font-medium">
              Funcionalidades
            </a>
            <a href="#como-funciona" className="text-[#C5C5C5] hover:text-[#00FFB3] transition-colors text-sm font-medium">
              Cómo funciona
            </a>
            <a href="#eventos" className="text-[#C5C5C5] hover:text-[#00FFB3] transition-colors text-sm font-medium">
              Eventos
            </a>
          </div>
          <div className="flex items-center gap-4">
            <ButtonNew
              asChild
              variant="ghost"
              className="text-[#C5C5C5] hover:text-[#00FFB3] text-sm sm:text-base px-2 sm:px-4"
            >
              <a href="/login">Iniciar sesión</a>
            </ButtonNew>
            <ButtonNew
              asChild
              className="bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black text-sm sm:text-base px-4 py-2 h-10 rounded-full font-bold shadow-lg shadow-[#00FFB3]/30 hover:scale-105 transition-all"
            >
              <a href="/register">Registrarme</a>
            </ButtonNew>
          </div>
        </div>
      </div>
    </nav>
  )
}
