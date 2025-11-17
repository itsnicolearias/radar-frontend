"use client"

import { View, Text, Alert } from "react-native"
import { useState } from "react"
import { Link, useRouter } from "expo-router"
import { authService } from "@radar/api"
import { useAuthStore } from "@radar/features"
import { GradientBackground, Button, Input, Label } from "@radar/ui"
import { LoginInput, loginSchema } from "../../../../packages/api/validations"

export default function LoginScreen() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
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
      router.replace("/radar")
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GradientBackground>
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-full max-w-md space-y-8">
          <View className="items-center space-y-2">
            <Text className="text-4xl font-bold text-primary">Iniciar sesión</Text>
            <Text className="text-muted-foreground">Ingresá a tu cuenta de Radar</Text>
          </View>

          <View className="space-y-6">
            <View className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="tu@email.com"
                value={formData.email}
                onChangeText={(email) => setFormData({ ...formData, email })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text className="text-sm text-destructive">{errors.email}</Text>}
            </View>

            <View className="space-y-2">
              <Label>Contraseña</Label>
              <Input
                placeholder="••••••••"
                value={formData.password}
                onChangeText={(password) => setFormData({ ...formData, password })}
                secureTextEntry
              />
              {errors.password && <Text className="text-sm text-destructive">{errors.password}</Text>}
            </View>

            <Button onPress={handleSubmit} disabled={isLoading} className="w-full">
              <Text className="text-lg font-semibold">
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Text>
            </Button>
          </View>

          <Text className="text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="text-primary font-semibold">
              <Text>Registrate</Text>
            </Link>
          </Text>
        </View>
      </View>
    </GradientBackground>
  )
}
