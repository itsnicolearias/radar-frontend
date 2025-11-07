"use client"

import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import { authService } from "@radar/api"
import { useAuthStore } from "@radar/features"

export default function LoginScreen() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    setLoading(true)
    try {
      const response = await authService.login({ email, password })

      setAuth(response.data.user, null, response.data.token)
      router.replace("/radar")
    } catch (error) {
      Alert.alert("Error", "Credenciales inválidas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>Bienvenido de vuelta</Text>

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

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#64748B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

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
    backgroundColor: "#0A1628",
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F8FAFC",
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
  },
  form: {
    gap: 16,
  },
  input: {
    height: 56,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingHorizontal: 16,
    color: "#F8FAFC",
    fontSize: 16,
  },
  button: {
    height: 56,
    backgroundColor: "#14B8A6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
})
