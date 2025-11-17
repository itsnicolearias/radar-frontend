import { View, Text, StyleSheet, Dimensions } from "react-native"
import { Link } from "expo-router"

const { width, height } = Dimensions.get("window")

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        {[...Array(12)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.4,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.radarPoint}>
          <View style={styles.radarPointGlow} />
          <View style={styles.radarPointInner} />
        </View>

        <Text style={styles.title}>RADAR</Text>

        <Text style={styles.subtitle}>Descubrí quién está cerca de vos en tiempo real</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/register" asChild>
          <View style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Registrarme</Text>
          </View>
        </Link>

        <Link href="/login" asChild>
          <View style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Iniciar sesión</Text>
          </View>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: "space-between",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  particle: {
    position: "absolute",
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#00FFB3",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    zIndex: 10,
  },
  radarPoint: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00FFB3",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 2,
    borderColor: "#1DE3F2",
  },
  radarPointGlow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 48,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#1DE3F2",
    opacity: 0.5,
  },
  radarPointInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1DE3F2",
  },
  title: {
    fontSize: 52,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 24,
    marginHorizontal: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
    zIndex: 10,
  },
  primaryButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#00FFB3",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00FFB3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: "100%",
    height: 48,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#00FFB3",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#00FFB3",
    letterSpacing: 0.5,
  },
})
