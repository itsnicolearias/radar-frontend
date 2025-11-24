"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button, Input, Label } from "@radar/ui"
import { authService } from "@radar/api"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from "@radar/features"
import { LoginInput, loginSchema } from "../../../../packages/api/validations"

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validation = loginSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {}
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginInput] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.login(formData)

      setAuth(response.data.user,  null, response.data.token)
      router.push("/radar")
    } catch (error: any) {
      setErrors({ email: error.response?.data?.message || "Error al iniciar sesión" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#00FFB3]/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 min-h-screen px-6 py-8 flex flex-col">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#C5C5C5] hover:text-[#00FFB3] transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </Link>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-white">Iniciar sesión</h1>
              <p className="text-[#C5C5C5]">Ingresá a tu cuenta de Radar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 bg-[#1A1A1A] border border-[#1DE3F2]/30 rounded-2xl text-white placeholder-[#C5C5C5]/40 focus:border-[#00FFB3] focus:outline-none transition-all"
                />
                {errors.email && <p className="text-sm text-[#FF005C]">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 bg-[#f8f5f5] border border-[#1DE3F2]/30 rounded-2xl text-white placeholder-[#C5C5C5]/40 focus:border-[#00FFB3] focus:outline-none transition-all"
                />
                {errors.password && <p className="text-sm text-[#FF005C]">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-[#00FFB3]/50 active:scale-95"
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>

            <p className="text-center text-sm text-[#C5C5C5]">
              ¿No tenés cuenta?{" "}
              <Link href="/register" className="text-[#00FFB3] hover:text-[#1DE3F2] underline font-semibold transition-colors">
                Registrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
