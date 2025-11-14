"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GradientBackground, Button, Input, Label } from "@radar/ui"
import { authService } from "@radar/api"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useAuthStore } from "@radar/features"
import { LoginInput, loginSchema } from "../../../../packages/api/validations"
import { motion } from 'framer-motion';

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

      setAuth(response.data.user, null, response.data.token)
      router.push("/radar")
    } catch (error: any) {
      setErrors({ email: error.response?.data?.message || "Error al iniciar sesión" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GradientBackground>
      <div className="relative z-10 min-h-screen px-6 py-8 text-white flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Bienvenido de vuelta</h1>
            <p className="text-white/60">Inicia sesión para ver quién está cerca.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Tu Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@radar.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-[#FF005C] pt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Tu Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-[#FF005C] pt-1">{errors.password}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <p className="text-center text-sm text-white/60">
            ¿Primera vez en Radar?{" "}
            <Link href="/register" className="font-bold text-[#00FFB3] hover:underline">
              Creá tu cuenta
            </Link>
          </p>
        </motion.div>
      </div>
    </GradientBackground>
  )
}
