"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useRadarStore, useAuthStore, useSocket, useSocketEvent, useConnectionStore } from "@radar/features"
import { connectionService, profileViewService, radarService, signalService } from "@radar/api"
import type { IEventResponse, IRadarUser, IRadarSignal, IConnectionResponse } from "@radar/types"
import { BottomNav, GhostButton, InvisibleBadge, WelcomeModal } from "@radar/ui"
import { SendSignalModal } from "../../../../packages/ui/modals/send-signal-modal"
import { SignalDetailModal } from "../../../../packages/ui/signals/signal-detail-modal"
import { UserProfileModal } from "../../../../packages/ui/profile/user-profile-modal"
import { EventDetailModal } from "../../../../packages/ui/events/event-detail-modal"
import { UserMarker } from "../../../../packages/ui/radar/user-marker"
import { EventMarker } from "../../../../packages/ui/radar/event-marker"
import { CentralUserMarker } from "../../../../packages/ui/radar/central-user-marker"
import { AnimatePresence, motion } from "framer-motion"
import { Radio, MapPin } from "lucide-react"

export default function RadarPage() {
  const router = useRouter()
  const { user, isVisible, toggleVisibility } = useAuthStore()
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
  const { getLocalConnectionState, setLocalConnectionState, removeConnection, setConnections, connections } =
    useConnectionStore()

  const [radius, setRadius] = useState(10000) // default 10km
  const [selectedUser, setSelectedUser] = useState<IRadarUser | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<IEventResponse | null>(null)
  const [selectedSignal, setSelectedSignal] = useState<IRadarSignal | null>(null)
  const [pendingsConnections, setPendingsConnections] = useState<IConnectionResponse[]>(null)
  const [isSendSignalModalOpen, setIsSendSignalModalOpen] = useState(false)
  const [isAnimatingSignal, setIsAnimatingSignal] = useState(false)
  const socket = useSocket()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  const [isSearching, setIsSearching] = useState(false)
  const [searchMessage, setSearchMessage] = useState("")
  const [newMarkersCount, setNewMarkersCount] = useState(0)
  const [newMarkerIds, setNewMarkerIds] = useState<Set<string>>(new Set())
  const [countdown, setCountdown] = useState(30)

  const searchMessages = [
    "Buscando nuevas señales",
    "Detectando señales en el Radar",
    "Escuchando nuevas señales",
    "Rastreando usuarios cercanos",
    "Explorando el área",
    "Señales en detección",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchNearbyData()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!isSearching) return

    let index = 0
    const messageTimer = setInterval(() => {
      setSearchMessage(searchMessages[index])
      index = (index + 1) % searchMessages.length
    }, 2000)

    return () => clearInterval(messageTimer)
  }, [isSearching])

  const fetchNearbyData = async () => {
    if (!currentLocation || !isVisible) return

    setIsSearching(true)
    try {
      const { users, events, signals } = await radarService.getNearby(
        currentLocation.latitude || user.lastLatitude,
        currentLocation.longitude || user.lastLongitude,
        radius,
      )

      const previousUserIds = new Set(nearbyUsers.map((u) => u.userId))
      const newUsers = users.filter((u) => !previousUserIds.has(u.userId))
      const newIds = new Set(newUsers.map((u) => u.userId))

      setNewMarkerIds(newIds)
      setNewMarkersCount(newUsers.length)
      setNearbyUsers(users)
      setNearbyEvents(events)
      setNearbySignals(signals)

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
  }, [isVisible, radius, setNearbyUsers, setNearbyEvents, setNearbySignals])

  const handleSendSignal = async (note?: string) => {
    try {
      setIsAnimatingSignal(true)
      const newSignal = await signalService.sendSignal(note)
      addNearbySignal(newSignal)
      setTimeout(() => setIsAnimatingSignal(false), 2000)
    } catch (error) {
      console.error("[v0] Error sending signal:", error)
      setIsAnimatingSignal(false)
    }
  }

  const isUserConnected = (userId: string): boolean => {
    const isConnected = connections.some((c) => c.receiverId === userId || c.senderId === userId)
    return isConnected
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
      setCurrentLocation({ latitude: user.lastLatitude!, longitude: user.lastLongitude! })
    }
  }, [currentLocation, setCurrentLocation, user])

  const handleUserClick = async (nearbyUser: IRadarUser) => {
    setSelectedUser(nearbyUser)

    try {
      await profileViewService.registerProfileView(nearbyUser.userId)
    } catch (error) {
      console.error("Error registering profile view:", error)
    }
  }

  const handleEventClick = (event: IEventResponse) => {
    setSelectedEvent(event)
  }

  const handleSignalClick = async (senderId: string) => {
    const findUser = nearbyUsers.find((u) => u.userId === senderId)
    setSelectedUser(findUser)

    try {
      await profileViewService.registerProfileView(senderId)
    } catch (error) {
      console.error("Error registering profile view:", error)
    }
  }

  const handleRespond = (signal: IRadarSignal) => {
    router.push(`/chats/${signal.senderId}?signalId=${signal.signalId}`)
    setSelectedSignal(null)
  }

  const handleViewProfile = (userId: string) => {
    setSelectedSignal(null)
    router.push(`/profile/${userId}`)
  }

  const getMarkerPosition = (index: number, total: number, distance: number, type: "user" | "event") => {
    const normalizedDistance = Math.min(distance / radius, 1)
    // Events closer to center (15-30%), users further out (20-45%)
    const minRadius = type === "event" ? 15 : 20
    const maxRadius = type === "event" ? 30 : 45
    const radiusPercent = minRadius + normalizedDistance * (maxRadius - minRadius)

    // Distribute evenly around circle with offset to avoid center overlap
    const angleOffset = type === "event" ? Math.PI / 4 : 0
    const angle = (index / Math.max(total, 1)) * Math.PI * 2 + angleOffset

    const x = 50 + radiusPercent * Math.cos(angle)
    const y = 50 + radiusPercent * Math.sin(angle)

    return { x, y }
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
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const isTheConnectionPending = (userId: string): boolean => {
    const isPending = pendingsConnections.some((c) => c.receiverId === userId)
    return isPending
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.12) 0%, transparent 70%)",
        }}
      />

      <header className="relative z-20 bg-[#1A1A1A]/50 backdrop-blur-lg p-6 border-b border-[#00FFB3]/20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-sm text-white">
            <MapPin className="w-4 h-4 text-[#00FFB3]" />
            <span className="text-[#C5C5C5]">Radio:</span>
            <span className="text-[#00FFB3] font-semibold">{radius / 1000} km</span>
          </div>
          <h1 className="text-white font-bold text-xl absolute left-1/2 -translate-x-1/2">RADAR</h1>
          <div className="flex items-center gap-3">
            <GhostButton onClick={toggleVisibility} isActive={!isVisible} />
          </div>
        </div>

        {/* Radius filter */}
        <div className="flex gap-2">
          {[2000, 5000, 10000].map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                radius === r
                  ? "bg-linear-to-r from-[#00FFB3] to-[#1DE3F2] text-black"
                  : "bg-[#1A1A1A] text-[#C5C5C5] border border-[#00FFB3]/20"
              }`}
            >
              {r / 1000} km
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-32 left-1/2 -translate-x-1/2 bg-[#00FFB3]/20 backdrop-blur-sm px-6 py-3 rounded-full border border-[#00FFB3] z-50"
          >
            <p className="text-[#00FFB3] text-sm font-semibold">{searchMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isSearching && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 bg-[#1A1A1A]/80 backdrop-blur-sm px-5 py-2 rounded-full border border-[#00FFB3]/30 z-50">
          <p className="text-white text-xs font-medium">
            Próxima búsqueda en {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
          </p>
        </div>
      )}

      <AnimatePresence>{!isVisible && <InvisibleBadge />}</AnimatePresence>

      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-2xl aspect-square">
          {/* Scan wave animations - perfectly circular */}
          <AnimatePresence>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={`scan-${i}`}
                className="absolute inset-0 border-2 border-[#00FFB3] rounded-full"
                style={{
                  left: "25%",
                  top: "25%",
                  width: "50%",
                  height: "50%",
                }}
                animate={{
                  scale: [1, 2],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 1,
                  ease: "easeOut",
                }}
              />
            ))}
          </AnimatePresence>

          {/* Extra scan animation when sending signal */}
          {isAnimatingSignal && (
            <motion.div
              className="absolute inset-0 border-4 border-[#1DE3F2] rounded-full"
              style={{
                left: "20%",
                top: "20%",
                width: "60%",
                height: "60%",
              }}
              animate={{
                scale: [1, 1.5],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
            />
          )}

          {/* Concentric circles - perfectly circular */}
          {[25, 50, 75].map((size, i) => (
            <div
              key={`circle-${i}`}
              className="absolute border border-[#00FFB3] rounded-full opacity-20"
              style={{
                left: `${(100 - size) / 2}%`,
                top: `${(100 - size) / 2}%`,
                width: `${size}%`,
                height: `${size}%`,
              }}
            />
          ))}

          {/* Radar content */}
          <div className="relative w-full h-full">
            <CentralUserMarker
              initial={user?.displayName?.[0]?.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || "U"}
            />

            {isVisible &&
              nearbyUsers &&
              nearbyUsers.map((nearbyUser, index) => {
                const hasSignal = nearbySignals.some((s) => s.senderId === nearbyUser.userId)
                const findSignal = nearbySignals.findLast((s) => s.senderId === nearbyUser.userId)

                const position = getMarkerPosition(index, nearbyUsers.length, nearbyUser.distance, "user")
                const isNew = newMarkerIds.has(nearbyUser.userId)

                return (
                  <div key={nearbyUser.userId} className="relative">
                    {isNew && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute bg-[#00FFB3] px-3 py-1 rounded-full z-50"
                        style={{
                          left: `${position.x}%`,
                          top: `${position.y - 8}%`,
                          transform: "translate(-50%, -100%)",
                        }}
                      >
                        <p className="text-black text-[10px] font-bold">Nuevo!</p>
                      </motion.div>
                    )}
                    <UserMarker
                      user={nearbyUser}
                      position={position}
                      hasSignal={hasSignal}
                      onClick={() => handleUserClick(nearbyUser)}
                      index={index}
                      onSelectSignal={() => setSelectedSignal(findSignal)}
                    />
                  </div>
                )
              })}

            {isVisible &&
              nearbyEvents &&
              nearbyEvents.map((event, index) => {
                const position = getMarkerPosition(index, nearbyEvents.length, event.distance || 5000, "event")
                return (
                  <EventMarker
                    key={event.eventId}
                    event={event}
                    position={position}
                    onClick={() => handleEventClick(event)}
                    index={index}
                  />
                )
              })}
          </div>
        </div>

        <motion.button
          onClick={fetchNearbyData}
          disabled={isSearching}
          className="absolute top-44 flex items-center gap-2 bg-[#00FFB3] px-5 py-3 rounded-full shadow-lg disabled:opacity-50 z-20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Radio className="w-4 h-4 text-black" />
          <span className="text-black text-sm font-semibold">Buscar nuevas señales</span>
        </motion.button>

        <motion.button
          onClick={fetchNearbyData}
          disabled={isSearching}
          className="absolute bottom-20 right-8 w-14 h-14 bg-[#1A1A1A] border-2 border-[#00FFB3] rounded-full flex items-center justify-center shadow-xl disabled:opacity-50 z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isSearching ? 360 : 0 }}
          transition={{ duration: 1, repeat: isSearching ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
        >
          {newMarkersCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4FD8] rounded-full flex items-center justify-center z-10">
              <span className="text-white text-[10px] font-bold">{newMarkersCount}</span>
            </div>
          )}
          <Radio className="w-5 h-5 text-[#00FFB3]" />
        </motion.button>
      </div>

      <BottomNav activeTab="radar" onTabChange={(tab) => router.push(`/${tab === "radar" ? "radar" : tab}`)} />

      {/* Modals */}
      {isSendSignalModalOpen && (
        <SendSignalModal onClose={() => setIsSendSignalModalOpen(false)} onSend={handleSendSignal} />
      )}

      {selectedSignal && (
        <SignalDetailModal
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
          onRespond={() => handleRespond(selectedSignal)}
          onViewProfile={() => handleSignalClick(selectedSignal.senderId)}
          isUserConnected={isUserConnected(selectedSignal.senderId)}
          sendConnection={() => handleConnect(selectedSignal.senderId)}
        />
      )}

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onMessage={() => router.push(`/chats/${selectedUser.userId}`)}
          isUserConnected={() => isUserConnected(selectedUser.userId)}
          sendConnection={() => handleConnect(selectedUser.userId)}
          deleteConnection={() => handleDeleteConnection(selectedUser.userId)}
          isConnectionPending={() => isTheConnectionPending(selectedUser.userId)}
        />
      )}

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

      {showWelcomeModal && (
        <WelcomeModal
          isOpen={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
          userDisplayName={user?.displayName}
          userEmailConfirmed={user?.isVerified}
        />
      )}
    </div>
  )
}
