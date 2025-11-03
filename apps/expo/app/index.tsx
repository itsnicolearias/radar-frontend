import { View, Text, Pressable, StyleSheet } from "react-native"
import { Link } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

export default function WelcomeScreen() {
  return (
    <LinearGradient colors={["#0A1628", "#0A1628", "#14B8A6"]} style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoCircle} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Radar</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Descubrí quién está cerca de vos</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Link href="/register" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Registrarme</Text>
          </Pressable>
        </Link>

        <Link href="/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Iniciar sesión</Text>
          </Pressable>
        </Link>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#14B8A6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#14B8A6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logoCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#F8FAFC",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#94A3B8",
    textAlign: "center",
    maxWidth: 300,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#14B8A6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#14B8A6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#14B8A6",
  },
})
