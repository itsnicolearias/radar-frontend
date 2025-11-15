"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GradientBackground, Button, Input, Label } from "@radar/ui"
import { authService } from "@radar/api"
import { useAuthStore } from "@radar/features"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { RegisterInput, registerSchema } from "../../../../packages/api/validations"
import { motion } from "framer-motion"

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [formData, setFormData] = useState<RegisterInput>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validation = registerSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {}
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof RegisterInput] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.register(formData)
      setAuth(response.user, null, response.token)
      router.push("/radar")
    } catch (error: any) {
      setErrors({ email: error.response?.data?.message || "Error al registrarse" })
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
            <h1 className="text-4xl font-bold">Creá tu cuenta en Radar</h1>
            <p className="text-white/60">Es rápido, fácil y gratis.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  placeholder="Tu nombre"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={isLoading}
                />
                {errors.firstName && <p className="text-sm text-[#FF005C] pt-1">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  placeholder="Tu apellido"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={isLoading}
                />
                {errors.lastName && <p className="text-sm text-[#FF005C] pt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-[#FF005C] pt-1">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repetí tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="text-sm text-[#FF005C] pt-1">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creando tu cuenta..." : "Crear Cuenta"}
            </Button>
          </form>

          <p className="text-center text-sm text-white/60">
            ¿Ya tenés una cuenta?{" "}
            <Link href="/login" className="font-bold text-[#00FFB3] hover:underline">
              Iniciá Sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </GradientBackground>
  )
}
