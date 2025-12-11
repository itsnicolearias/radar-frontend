"use client"

import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native"
import { Link } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { MotiView, MotiText } from "moti"
import { Easing } from "react-native-reanimated"

const { width, height } = Dimensions.get("window")
const GLOW_SIZE = Math.max(width, height) * 1.2

// cantidad de partículas igual a Next.js
const PARTICLES = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: i * 500,
}))

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Glow central como en Next */}
      <View style={styles.radialGlow} pointerEvents="none" />

      {/* Partículas animadas */}
      {PARTICLES.map((p) => (
        <MotiView
          key={p.id}
          from={{ translateY: 0, opacity: 0.2, scale: 1 }}
          animate={{
            translateY: -30,
            opacity: 0.6,
            scale: 1.5,
          }}
          transition={{
            duration: 3000,
            delay: p.delay,
            repeat: Infinity,
            easing: Easing.inOut(Easing.ease),
          }}
          pointerEvents="none"
          style={[
            styles.particle,
            { left: `${p.x}%`, top: `${p.y}%` },
          ]}
        />
      ))}

      {/* CONTENIDO */}
      <View style={styles.content}>
        {/* Radar container */}
        <View style={styles.radarContainer}>
          {/* Anillos respirando */}
          {[1, 2, 3].map((ring) => (
            <MotiView
              key={ring}
              from={{ opacity: 0.2 }}
              animate={{ opacity: 0.5 }}
              transition={{
                duration: 3000,
                repeat: Infinity,
                delay: ring * 300,
                easing: Easing.inOut(Easing.ease),
              }}
              pointerEvents="none"
              style={[
                styles.ring,
                {
                  width: `${100 - ring * 20}%`,
                  height: `${100 - ring * 20}%`,
                  top: `${ring * 10}%`,
                  left: `${ring * 10}%`,
                },
              ]}
            />
          ))}

          {/* Sonar wave */}
          <MotiView
            from={{ scale: 0.3, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 3000,
              repeat: Infinity,
              easing: Easing.out(Easing.ease),
            }}
            pointerEvents="none"
            style={styles.sonarWave}
          />

          {/* Punto central */}
          <MotiView
            from={{
              scale: 1,
              shadowRadius: 10,
            }}
            animate={{
              scale: 1.2,
              shadowRadius: 20,
            }}
            transition={{
              duration: 2000,
              repeat: Infinity,
              easing: Easing.inOut(Easing.ease),
            }}
            pointerEvents="none"
            style={styles.centerDot}
          />

          {/* Scan line giratoria */}
          <MotiView
            from={{ rotate: "0deg" }}
            animate={{ rotate: "360deg" }}
            transition={{
              duration: 8000,
              repeat: Infinity,
              easing: Easing.linear,
            }}
            pointerEvents="none"
            style={styles.scanWrapper}
          >
            <View style={styles.scanLine} pointerEvents="none" />
          </MotiView>
        </View>

        {/* Título */}
        <MotiText
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 600 }}
          style={styles.title}
        >
          RADAR
        </MotiText>

        {/* Subtítulo */}
        <MotiText
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 600, delay: 150 }}
          style={styles.subtitle}
        >
          Descubrí quién está cerca de vos en tiempo real
        </MotiText>
      </View>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        {/* Registrarme */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 600, delay: 300 }}
        >
          <Link href="/register" asChild>
            <Pressable style={styles.primaryButton}>
              <LinearGradient
                colors={["#00FFB3", "#1DE3F2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryGradient}
              >
                <Text style={styles.primaryButtonText}>Registrarme</Text>
              </LinearGradient>
            </Pressable>
          </Link>
        </MotiView>

        {/* Iniciar sesión */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 600, delay: 450 }}
        >
          <Link href="/login" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Iniciar sesión</Text>
            </Pressable>
          </Link>
        </MotiView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
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
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00FFB3",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    zIndex: 10,
  },
  radarContainer: {
    width: 192,
    height: 192,
    marginBottom: 32,
    position: "relative",
  },
  ring: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 179, 0.3)",
    borderRadius: 9999,
  },
  sonarWave: {
    position: "absolute",
    inset: 0,
    borderWidth: 2,
    borderColor: "#00FFB3",
    borderRadius: 9999,
  },
  centerDot: {
  position: "absolute",
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: "#FF005C",
  shadowColor: "#FF005C",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 20,

  // centrado PERFECTO
  top: 84,   // (192 - 24) / 2
  left: 84,  // (192 - 24) / 2
},
  scanWrapper: {
    position: "absolute",
    inset: 0,
  },
  scanLine: {
  position: "absolute",
  top: 84,    // mismo centro real
  left: 96,   // OJO → porque la línea mide 2px de ancho y se centra con translateX
  width: 2,
  height: 96,
  backgroundColor: "rgba(0, 255, 179, 0.8)",

  transform: [
    { translateX: -1 },   // centrar
    { translateY: -96 },  // origen en base
  ],
},

  title: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#ffffffcc",
    fontSize: 16,
    textAlign: "center",
    maxWidth: width * 0.75,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 16,
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
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: "700",
  },
})
