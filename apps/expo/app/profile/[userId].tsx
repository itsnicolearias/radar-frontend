"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useAuthStore, useConnectionStore, useRadarStore } from "@radar/features"
import { connectionService, profileViewService } from "@radar/api"
import { IRadarUser } from "@radar/types"

export default function UserProfileScreen() {
  const router = useRouter()
  const { userId } = useLocalSearchParams<{ userId: string }>()

  const { connections } = useConnectionStore()
  const [ profileData, setProfileData ] = useState<IRadarUser | null>(null)
  const [ isConnected, setIsConnected ] = useState(false)
  const { user } = useAuthStore()
  const { nearbyUsers } = useRadarStore()

  
  useEffect(() => {
    const connected = connections.some((c) => c.receiverId === userId || c.senderId === userId)
    setIsConnected(connected)
  }, [connections, userId])


  useEffect(() => {
    const registerView = async () => {
      if (user && userId !== user.userId) {
        try {
          await profileViewService.registerProfileView(userId)
        } catch (error) {
          console.error("[v0] Error registering profile view:", error)
        }
      }
    }

    const findUser = () => {
      const user = nearbyUsers.find((u) => u.userId === userId)
      if (user) {
        setProfileData(user)
      }
    }

    registerView()
    findUser()
  }, [userId, user, nearbyUsers])

  const handleConnect = async () => {
    try {
      await connectionService.createConnection(userId!)
      alert("Solicitud enviada")
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{profileData.distance}m de distancia</Text>
        </View>

        <Text style={styles.name}>
          {profileData.firstName} {profileData.lastName}, {profileData.Profile.age}
        </Text>
        <Text style={styles.location}>{profileData.Profile.province}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intereses</Text>
          <View style={styles.interests}>
            {profileData.Profile.interests?.map((interest, index) => (
              <View key={index} style={styles.interestPill}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre mí</Text>
          <Text style={styles.bio}>{profileData.Profile.bio}</Text>
        </View>

        <View style={styles.actions}>
          {!isConnected && (
            <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
              <Text style={styles.connectText}>♥ Conectar</Text>
            </TouchableOpacity>
          )}
          {isConnected && (
            <TouchableOpacity style={styles.messageButton} onPress={() => router.push(`/chats/${userId}`)}>
              <Text style={styles.messageText}>💬 Enviar mensaje</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E2A3E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#1A3A52",
    borderRadius: 24,
    padding: 24,
    margin: 24,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  distanceText: {
    color: "#00FFB3",
    fontSize: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: "#D1D5DB",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    color: "#1A3A52",
    fontSize: 14,
    fontWeight: "500",
  },
  bio: {
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  connectButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#00FFB3",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
  },
  connectText: {
    color: "#00FFB3",
    fontSize: 16,
    fontWeight: "600",
  },
  messageButton: {
    backgroundColor: "#00FFB3",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
  },
  messageText: {
    color: "#1A3A52",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 100,
  },
})
