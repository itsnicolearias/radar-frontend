"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { SendSignalModal, RadarSignalMarker, GhostButton, InvisibleBadge } from "@radar/ui"
import { SignalDetailModal } from "../../../packages/ui/signals/signal-detail-modal.native"
import { EventDetailModal } from "../../../packages/ui/events/event-detail-modal.native"
import { useRadarStore, useAuthStore, useSocket, useSocketEvent, useChatStore } from "@radar/features"
import { radarService, signalService } from "@radar/api"
import type { IEventResponse, IRadarUser, IRadarSignal } from "@radar/types"
import { AnimatePresence } from "framer-motion"
import { Radio } from "lucide-react-native"

const { width, height } = Dimensions.get("window")

export default function RadarScreen() {
  const router = useRouter()
  const { user, isVisible, toggleVisibility } = useAuthStore()
  const [showInvisibleBadge, setShowInvisibleBadge] = useState(false)
  const { setReplyingToSignal } = useChatStore()
  const {
    nearbyUsers,
    nearbySignals,
    nearbyEvents,
    currentLocation,
    setNearbyUsers,
    setNearbyEvents,
    setNearbySignals,
    setCurrentLocation,
    addNearbySignal,
    updateUserLocation,
  } = useRadarStore()

  const [isSendSignalModalOpen, setIsSendSignalModalOpen] = useState(false)
  const [selectedSignal, setSelectedSignal] = useState<IRadarSignal | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<IEventResponse | null>(null)
  const socket = useSocket()

  useEffect(() => {
    const fetchNearbyData = async () => {
      if (!currentLocation || !isVisible) return

      try {
        const {users, events, signals} = await radarService.getNearby(currentLocation.latitude, currentLocation.longitude)
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
  }, [currentLocation, isVisible, setNearbyUsers, setNearbyEvents, setNearbySignals])

  const handleToggleVisibility = async () => {
    const wasVisible = isVisible
    await toggleVisibility()
    if (wasVisible) {
      setShowInvisibleBadge(true)
      setTimeout(() => setShowInvisibleBadge(false), 3000)
    }
  }

  const handleSendSignal = async (note?: string) => {
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

  const renderUserMarker = (nearbyUser: IRadarUser, index: number) => {
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

  const handleSignalClick = (signal: IRadarSignal) => {
    setSelectedSignal(signal)
  }

  const handleRespond = (signal: IRadarSignal) => {
    setReplyingToSignal(signal)
    router.push(`/chats/${signal.senderId}`)
    setSelectedSignal(null)
  }

  const handleEventClick = (event: IEventResponse) => {
    setSelectedEvent(event)
  }

  const renderEventMarker = (event: IEventResponse, index: number) => {
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
        onPress={() => handleEventClick(event)}
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


          <GhostButton onClick={handleToggleVisibility} isActive={!isVisible} />
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileInitial}>{"U"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Radar Canvas */}
      <View style={styles.radarContainer}>
        <AnimatePresence>{showInvisibleBadge && <InvisibleBadge />}</AnimatePresence>
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
        {isVisible && nearbyUsers.map(renderUserMarker)}

        {/* Nearby events */}
        {isVisible && nearbyEvents.map(renderEventMarker)}

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
        <TouchableOpacity
          style={styles.sendSignalButton}
          onPress={() => setIsSendSignalModalOpen(true)}
        >
          <LinearGradient
            colors={["#00FFB3", "#1DE3F2"]}
            style={styles.sendSignalButtonGradient}
          >
            <Radio color="black" style={{ width: 32, height: 32, position: "relative", zIndex: 10 }} />
          </LinearGradient>
        </TouchableOpacity>
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
          onRespond={() => handleRespond(selectedSignal)}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 179, 0.2)",
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
    backgroundColor: "#000000",
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
    color: "#000000",
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
    backgroundColor: "#FF005C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF005C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  userInitials: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  signalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 0, 92, 0.2)",
    borderRadius: 20,
  },
  signalButtonText: {
    color: "#FF005C",
    fontWeight: "600",
  },
  eventMarker: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00FFB3",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  eventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000000",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 255, 179, 0.2)",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
  },
  navIconActive: {
    backgroundColor: "#00FFB3",
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8B8B8B",
  },
  navLabelActive: {
    color: "#00FFB3",
  },
  sendSignalButton: {
    position: "absolute",
    bottom: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: "#00FFB3",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  sendSignalButtonGradient: {
    flex: 1,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00FFB3",
  },
})
