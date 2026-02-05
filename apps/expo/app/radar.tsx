"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import { Radio, MapPin, RefreshCcw } from "lucide-react-native"
import { useRadarStore, useAuthStore, useSocketEvent, useChatStore, useConnectionStore } from "@radar/features"
import { connectionService, profileViewService, radarService, signalService } from "@radar/api"
import type { IRadarUser, IRadarSignal, IEventResponse, IConnectionResponse } from "@radar/types"
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
import { WelcomeModalNative } from "../../../packages/ui/modals/welcome-modal.native"
import { RadarCompassNative } from "../../../packages/ui/radar/radar-compass.native"
import { calculateBearing } from "../../../lib/utils/calculate-bearing"

const MAX_USERS_ON_RADAR = 15
const MAX_EVENTS_ON_RADAR = 8

const { width, height } = Dimensions.get("window")
const RADAR_SIZE = width * 0.85
const center = RADAR_SIZE / 2
const WAVE_SIZE = RADAR_SIZE * 0.35
const RING_STEPS = [0.25, 0.4, 0.55, 0.7]
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const RADIAL_JITTER = 6
const ANGLE_JITTER = Math.PI / 36

const hashToUnit = (value: string, salt = ""): number => {
  let hash = 0
  const input = `${value}:${salt}`
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0
  }
  return Math.abs(hash % 1000) / 1000
}

