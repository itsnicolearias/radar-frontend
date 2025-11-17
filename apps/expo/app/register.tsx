"use client"

import { View, Text, Alert, ScrollView } from "react-native"
import { useState } from "react"
import { Link, useRouter } from "expo-router"
import { authService } from "@radar/api"
import { useAuthStore } from "@radar/features"
import { GradientBackground, Button, Input, Label } from "@radar/ui"
import { RegisterInput, registerSchema } from "../../../../packages/api/validations"

export default function RegisterScreen() {
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

  const handleSubmit = async () => {
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
      router.replace("/radar")
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Error al registrarse")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={{ padding: 24, justifyContent: "center", flexGrow: 1 }}>
        <View className="w-full max-w-md space-y-8">
          <View className="items-center space-y-2">
            <Text className="text-4xl font-bold text-primary text-center">Creá tu cuenta en Radar</Text>
            <Text className="text-muted-foreground text-center">Es rápido, fácil y gratis.</Text>
          </View>

          <View className="space-y-4">
            <View className="flex-row gap-4">
              <View className="flex-1 space-y-2">
                <Label>Nombre</Label>
                <Input
                  placeholder="Tu nombre"
                  value={formData.firstName}
                  onChangeText={(firstName) => setFormData({ ...formData, firstName })}
                  editable={!isLoading}
                />
                {errors.firstName && <Text className="text-sm text-destructive pt-1">{errors.firstName}</Text>}
              </View>
              <View className="flex-1 space-y-2">
                <Label>Apellido</Label>
                <Input
                  placeholder="Tu apellido"
                  value={formData.lastName}
                  onChangeText={(lastName) => setFormData({ ...formData, lastName })}
                  editable={!isLoading}
                />
                {errors.lastName && <Text className="text-sm text-destructive pt-1">{errors.lastName}</Text>}
              </View>
            </View>

            <View className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="ejemplo@radar.com"
                value={formData.email}
                onChangeText={(email) => setFormData({ ...formData, email })}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.email && <Text className="text-sm text-destructive pt-1">{errors.email}</Text>}
            </View>

            <View className="space-y-2">
              <Label>Contraseña</Label>
              <Input
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChangeText={(password) => setFormData({ ...formData, password })}
                secureTextEntry
                editable={!isLoading}
              />
              {errors.password && <Text className="text-sm text-destructive pt-1">{errors.password}</Text>}
            </View>

            <View className="space-y-2">
              <Label>Confirmar Contraseña</Label>
              <Input
                placeholder="Repetí tu contraseña"
                value={formData.confirmPassword}
                onChangeText={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
                secureTextEntry
                editable={!isLoading}
              />
              {errors.confirmPassword && (
                <Text className="text-sm text-destructive pt-1">{errors.confirmPassword}</Text>
              )}
            </View>

            <Button onPress={handleSubmit} disabled={isLoading} className="w-full">
              <Text className="text-lg font-semibold text-primary-foreground">
                {isLoading ? "Creando tu cuenta..." : "Crear Cuenta"}
              </Text>
            </Button>
          </View>

          <Text className="text-center text-sm text-muted-foreground">
            ¿Ya tenés una cuenta?{" "}
            <Link href="/login" className="font-bold text-primary">
              <Text>Iniciá Sesión</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </GradientBackground>
  )
}
