import type React from "react"
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Image } from "react-native"
import { X, MessageCircle, MapPin, Heart, HeartOff, Clock } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated"
import type { IRadarUser } from "@radar/types"
import { useConnectionStore } from "@radar/features"

interface UserProfileModalNativeProps {
  user: IRadarUser
  onClose: () => void
  onMessage: () => void
  isUserConnected: () => boolean
  sendConnection: () => void
  deleteConnection: () => void
  isConnectionPending: boolean
}

export const UserProfileModalNative: React.FC<UserProfileModalNativeProps> = ({
  user,
  onClose,
  onMessage,
  isUserConnected,
  sendConnection,
  deleteConnection,
  isConnectionPending,
}) => {
  const scale = useSharedValue(1)
  const { getLocalConnectionState, setLocalConnectionState } = useConnectionStore()

  const localState = getLocalConnectionState(user.userId)
  const connectionMade = localState === "connected" || isUserConnected()
  const isPending = localState === "pending" && isConnectionPending

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handleSendConnection = () => {
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1)
    })
    setLocalConnectionState(user.userId, "pending")
    sendConnection()
  }

  const handleDeleteConnection = () => {
    setLocalConnectionState(user.userId, null)
    deleteConnection()
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return "Cerca"
    if (distance < 50) return "50m"
    if (distance < 1000) return `${Math.round(distance)}m`
    return `${(distance / 1000).toFixed(1)}km`
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <LinearGradient
            colors={["#1DE3F2", "#00FFB3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <X color="#000000" size={28} />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.avatarContainer}>
            <View style={styles.avatarLarge}>
              {user.Profile?.photoUrl ? (
                <Image source={{ uri: user.Profile.photoUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarLargeText}>{user.displayName?.[0]?.toUpperCase() || "?"}</Text>
              )}
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.profileSection}>
              <View style={styles.distanceBadge}>
                <MapPin color="#00FFB3" size={16} />
                <Text style={styles.distanceText}>{formatDistance(user.distance)} de distancia</Text>
              </View>

              <Text style={styles.profileName}>
                {user.Profile.showAge ? `${user.displayName}, ${user.Profile.age}` : user.displayName}
              </Text>

              {user.Profile.showLocation && (
                <View style={styles.locationContainer}>
                  <MapPin color="#8B8B8B" size={16} />
                  <Text style={styles.locationText}>{user.Profile.province || "Cerca"}</Text>
                </View>
              )}
            </View>

            {user.Profile.interests && user.Profile.interests.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Intereses</Text>
                <View style={styles.interestsGrid}>
                  {user.Profile.interests.map((interest, index) => (
                    <View key={index} style={styles.interestChip}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {user.Profile.bio && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sobre mí</Text>
                <Text style={styles.aboutText}>{user.Profile.bio}</Text>
              </View>
            )}

            {connectionMade ? (
              <>
                <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
                  <LinearGradient
                    colors={["#00FFB3", "#1DE3F2"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.messageButtonGradient}
                  >
                    <MessageCircle color="#000000" size={20} />
                    <Text style={styles.messageButtonText}>Enviar mensaje</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteConnection}>
                  <HeartOff color="#FF005C" size={20} />
                  <Text style={styles.deleteButtonText}>Eliminar amigo</Text>
                </TouchableOpacity>
              </>
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000",
  },
  modal: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    height: 240,
    justifyContent: "flex-start",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 80, // Added padding to account for absolute avatar
  },
  avatarContainer: {
    position: "absolute",
    top: 180, // Position at bottom of gradient
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 0, // Removed negative margin since avatar is now absolute
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#000000",
  },
  avatarLargeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#000000",
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(0, 255, 179, 0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    marginBottom: 12,
  },
  distanceText: {
    color: "#00FFB3",
    fontSize: 14,
    fontWeight: "600",
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontSize: 16,
    color: "#8B8B8B",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  interestText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  aboutText: {
    fontSize: 16,
    color: "#C5C5C5",
    lineHeight: 24,
  },
  messageButton: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 999,
    overflow: "hidden",
  },
  messageButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  messageButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },
  likeButton: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 0, 92, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 92, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  deleteButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 92, 0.4)",
    marginBottom: 40,
  },
  deleteButtonText: {
    color: "#FF005C",
    fontWeight: "600",
    fontSize: 16,
  },
  sendRequestButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 92, 0.4)",
    marginBottom: 40,
  },
  sendRequestText: {
    color: "#FF005C",
    fontWeight: "600",
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
