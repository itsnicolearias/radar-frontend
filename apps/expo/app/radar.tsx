"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import { Radio } from "lucide-react-native"
import { useRadarStore, useAuthStore, useSocketEvent, useChatStore } from "@radar/features"
import { radarService, signalService } from "@radar/api"
import type { IRadarUser, IRadarSignal, IEventResponse } from "@radar/types"
import { BottomNavNative } from "../../../packages/ui/navigation/bottom-nav.native"
import { SendSignalModalNative } from "../../../packages/ui/signals/send-signal-modal.native"
import { SignalDetailModalNative } from "../../../packages/ui/signals/signal-detail-modal.native"
import { UserProfileModalNative } from "../../../packages/ui/profile/user-profile-modal.native"
import { EventDetailModal } from "../../../packages/ui/events/event-detail-modal.native"
import { UserMarkerNative } from "../../../packages/ui/radar/user-marker.native"
import { EventMarkerNative } from "../../../packages/ui/radar/event-marker.native"
import { CentralUserMarkerNative } from "../../../packages/ui/radar/central-user-marker.native"
import GhostButton from "../../../packages/ui/components/ghost-button.native"
import InvisibleBadge from "../../../packages/ui/components/invisible-badge.native"

const { width, height } = Dimensions.get("window")

export default function RadarScreen() {
  const router = useRouter()
  const { user, isVisible, toggleVisibility } = useAuthStore()
  const { setReplyingToSignal } = useChatStore()
  const {
    nearbyUsers,
    nearbyEvents,
    nearbySignals,
    currentLocation,
    setNearbyUsers,
    setNearbyEvents,
    setNearbySignals,
    setCurrentLocation,
    addNearbySignal,
    updateUserLocation,
  } = useRadarStore()

  const [radiusKm, setRadiusKm] = useState(10)
  const [isSendSignalModalOpen, setIsSendSignalModalOpen] = useState(false)
  const [selectedSignal, setSelectedSignal] = useState<IRadarSignal | null>(null)
  const [selectedUser, setSelectedUser] = useState<IRadarUser | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<IEventResponse | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    const fetchNearbyData = async () => {
      if (!currentLocation || !isVisible) return

      try {
        const { users, events, signals } = await radarService.getNearby(
          currentLocation.latitude,
          currentLocation.longitude,
          radiusKm * 1000,
        )
        setNearbyUsers(users)
        setNearbyEvents(events)
        setNearbySignals(signals)
      } catch (error) {
        console.error("[v0] Error fetching nearby data:", error)
      }
    }

    if (isVisible) {
      fetchNearbyData()
    } else {
      setNearbyUsers([])
      setNearbyEvents([])
      setNearbySignals([])
    }
  }, [currentLocation, isVisible, radiusKm, setNearbyUsers, setNearbyEvents, setNearbySignals])

  const handleSendSignal = async (note?: string, quickReply?: string, availableToChat?: boolean, inPark?: boolean) => {
    try {
      setIsScanning(true)
      const newSignal = await signalService.sendSignal(note, quickReply, availableToChat, inPark)
      addNearbySignal(newSignal)
      setTimeout(() => setIsScanning(false), 2000)
    } catch (error) {
      console.error("[v0] Error sending signal:", error)
      setIsScanning(false)
    }
  }

  useSocketEvent<{ userId: string; latitude: number; longitude: number }>(
    "location-updated",
    (data) => {
      updateUserLocation(data.userId, data.latitude, data.longitude)
    },
    [updateUserLocation],
  )

  useEffect(() => {
    if (!currentLocation && user) {
      setCurrentLocation({ latitude: user?.lastLatitude!, longitude: user?.lastLongitude! })
    }
  }, [currentLocation, setCurrentLocation, user])

  const getMarkerPosition = (index: number, total: number, distance: number, type: "user" | "event") => {
    const normalizedDistance = Math.min(distance / 1000 / radiusKm, 1)
    const minRadiusPercent = type === "event" ? 0.15 : 0.2
    const maxRadiusPercent = type === "event" ? 0.3 : 0.45
    const radiusPercent = minRadiusPercent + normalizedDistance * (maxRadiusPercent - minRadiusPercent)

    const angleOffset = type === "event" ? Math.PI / 4 : 0
    const angle = (index / Math.max(total, 1)) * Math.PI * 2 + angleOffset

    const radarSize = width * 0.7
    const centerX = width / 2
    const centerY = height / 2 - 80

    const x = centerX + radarSize * radiusPercent * Math.cos(angle)
    const y = centerY + radarSize * radiusPercent * Math.sin(angle)

    return { x, y }
  }

  const handleSignalClick = (signal: IRadarSignal) => {
    setSelectedSignal(signal)
  }

  const handleRespond = (signal: IRadarSignal) => {
    setReplyingToSignal(signal)
    router.push(`/chats/${signal.senderId}`)
    setSelectedSignal(null)
  }

  const handleViewProfile = (userId: string) => {
    setSelectedSignal(null)
    const foundUser = nearbyUsers.find((u) => u.userId === userId)
    if (foundUser) {
      setSelectedUser(foundUser)
    }
  }

  const handleMessageUser = (userId: string) => {
    setSelectedUser(null)
    router.push(`/chats/${userId}`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.radiusLabel}>Radio: {radiusKm} km</Text>
        </View>
        <Text style={styles.title}>RADAR</Text>
        <View style={styles.headerRight}>
          <GhostButton onPress={toggleVisibility} isActive={!isVisible} />
          <View style={styles.signalsBadge}>
            <Radio color="#FF005C" size={12} />
            <Text style={styles.signalsBadgeText}>{nearbySignals.length}</Text>
          </View>
        </View>
      </View>

      <View style={styles.radiusFilter}>
        {[2, 5, 10].map((km) => (
          <TouchableOpacity
            key={km}
            style={[styles.radiusButton, radiusKm === km && styles.radiusButtonActive]}
            onPress={() => setRadiusKm(km)}
          >
            {radiusKm === km ? (
              <LinearGradient colors={["#00FFB3", "#1DE3F2"]} style={styles.radiusButtonGradient}>
                <Text style={styles.radiusButtonTextActive}>{km} km</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.radiusButtonText}>{km} km</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {!isVisible && <InvisibleBadge />}

      <View style={styles.radarContainer}>
        {[0, 1, 2].map((i) => (
          <MotiView
            key={i}
            from={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              type: "timing",
              duration: 3000,
              delay: i * 1000,
              loop: true,
            }}
            style={[styles.scanWave, isScanning && styles.scanWaveActive]}
          />
        ))}

        {/* Concentric circles */}
        {[0.25, 0.5, 0.75].map((scale, i) => (
          <View
            key={i}
            style={[
              styles.radarCircle,
              {
                width: width * 0.7 * scale,
                height: width * 0.7 * scale,
              },
            ]}
          />
        ))}

        <View style={styles.centralUserWrapper}>
          <CentralUserMarkerNative
            initial={user?.displayName?.[0]?.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || "U"}
          />
        </View>

        {isVisible &&
          nearbyUsers.map((nearbyUser, index) => {
            const hasSignal = nearbySignals.some((s) => s.senderId === nearbyUser.userId)
            const position = getMarkerPosition(index, nearbyUsers.length, nearbyUser.distance, "user")
            return (
              <UserMarkerNative
                key={nearbyUser.userId}
                user={nearbyUser}
                position={position}
                hasSignal={hasSignal}
                onPress={() => setSelectedUser(nearbyUser)}
                index={index}
              />
            )
          })}

        {isVisible &&
          nearbyEvents &&
          nearbyEvents.map((event, index) => {
            const position = getMarkerPosition(index, nearbyEvents.length, event.distance || 5000, "event")
            return (
              <EventMarkerNative
                key={event.eventId}
                event={event}
                position={position}
                onPress={() => setSelectedEvent(event)}
                index={index}
              />
            )
          })}

        <TouchableOpacity style={styles.sendSignalButton} onPress={() => setIsSendSignalModalOpen(true)}>
          <MotiView
            from={{ scale: 1 }}
            animate={{ scale: 1.2 }}
            transition={{
              type: "timing",
              duration: 1000,
              loop: true,
            }}
            style={styles.sendSignalPulse}
          />
          <LinearGradient colors={["#00FFB3", "#1DE3F2"]} style={styles.sendSignalGradient}>
            <Radio color="#000000" size={32} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <BottomNavNative
        activeTab="radar"
        onTabChange={(tab) => {
          if (tab === "chats") router.push("/chats")
          else if (tab === "events") router.push("/events")
          else if (tab === "profile") router.push("/profile")
        }}
      />

      {isSendSignalModalOpen && (
        <SendSignalModalNative onClose={() => setIsSendSignalModalOpen(false)} onSend={handleSendSignal} />
      )}

      {selectedSignal && (
        <SignalDetailModalNative
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
          onRespond={() => handleRespond(selectedSignal)}
          onViewProfile={() => handleViewProfile(selectedSignal.senderId)}
        />
      )}

      {selectedUser && (
        <UserProfileModalNative
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onMessage={() => handleMessageUser(selectedUser.userId)}
        />
      )}

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "rgba(26, 26, 26, 0.5)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 179, 0.2)",
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  headerRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },
  radiusLabel: {
    color: "#00FFB3",
    fontSize: 12,
    fontWeight: "600",
  },
  signalsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 92, 0.3)",
  },
  signalsBadgeText: {
    color: "#FF005C",
    fontSize: 12,
    fontWeight: "600",
  },
  radiusFilter: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  radiusButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
    alignItems: "center",
  },
  radiusButtonActive: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  radiusButtonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  radiusButtonText: {
    color: "#C5C5C5",
    fontSize: 14,
    fontWeight: "500",
  },
  radiusButtonTextActive: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
  },
  radarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#000000",
  },
  scanWave: {
    position: "absolute",
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: (width * 0.35) / 2,
    borderWidth: 2,
    borderColor: "rgba(0, 255, 179, 0.3)",
  },
  scanWaveActive: {
    borderColor: "rgba(0, 255, 179, 0.6)",
    borderWidth: 4,
  },
  radarCircle: {
    position: "absolute",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.15)",
  },
  centralUserWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  sendSignalButton: {
    position: "absolute",
    bottom: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  sendSignalPulse: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 255, 179, 0.3)",
  },
  sendSignalGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
})
