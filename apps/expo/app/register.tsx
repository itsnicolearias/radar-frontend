"use client"

import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import { authService } from "@radar/api"
import { useAuthStore } from "@radar/features"
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native"

export default function RegisterScreen() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (!acceptedTerms) {
      Alert.alert("Error", "Debés aceptar los términos y condiciones para continuar")
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
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#00FFB3" />
      </TouchableOpacity>

      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>Unite a Radar y empezá a conectar</Text>

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

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#64748B"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <Eye size={20} color="#C5C5C5" /> : <EyeOff size={20} color="#C5C5C5" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAcceptedTerms(!acceptedTerms)}>
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.checkboxTextContainer}>
            <Text style={styles.checkboxText}>
              Al crear una cuenta, confirmo que soy mayor de 18 años y acepto los{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/terms-conditions")}>
              <Text style={styles.link}>Términos y Condiciones</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxText}> y la </Text>
            <TouchableOpacity onPress={() => router.push("/privacy-policy")}>
              <Text style={styles.link}>Política de Privacidad</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxText}> de Radar.</Text>
          </View>
        </TouchableOpacity>

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
    backgroundColor: "#000000",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(29, 227, 242, 0.3)",
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#00FFB3",
    borderColor: "#00FFB3",
  },
  checkmark: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  checkboxText: {
    fontSize: 12,
    color: "#C5C5C5",
    lineHeight: 18,
  },
  link: {
    fontSize: 12,
    color: "#00FFB3",
    lineHeight: 18,
    textDecorationLine: "underline",
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
