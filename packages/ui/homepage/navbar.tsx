"use client"

import { RadarIcon } from "lucide-react"
import { ButtonNew } from "./ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#3EC8A7] rounded-full flex items-center justify-center">
              <RadarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-[#1E3A5F]">Radar</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-[#1E3A5F] hover:text-[#3EC8A7] transition-colors">
              Funcionalidades
            </a>
            <a href="#como-funciona" className="text-[#1E3A5F] hover:text-[#3EC8A7] transition-colors">
              Cómo funciona
            </a>
            <a href="#eventos" className="text-[#1E3A5F] hover:text-[#3EC8A7] transition-colors">
              Eventos
            </a>
          </div>
          <ButtonNew
            asChild
            className="bg-[#3EC8A7] hover:bg-[#35B396] text-white text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 h-9 sm:h-10"
          >
            <a href="#login">Iniciar sesion</a>
          </ButtonNew>

        </div>
      </div>
    </nav>
  )
}