function getMarkerPositionFromBearing(
  userLat: number | undefined,
  userLon: number | undefined,
  targetLat: number | null,
  targetLon: number | null,
  distance: number,
  maxDistance: number,
  jitterAmount: number = 0
) {
  // Si no tenemos coordenadas, retornar posición default
  if (!userLat || !userLon || targetLat === null || targetLon === null) {
    return { x: center, y: center }
  }

  // Calcular bearing entre usuario y target
  const bearing = calculateBearing(userLat, userLon, targetLat, targetLon)
  
  // Aplicar jitter determinístico
  const angle = bearing + jitterAmount

  // Normalizar distancia a radio del radar
  const normalizedDistance = Math.min(distance / maxDistance, 1)
  const radius = normalizedDistance * (center * 0.7) // 70% del radio disponible

  // Convertir coordenadas polares a cartesianas
  // Ajustar para que Norte (0 radianes) apunte arriba (eje Y negativo)
  const x = center + radius * Math.sin(angle)
  const y = center - radius * Math.cos(angle)

  return { x, y }
}

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
    setNearbySignals,
    setCurrentLocation,
    addNearbySignal,
    updateUserLocation,
    setNearbyEvents,
  } = useRadarStore()
  const { getLocalConnectionState, setLocalConnectionState, removeConnection, connections, setConnections } =
    useConnectionStore()

  const [radiusKm, setRadiusKm] = useState(10)
  const [isSendSignalModalOpen, setIsSendSignalModalOpen] = useState(false)
  const [selectedSignal, setSelectedSignal] = useState<IRadarSignal | null>(null)
  const [selectedUser, setSelectedUser] = useState<IRadarUser | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<IEventResponse | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [pendingsConnections, setPendingsConnections] = useState<IConnectionResponse[]>([])
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchMessage, setSearchMessage] = useState("")
  const [newMarkersCount, setNewMarkersCount] = useState(0)
  const [newMarkerIds, setNewMarkerIds] = useState<Set<string>>(new Set())
  const [radarLayout, setRadarLayout] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)


  const searchMessages = [
    "Buscando nuevas señales",
    "Detectando señales en el Radar",
    "Escuchando nuevas señales",
    "Rastreando usuarios cercanos",
    "Explorando el área",
    "Señales en detección",
  ]

  const fetchNearbyData = async () => {
    if (!currentLocation) return

    setIsSearching(true)
    try {
      const { users, events, signals } = await radarService.getNearby(
        currentLocation.latitude,
        currentLocation.longitude,
        radiusKm * 1000,
      )

      const previousUserIds = new Set(nearbyUsers.map((u) => u.userId))
      const newUsers = users.filter((u) => !previousUserIds.has(u.userId))
      const newIds = new Set(newUsers.map((u) => u.userId))

      setNewMarkerIds(newIds)
      setNewMarkersCount(newUsers.length)
      setNearbyUsers(users)
      setNearbySignals(signals)
      setNearbyEvents(events)

      const friends = await connectionService.getAcceptedConnections()
      setConnections(friends)

      const pendings = await connectionService.getMyPendingConnections()
      setPendingsConnections(pendings)

      setTimeout(() => {
        setNewMarkerIds(new Set())
        setNewMarkersCount(0)
      }, 3000)
    } catch (error) {
      console.error("[v0] Error fetching nearby data:", error)
    } finally {
      setTimeout(() => setIsSearching(false), 2000)
    }
  }

  useEffect(() => {
    if (isVisible) {
      fetchNearbyData()
    } else {
      setNearbyUsers([])
      setNearbyEvents([])
      setNearbySignals([])
    }
  }, [currentLocation, isVisible, radiusKm, setNearbyUsers, setNearbyEvents, setNearbySignals])

  useEffect(() => {
    if (!isSearching) return

    let index = 0
    const messageTimer = setInterval(() => {
      setSearchMessage(searchMessages[index])
      index = (index + 1) % searchMessages.length
    }, 2000)

    return () => clearInterval(messageTimer)
  }, [isSearching])

  const handleSendSignal = async (note?: string, quickReply?: string, availableToChat?: boolean, inPark?: boolean) => {
    try {
      setIsScanning(true)
      const newSignal = await signalService.sendSignal(note)
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

  useEffect(() => {
    if (user && user.isVerified === false && !user.displayName && !showWelcomeModal) {
      setShowWelcomeModal(true)
    }
  }, [])

  const getRingPosition = (
    ringIndex: number,
    indexInRing: number,
    totalInRing: number,
    userId: string,
    userLat?: number,
    userLon?: number,
    targetLat?: number | null,
    targetLon?: number | null,
    distance?: number
  ) => {
    // Calcular jitter determinístico basado en userId
    const jitterAngle = (hashToUnit(userId, "a") - 0.5) * ANGLE_JITTER

    // Usar bearing geográfico si tenemos coordenadas válidas
    const hasBearingData = userLat && userLon && targetLat !== null && targetLon !== null
    
    if (hasBearingData && distance) {
      return getMarkerPositionFromBearing(userLat, userLon, targetLat, targetLon, distance, radiusKm * 1000, jitterAngle)
    }

    // Fallback a posicionamiento relativo si no hay bearing
    const baseRadius = center * RING_STEPS[ringIndex]
    const offset = ringIndex * (Math.PI / 6)
    const angle = indexInRing * GOLDEN_ANGLE + offset + jitterAngle
    const radius = baseRadius + (hashToUnit(userId, "r") - 0.5) * 2 * RADIAL_JITTER

    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    }
  }


  const handleRespond = (signal: IRadarSignal) => {
    setReplyingToSignal(signal)
    router.push(`/chats/${signal.senderId}?signalId=${signal.signalId}`)
    setSelectedSignal(null)
  }

  const handleViewProfile = async (userId: string) => {
    setSelectedSignal(null)
    const foundUser = nearbyUsers.find((u) => u.userId === userId)
    if (foundUser) {
      setSelectedUser(foundUser)
    }
    try {
      await profileViewService.registerProfileView(userId)
    } catch (error) {
      console.error("Error registering profile view:", error)
    }
  }

  const handleSelectUser = async (user: IRadarUser) => {
    setSelectedUser(user)
    try {
      await profileViewService.registerProfileView(user.userId)
    } catch (error) {
      console.error("Error registering profile view:", error)
    }
  }

  const handleMessageUser = (userId: string) => {
    setSelectedUser(null)
    router.push(`/chats/${userId}`)
  }

  const isUserConnected = (userId: string): boolean => {
    const isConnected = connections.some((c) => c.receiverId === userId || c.senderId === userId)
    return isConnected
  }

  const handleConnect = async (receiverId: string) => {
    try {
      await connectionService.createConnection(receiverId!)
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const handleDeleteConnection = async (userId: string) => {
    try {
      const conecc = connections.find((c) => c.receiverId === userId || c.senderId === userId)
      if (!conecc) return
      const { connectionId } = conecc
      await connectionService.deleteConnection(connectionId)
      removeConnection(connectionId)
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const isTheConnectionPending = (userId: string): boolean => {
    const isPending = pendingsConnections.some((c) => c.receiverId === userId)
    return isPending
  }

  const usersToRender = [...nearbyUsers]
    .filter((u) => typeof u.distance === "number")
    .sort((a, b) => a.distance - b.distance)
    .slice(0, MAX_USERS_ON_RADAR)

  const ringsCount = RING_STEPS.length
  const ringBuckets: IRadarUser[][] = Array.from({ length: ringsCount }, () => [])

  const usersSortedByDistance = usersToRender.slice().sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance
    return (a.userId || "").localeCompare(b.userId || "")
  })

  usersSortedByDistance.forEach((u, rank) => {
    const t = usersSortedByDistance.length > 0 ? rank / usersSortedByDistance.length : 1
    const ringIndex = Math.min(ringsCount - 1, Math.floor(t * ringsCount))
    ringBuckets[ringIndex].push(u)
  })

  const eventsToRender = [...nearbyEvents].slice(0, MAX_EVENTS_ON_RADAR)


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.radiusInfo}>
            <MapPin color="#00FFB3" size={14} />
            <Text style={styles.radiusLabel}>{radiusKm} km</Text>
          </View>
        </View>
        <Text style={styles.title}>RADAR</Text>
        <View style={styles.headerRight}>
          <GhostButton onPress={toggleVisibility} isActive={!isVisible} />
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

      {isSearching && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -20 }}
          style={styles.searchingBadge}
        >
          <Text style={styles.searchingText}>{searchMessage}</Text>
        </MotiView>
      )}

      {!isVisible && <InvisibleBadge />}

      <View
        style={styles.radarContainer}
        onLayout={(e) => {
          const { x, y, width, height } = e.nativeEvent.layout
          setRadarLayout({ x, y, width, height })
        }}
      >

        <View
        style={{
          width: RADAR_SIZE,
          height: RADAR_SIZE,
          position: "relative",
        }}
      >
        {/* COMPASS */}
        <RadarCompassNative />

        {[...Array(8)].map((_, i) => (
          <MotiView
            key={`particle-${i}`}
            from={{
              opacity: 0.2,
              translateX: Math.random() * width - width / 2,
              translateY: Math.random() * height - height / 2,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              translateX: [
                Math.random() * width - width / 2,
                Math.random() * width - width / 2,
                Math.random() * width - width / 2,
              ],
              translateY: [
                Math.random() * height - height / 2,
                Math.random() * height - height / 2,
                Math.random() * height - height / 2,
              ],
            }}
            transition={{
              type: "timing",
              duration: 10000 + Math.random() * 5000,
              loop: true,
            }}
            style={styles.particle}
          />
        ))}

        {[0, 1, 2].map((i) => (
          <MotiView
            key={i}
            from={{ scale: 0.7, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              type: "timing",
              duration: 3500,
              delay: i * 1000,
              loop: true,
            }}
             style={[
              {
                position: "absolute",
                width: WAVE_SIZE,
                height: WAVE_SIZE,
                borderRadius: WAVE_SIZE / 2,
                left: center - WAVE_SIZE / 2,
                top: center - WAVE_SIZE / 2,
                borderWidth: 3,
                borderColor: "rgba(0,255,179,0.4)",
              },
              isScanning && styles.scanWaveActive,
            ]}
          />
        ))}

      {[0.35, 0.6, 0.85].map((scale, i) => {
        const size = RADAR_SIZE * scale

        return (
          <View
            key={i}
            style={[
              styles.radarCircle,
              {
                width: size,
                height: size,
                left: center - size / 2,
                top: center - size / 2,
              },
            ]}
          />
        )
      })}


      <View
        style={{
          position: "absolute",
          left: center,
          top: center,
          transform: [{ translateX: -32 }, { translateY: -32 }], // 64 / 2
          zIndex: 20,
        }}
      >
        <CentralUserMarkerNative
          initial={user?.displayName?.[0]?.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || "U"}
        />
      </View>

      {isVisible &&
        ringBuckets.map((bucket, ringIndex) => {
          const count = bucket.length || 1
          return bucket.map((nearbyUser, indexInRing) => {
            const hasSignal = nearbySignals.some(
              (s) => s.senderId === nearbyUser.userId,
            )

            const findSignal = nearbySignals.find(
              (s) => s.senderId === nearbyUser.userId,
            )

            const position = getRingPosition(
              ringIndex,
              indexInRing,
              count,
              nearbyUser.userId,
              currentLocation?.latitude,
              currentLocation?.longitude,
              nearbyUser.lastLatitude,
              nearbyUser.lastLongitude,
              nearbyUser.distance,
            )

            const isNew = newMarkerIds.has(nearbyUser.userId)

            return (
              <View key={nearbyUser.userId}>
                {isNew && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={[
                      styles.newBadge,
                      {
                        left: position.x - 30,
                        top: position.y - 60,
                      },
                    ]}
                  >
                    <Text style={styles.newBadgeText}>Nuevo!</Text>
                  </MotiView>
                )}

                <UserMarkerNative
                  user={nearbyUser}
                  position={position}
                  hasSignal={hasSignal}
                  onPress={() => handleSelectUser(nearbyUser)}
                  index={indexInRing}
                  onSelectSignal={() => setSelectedSignal(findSignal!)}
                />
              </View>
            )
          })
        })}
  </View>


     {/**  
      {isVisible &&
  eventsToRender.map((event, index) => {
    const position = getMarkerPosition(
      index,
      eventsToRender.length,
      event.distance || 5000,
      "event",
    )

    return (
      <EventMarkerNative
        key={event.eventId}
        event={event}
        position={position}
        onPress={() => setSelectedEvent(event)}
        index={index}
      />
    )
  })} **/}


      <TouchableOpacity style={styles.sendSignalButton} onPress={() => setIsSendSignalModalOpen(true)}>
          <MotiView
            animate={{
              scale: isScanning ? 1.2 : 1,
            }}
            transition={{
              type: "timing",
              duration: 1000,
              loop: true,
            }}
            style={styles.sendSignalPulse}
          />
          <LinearGradient colors={["#00FFB3", "#1DE3F2"]} style={styles.sendSignalGradient}>
            <Radio color="#000000" size={28} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.refreshButton} onPress={fetchNearbyData} disabled={isSearching}>
          {newMarkersCount > 0 && (
            <View style={styles.refreshBadge}>
              <Text style={styles.refreshBadgeText}>{newMarkersCount}</Text>
            </View>
          )}
          <MotiView
            animate={{
              rotate: isSearching ? "360deg" : "0deg",
            }}
            transition={{
              type: "timing",
              duration: 1000,
              loop: isSearching,
            }}
          >
            <RefreshCcw color="#00FFB3" size={20} />
          </MotiView>
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
          isUserConnected={isUserConnected(selectedSignal.senderId)}
          sendConnection={() => handleConnect(selectedSignal.senderId)}
          isConnectionPending={() => isTheConnectionPending(selectedSignal.senderId)}
        />
      )}

      {selectedUser && (
        <UserProfileModalNative
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onMessage={() => handleMessageUser(selectedUser.userId)}
          isUserConnected={() => isUserConnected(selectedUser.userId)}
          sendConnection={() => handleConnect(selectedUser.userId)}
          deleteConnection={() => handleDeleteConnection(selectedUser.userId)}
          isConnectionPending={() => isTheConnectionPending(selectedUser.userId)}
        />
      )}

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

      {showWelcomeModal && (
        <WelcomeModalNative
          isOpen={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
          userDisplayName={user?.displayName}
          userEmailConfirmed={user?.isVerified}
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "rgba(26, 26, 26, 0.5)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 179, 0.2)",
  },
  headerLeft: {
    flex: 1,
  },
  radiusInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  headerRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  radiusLabel: {
    color: "#00FFB3",
    fontSize: 12,
    fontWeight: "600",
  },
  radiusFilter: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 6,
  },
  radiusButton: {
    flex: 1,
    paddingVertical: 3,
    borderRadius: 10,
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
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  radiusButtonText: {
    color: "#C5C5C5",
    fontSize: 12,
    fontWeight: "500",
  },
  radiusButtonTextActive: {
    color: "#000000",
    fontSize: 12,
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
  width: RADAR_SIZE * 0.3,
  height: RADAR_SIZE * 0.3,
  borderRadius: (RADAR_SIZE * 0.3) / 2,
  borderWidth: 3,
  borderColor: "rgba(0, 255, 179, 0.4)",
  left: RADAR_SIZE / 2 - (RADAR_SIZE * 0.3) / 2,
  top: RADAR_SIZE / 2 - (RADAR_SIZE * 0.3) / 2,
},

  scanWaveActive: {
    borderColor: "rgba(0, 255, 179, 0.7)",
    borderWidth: 5,
  },
  radarCircle: {
    position: "absolute",
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: "rgba(0, 255, 179, 0.2)",
  },
  centralUserWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  sendSignalButton: {
    position: "absolute",
    bottom: 32,
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  sendSignalPulse: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(0, 255, 179, 0.3)",
  },
  sendSignalGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  searchingBadge: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    backgroundColor: "rgba(0, 255, 179, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00FFB3",
    zIndex: 50,
  },
  searchingText: {
    color: "#00FFB3",
    fontSize: 12,
    fontWeight: "600",
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#00FFB3",
  },
  newBadge: {
    position: "absolute",
    backgroundColor: "#00FFB3",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 100,
  },
  newBadgeText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "700",
  },
  refreshButton: {
    position: "absolute",
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1A1A1A",
    borderWidth: 2,
    borderColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  refreshBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF4FD8",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 40,
  },
  refreshBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
})
