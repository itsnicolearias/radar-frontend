"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { SendSignalModal, RadarSignalMarker } from "@radar/ui"
import { SignalDetailModal } from "../../../packages/ui/signals/signal-detail-modal.native"
import { useRadarStore, useAuthStore, useSocket, useSocketEvent } from "@radar/features"
import { radarService, signalService } from "@radar/api"
import type { NearbyUser, Event, ISignal } from "@radar/types"

const { width, height } = Dimensions.get("window")

export default function RadarScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
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

  const [isSendSignalModalOpen, setIsSendSignalModalOpen] = useState(false)
  const [selectedSignal, setSelectedSignal] = useState<ISignal | null>(null)
  const socket = useSocket()

  useEffect(() => {
    const fetchNearbyData = async () => {
      if (!currentLocation) return

      try {
        const {users, events, signals} = await radarService.getNearbyAll(currentLocation.latitude, currentLocation.longitude)
        setNearbyUsers(users)
        setNearbyEvents(events)
        setNearbySignals(signals)
      } catch (error) {
        console.error("[v0] Error fetching nearby data:", error)
      }
    }

    fetchNearbyData()
  }, [currentLocation, setNearbyUsers, setNearbyEvents, setNearbySignals])

  const handleSendSignal = async (note: string | null) => {
    try {
      const newSignal = await signalService.sendSignal(note)
      addNearbySignal(newSignal)
    } catch (error) {
      console.error("[v0] Error sending signal:", error)
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
    if (!currentLocation) {
      setCurrentLocation({ latitude: user?.lastLatitude!, longitude: user?.lastLongitude! })
    }
  }, [currentLocation, setCurrentLocation])

  const renderUserMarker = (nearbyUser: NearbyUser, index: number) => {
    const angle = (index / nearbyUsers.length) * Math.PI * 2
    const normalizedDistance = Math.min(nearbyUser.distance / 1000, 1)
    const radius = normalizedDistance * (width * 0.35)
    const x = width / 2 + radius * Math.cos(angle)
    const y = height / 2 - 100 + radius * Math.sin(angle)

    return (
      <TouchableOpacity
        key={nearbyUser.userId}
        style={[styles.userMarker, { left: x - 24, top: y - 24 }]}
        onPress={() => router.push(`/profile/${nearbyUser.userId}`)}
      >
        <Text style={styles.userInitials}>
          {nearbyUser.firstName[0]}
          {nearbyUser.lastName[0]}
        </Text>
      </TouchableOpacity>
    )
  }

  const handleSignalClick = (signal: ISignal) => {
    setSelectedSignal(signal)
  }

  const handleRespond = (signalId: string) => {
    // Implement respond logic here
    console.log("Responding to signal:", signalId)
    setSelectedSignal(null)
  }

  const renderEventMarker = (event: Event, index: number) => {
    const angle = ((index + 0.5) / nearbyEvents.length) * Math.PI * 2
    const distance = 500 + Math.random() * 300
    const normalizedDistance = Math.min(distance / 1000, 1)
    const radius = normalizedDistance * (width * 0.35)
    const x = width / 2 + radius * Math.cos(angle)
    const y = height / 2 - 100 + radius * Math.sin(angle)

    return (
      <TouchableOpacity
        key={event.eventId}
        style={[styles.eventMarker, { left: x - 20, top: y - 20 }]}
        onPress={() => router.push(`/events/${event.eventId}`)}
      >
        <View style={styles.eventDot} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Radar</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <TouchableOpacity onPress={() => setIsSendSignalModalOpen(true)} style={styles.signalButton}>
            <Text style={styles.signalButtonText}>Señales: {nearbySignals.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileInitial}>{"U"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Radar Canvas */}
      <View style={styles.radarContainer}>
        {/* Concentric circles */}
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={[
              styles.radarCircle,
              {
                width: (width * 0.7 * i) / 5,
                height: (width * 0.7 * i) / 5,
              },
            ]}
          />
        ))}

        {/* Current user */}
        <View style={styles.currentUser}>
          <Text style={styles.currentUserInitials}>{user && user?.firstName && user.lastName ? `${user.firstName[0]}${user?.lastName[0]}` : "TÚ"}</Text>
        </View>
        <Text style={styles.currentUserLabel}>Tú</Text>

        {/* Nearby users */}
        {nearbyUsers.map(renderUserMarker)}

        {/* Nearby events */}
        {nearbyEvents.map(renderEventMarker)}

        {/* Nearby signals */}
        {nearbySignals.map((signal, index) => {
          const angle = ((index + 0.25) / nearbySignals.length) * Math.PI * 2
          return (
            <RadarSignalMarker
              key={signal.signalId}
              distance={signal.distance}
              angle={angle}
              onClick={() => handleSignalClick(signal)}
            />
          )
        })}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/radar")}>
          <View style={[styles.navIcon, styles.navIconActive]} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/chats")}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/events")}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Eventos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/profile")}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Send Signal Modal */}
      {isSendSignalModalOpen && (
        <SendSignalModal
          onClose={() => setIsSendSignalModalOpen(false)}
          onSend={handleSendSignal}
        />
      )}

      {/* Signal Detail Modal */}
      {selectedSignal && (
        <SignalDetailModal
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
          onRespond={handleRespond}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E2A3E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  radarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  radarCircle: {
    position: "absolute",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.15)",
  },
  currentUser: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00FFB3",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  currentUserInitials: {
    color: "#0E2A3E",
    fontSize: 18,
    fontWeight: "bold",
  },
  currentUserLabel: {
    position: "absolute",
    top: "50%",
    marginTop: 40,
    color: "#00FFB3",
    fontSize: 12,
    fontWeight: "600",
  },
  userMarker: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00FFB3",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  userInitials: {
    color: "#0E2A3E",
    fontSize: 14,
    fontWeight: "bold",
  },
  signalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(0, 255, 179, 0.2)",
    borderRadius: 20,
  },
  signalButtonText: {
    color: "#00FFB3",
    fontWeight: "600",
  },
  eventMarker: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF4FD8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF4FD8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  eventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#5A6E7A",
  },
  navIconActive: {
    backgroundColor: "#00FFB3",
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#5A6E7A",
  },
  navLabelActive: {
    color: "#00FFB3",
  },
})
