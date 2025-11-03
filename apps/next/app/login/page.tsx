"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GradientBackground, Button, Input, Label } from "@radar/ui"
import { authService } from "@radar/api"
import { loginSchema, type LoginInput } from "@radar/types/validations/auth"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useAuthStore } from "@radar/features"

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
      setAuth(response.user, response.profile || null, response.token)
      router.push("/radar")
    } catch (error: any) {
      setErrors({ email: error.response?.data?.message || "Error al iniciar sesión" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GradientBackground>
      <div className="relative z-10 min-h-screen px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </Link>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold">Iniciar sesión</h1>
              <p className="text-muted-foreground">Ingresá a tu cuenta de Radar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              ¿No tenés cuenta?{" "}
              <Link href="/register" className="text-primary hover:underline font-semibold">
                Registrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GradientBackground>
  )
}
