"use client"

import { View, Text, TextInput, Pressable, StyleSheet, Alert, TouchableOpacity } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import { authService } from "@radar/api"
import { useAuthStore } from "@radar/features"
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native"

export default function LoginScreen() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    setLoading(true)
    try {
      const response = await authService.login({ email, password })

      setAuth(response.data.user, response.data.user.Profile!, response.data.token)
      router.replace("/radar")
    } catch (error) {
      Alert.alert("Error", "Credenciales inválidas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#00FFB3" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>Ingresá a tu cuenta de Radar</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#64748B"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              placeholderTextColor="#64748B"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <Eye size={20} color="#C5C5C5" /> : <EyeOff size={20} color="#C5C5C5" />}
            </TouchableOpacity>
          </View>

          <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Cargando..." : "Iniciar sesión"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#C5C5C5",
  },
  form: {
    gap: 16,
  },
  input: {
    height: 56,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#1DE3F2",
  },
  passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    height: 56,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#1DE3F2",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    padding: 8,
  },
  button: {
    height: 56,
    backgroundColor: "#00FFB3",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#00FFB3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
})
