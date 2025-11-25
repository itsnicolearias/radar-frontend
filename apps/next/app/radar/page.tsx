"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useRadarStore, useAuthStore, useSocket, useSocketEvent } from "@radar/features"
import { connectionService, profileViewService, radarService, signalService } from "@radar/api"
import type { IEventResponse, IRadarUser, IRadarSignal, IConnectionResponse } from "@radar/types"
import { BottomNav, GhostButton, InvisibleBadge } from "@radar/ui"
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


  const [radius, setRadius] = useState(10000) // default 10km
  const [selectedUser, setSelectedUser] = useState<IRadarUser | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<IEventResponse | null>(null)
  const [selectedSignal, setSelectedSignal] = useState<IRadarSignal | null>(null)
  const [ connections, setConnections] = useState<IConnectionResponse[]>(null)
  const [isSendSignalModalOpen, setIsSendSignalModalOpen] = useState(false)
  const [isAnimatingSignal, setIsAnimatingSignal] = useState(false)
  const socket = useSocket()

  useEffect(() => {
    const fetchNearbyData = async () => {
      if (!currentLocation || !isVisible) return
      try {
        const { users, events, signals } = await radarService.getNearby(
          currentLocation.latitude,
          currentLocation.longitude,
          radius,
        )
        setNearbyUsers(users)
        setNearbyEvents(events)
        setNearbySignals(signals)

        const friends = await connectionService.getAcceptedConnections()
        setConnections(friends)
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
  }, [currentLocation, isVisible, radius, setNearbyUsers, setNearbyEvents, setNearbySignals])

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
    return isConnected;
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
      await profileViewService.registerProfileView(user.userId)
    } catch (error) {
      console.error("Error registering profile view:", error)
    }
  }

  const handleEventClick = (event: IEventResponse) => {
    setSelectedEvent(event)
  }

  const handleSignalClick = async (senderId: string) => {
    const findUser = nearbyUsers.find((u) => u.userId === senderId )
    setSelectedUser(findUser)

    try {
      await profileViewService.registerProfileView(user.userId)
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
                return (
                  <UserMarker
                    key={nearbyUser.userId}
                    user={nearbyUser}
                    position={position}
                    hasSignal={hasSignal}
                    onClick={() => handleUserClick(nearbyUser)}
                    index={index}
                    onSelectSignal={() => setSelectedSignal(findSignal)}
                  />
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
          onClick={() => setIsSendSignalModalOpen(true)}
          className="absolute bottom-20 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl cursor-pointer z-20 overflow-hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 255, 179, 0.5), 0 0 40px rgba(29, 227, 242, 0.3)",
              "0 0 40px rgba(0, 255, 179, 0.8), 0 0 60px rgba(29, 227, 242, 0.5)",
              "0 0 20px rgba(0, 255, 179, 0.5), 0 0 40px rgba(29, 227, 242, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-[#00FFB3] to-[#1DE3F2]" />
          <Radio className="w-7 h-7 text-black relative z-10" />
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
        />
      )}

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onMessage={() => router.push(`/chats/${selectedUser.userId}`)}
          isUserConnected={() => isUserConnected(selectedUser.userId)}
        />
      )}

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  )
}
