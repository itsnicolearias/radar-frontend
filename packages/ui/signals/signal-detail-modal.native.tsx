import type React from "react"
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from "react-native"
import { X, MessageCircle, User, Heart, Clock } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated"
import type { IRadarSignal } from "@radar/types"
import { useConnectionStore } from "@radar/features"

interface SignalDetailModalNativeProps {
  signal: IRadarSignal
  onClose: () => void
  onRespond: (signal: IRadarSignal) => void
  onViewProfile: () => void
  isUserConnected?: boolean
  sendConnection?: () => void
  isConnectionPending: () =>  boolean
}

export const SignalDetailModalNative: React.FC<SignalDetailModalNativeProps> = ({
  signal,
  onClose,
  onRespond,
  onViewProfile,
  isUserConnected,
  sendConnection,
  isConnectionPending,
}) => {
  const scale = useSharedValue(1)
  const connected = isUserConnected || false
  const { getLocalConnectionState, setLocalConnectionState, removeConnection } = useConnectionStore()
  
  const localState = getLocalConnectionState(signal.Sender.userId)
  const isPending = localState === "pending" || isConnectionPending()

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handleSendConnection = () => {
    if (sendConnection) {
      scale.value = withSpring(1.1, {}, () => {
        scale.value = withSpring(1)
      })
      sendConnection()
      setLocalConnectionState(signal.Sender.userId, "pending")
    }
  }

  const getTimeAgo = () => {
    const now = new Date()
    const signalTime = new Date(signal.createdAt)
    const diffMs = now.getTime() - signalTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) return `Hace ${diffMins} min`
    const diffHours = Math.floor(diffMins / 60)
    return `Hace ${diffHours}h`
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return "Cerca"
    if (distance < 1000) return `${Math.round(distance)}m`
    return `${(distance / 1000).toFixed(1)}km`
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              {signal?.Sender?.Profile?.photoUrl ? (
                <Image source={{ uri: signal?.Sender?.Profile?.photoUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{signal.Sender.displayName?.[0]?.toUpperCase() || "U"}</Text>
              )}
              <View style={styles.onlineIndicator} />
            </View>

            <View style={styles.userDetails}>
              <Text style={styles.userName}>{signal.Sender?.displayName}</Text>
              <Text style={styles.distance}>{formatDistance(signal.distance)}</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="#8B8B8B" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{signal.note}</Text>
            </View>
            <Text style={styles.timeAgo}>{getTimeAgo()}</Text>
          </View>

          <View style={styles.actions}>
            {connected ? (
              <TouchableOpacity style={styles.respondButton} onPress={() => onRespond(signal)}>
                <LinearGradient
                  colors={["#00FFB3", "#1DE3F2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.respondButtonGradient}
                >
                  <MessageCircle color="#000000" size={20} />
                  <Text style={styles.respondButtonText}>Responder señal</Text>
                </LinearGradient>
              </TouchableOpacity>
             ) : isPending ? (
              <View style={styles.pendingButton}>
                <Clock color="#EAB308" size={20} />
                <Text style={styles.pendingButtonText}>Pendiente</Text>
              </View>
            ) : (
              <Animated.View style={animatedStyle}>
                <TouchableOpacity style={styles.sendRequestButton} onPress={handleSendConnection}>
                  <Heart color="#FF005C" size={20} />
                  <Text style={styles.sendRequestText}>Enviar solicitud</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            <TouchableOpacity style={styles.profileButton} onPress={onViewProfile}>
              <User color="#C5C5C5" size={20} />
              <Text style={styles.profileButtonText}>Ver perfil</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(38, 38, 38, 0.98)",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF005C",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#00FFB3",
    borderWidth: 2,
    borderColor: "#262626",
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: "#8B8B8B",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 92, 0.4)",
  },
  statusIcon: {
    fontSize: 14,
  },
  statusText: {
    color: "#f8f5f5",
    fontSize: 12,
    fontWeight: "600",
  },
  timeAgo: {
    color: "#8B8B8B",
    fontSize: 12,
  },
  actions: {
    width: "100%",
    gap: 12,
    marginBottom: 16,
  },
  respondButton: {
    borderRadius: 999,
    overflow: "hidden",
  },
  respondButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  respondButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "rgba(197, 197, 197, 0.1)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(197, 197, 197, 0.3)",
    gap: 8,
  },
  profileButtonText: {
    color: "#C5C5C5",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelText: {
    color: "#8B8B8B",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  sendRequestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#1A1A1A",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 92, 0.4)",
    gap: 8,
  },
  sendRequestText: {
    color: "#FF005C",
    fontWeight: "bold",
    fontSize: 16,
  },
  pendingButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.4)",
    marginBottom: 40,
  },
  pendingButtonText: {
    color: "#EAB308",
    fontWeight: "600",
    fontSize: 16,
  },
})
