"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function LandingNavbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full blur-sm opacity-70" />
              <div className="relative w-full h-full bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-black"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold text-white">Radar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="#funcionalidades" 
              className="text-sm text-gray-300 hover:text-[#00FFB3] transition-colors"
            >
              Funcionalidades
            </Link>
            <Link 
              href="#eventos" 
              className="text-sm text-gray-300 hover:text-[#00FFB3] transition-colors"
            >
              Eventos
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-black bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] hover:opacity-90 transition-opacity px-6 py-2 rounded-full"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
