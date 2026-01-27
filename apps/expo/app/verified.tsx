import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native"
import { Link } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { MotiView, MotiText } from "moti"
import { CheckCircle } from "lucide-react-native"
import { Easing } from "react-native-reanimated"

const { width, height } = Dimensions.get("window")
const GLOW_SIZE = Math.max(width, height) * 1.2

export default function VerifiedScreen() {
  return (
    <View style={styles.container}>
      {/* Background glow consistent with WelcomeScreen */}
      <View style={styles.radialGlow} />

      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 600 }}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              delay: 200,
            }}
          >
            <CheckCircle size={96} color="#00FFB3" />
          </MotiView>

          <MotiView
            from={{ opacity: 0.3, scale: 1 }}
            animate={{ opacity: 0.6, scale: 1.2 }}
            transition={{
              duration: 3000,
              repeat: Infinity,
              easing: Easing.inOut(Easing.ease),
            }}
            style={styles.iconGlow}
          />
        </View>

        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 600, delay: 300 }}
          style={styles.title}
        >
          ¡Felicidades!
        </MotiText>

        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 600, delay: 450 }}
          style={styles.subtitle}
        >
          Has verificado tu cuenta, ahora podrás ser visible para todos los usuarios de Radar.
        </MotiText>

        <View style={styles.buttonContainer}>
          <Link href="/register" asChild>
            <Pressable style={styles.primaryButton}>
              <LinearGradient
                colors={["#00FFB3", "#1DE3F2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryGradient}
              >
                <Text style={styles.primaryButtonText}>Registrarse</Text>
              </LinearGradient>
            </Pressable>
          </Link>

          <Link href="/login" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Iniciar sesión</Text>
            </Pressable>
          </Link>
        </View>
      </MotiView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  radialGlow: {
    position: "absolute",
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    backgroundColor: "rgba(0, 255, 179, 0.15)",
    top: (height - GLOW_SIZE) / 2,
    left: (width - GLOW_SIZE) / 2,
    zIndex: 0,
  },
  content: {
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 32,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 255, 179, 0.2)",
    zIndex: -1,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: "#C5C5C5",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 48,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 9999,
    overflow: "hidden",
  },
  primaryGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#00FFB3",
    fontSize: 18,
    fontWeight: "700",
  },
})
