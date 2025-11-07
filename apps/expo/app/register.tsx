"use client"

import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import { authService } from "@radar/api"
import { useAuthStore } from "@radar/features"

export default function RegisterScreen() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden")
      return
    }

    if (password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres")
      return
    }

    setLoading(true)
    try {
      const response = await authService.register({ firstName, lastName, email, password })
      setAuth(response.data.user, null, response.data.token)
      router.replace("/radar")
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la cuenta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>Únete a Radar</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#64748B"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Apellido"
          placeholderTextColor="#64748B"
          value={lastName}
          onChangeText={setLastName}
        />

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

        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#64748B"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Cargando..." : "Registrarme"}</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1628",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 48,
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
