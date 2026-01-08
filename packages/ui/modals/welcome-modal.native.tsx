import type React from "react"
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native"
import { X, Mail, User, Sparkles } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from "react-native-reanimated"

interface WelcomeModalNativeProps {
  isOpen: boolean
  onClose: () => void
  userDisplayName?: string | null
  userEmailConfirmed?: boolean
}

export const WelcomeModalNative: React.FC<WelcomeModalNativeProps> = ({
  isOpen,
  onClose,
  userDisplayName,
  userEmailConfirmed,
}) => {
  if (!isOpen) return null

  const needsDisplayName = !userDisplayName || userDisplayName.trim() === ""
  const needsEmailConfirmation = !userEmailConfirmed

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View entering={SlideInUp} exiting={SlideOutDown} style={styles.modal}>
          <LinearGradient colors={["#0A0E12", "#0F2B33"]} style={styles.gradient}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="#FFFFFF" size={24} />
            </TouchableOpacity>

            <View style={styles.content}>
              <LinearGradient colors={["#00FFB3", "#1DE3F2"]} style={styles.iconContainer}>
                <Sparkles color="#000000" size={40} />
              </LinearGradient>

              <Text style={styles.title}>¡Bienvenido a RADAR!</Text>

              <Text style={styles.subtitle}>
                Para ser visible en el radar y conectar con personas cercanas, necesitas completar estos pasos:
              </Text>

              <View style={styles.stepsContainer}>
                {needsEmailConfirmation && (
                  <View style={styles.stepCard}>
                    <View style={styles.stepIcon}>
                      <Mail color="#00FFB3" size={20} />
                    </View>
                    <View style={styles.stepText}>
                      <Text style={styles.stepTitle}>Confirma tu email</Text>
                      <Text style={styles.stepDescription}>
                        Revisa tu bandeja de entrada y haz clic en el enlace de confirmación
                      </Text>
                    </View>
                  </View>
                )}

                {needsDisplayName && (
                  <View style={styles.stepCard}>
                    <View style={styles.stepIcon}>
                      <User color="#00FFB3" size={20} />
                    </View>
                    <View style={styles.stepText}>
                      <Text style={styles.stepTitle}>Elige tu apodo</Text>
                      <Text style={styles.stepDescription}>
                        Ve a tu perfil y configura el nombre visible que verán otros usuarios
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <TouchableOpacity onPress={onClose} style={styles.button}>
                <LinearGradient
                  colors={["#00FFB3", "#1DE3F2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Entendido</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    overflow: "hidden",
  },
  gradient: {
    padding: 32,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#C5C5C5",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  stepsContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 32,
  },
  stepCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "rgba(26, 26, 26, 0.5)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
    gap: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 255, 179, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#C5C5C5",
    lineHeight: 20,
  },
  button: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
})
