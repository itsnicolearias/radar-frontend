"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  useRadarStore,
  useAuthStore,
  useSocketEvent,
  useConnectionStore,
  useSocket,
  useChatStore,
} from "@radar/features"
import {
  connectionService,
  profileViewService,
  radarService,
  signalService,
} from "@radar/api"
import type {
  IEventResponse,
  IRadarUser,
  IRadarSignal,
  IConnectionResponse,
} from "@radar/types"
import {
  BottomNav,
  cn,
  GhostButton,
  InvisibleBadge,
  WelcomeModal,
} from "@radar/ui"
import { SendSignalModal } from "../../../../packages/ui/modals/send-signal-modal"
import { SignalDetailModal } from "../../../../packages/ui/signals/signal-detail-modal"
import { UserProfileModal } from "../../../../packages/ui/profile/user-profile-modal"
import { EventDetailModal } from "../../../../packages/ui/events/event-detail-modal"
import { UserMarker } from "../../../../packages/ui/radar/user-marker"
import { EventMarker } from "../../../../packages/ui/radar/event-marker"
import { CentralUserMarker } from "../../../../packages/ui/radar/central-user-marker"
import { AnimatePresence, motion } from "framer-motion"
import { Radio, MapPin, RefreshCcw } from "lucide-react"
import { useUIStore } from "@radar/features"

/* =========================
   RADAR CONSTANTS
========================= */

const CENTER = 50
const USER_RADII = [12.5, 20, 27.5, 35]
const EVENT_RADII = [30, 38, 46]
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const RADIAL_JITTER = 1.2
const ANGLE_JITTER = Math.PI / 36

function hashToUnit(value: string, salt = ""): number {
  let hash = 0
  const input = `${value}:${salt}`
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0
  }
  return Math.abs(hash % 1000) / 1000
}

/* =========================
   MARKER POSITION (NO DISTANCE)
========================= */

function getMarkerPosition(
  index: number,
  total: number,
  type: "user" | "event",
) {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2
  const radii = type === "event" ? EVENT_RADII : USER_RADII
  const radius = radii[index % radii.length]

  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  }
}

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

  const { connections, setConnections, removeConnection } =
    useConnectionStore()

  const [radius, setRadius] = useState(10000)
  const [selectedUser, setSelectedUser] = useState<IRadarUser | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<IEventResponse | null>(null)
  const [selectedSignal, setSelectedSignal] = useState<IRadarSignal | null>(null)
  const [pendingsConnections, setPendingsConnections] = useState<IConnectionResponse[]>([])
  const [isSendSignalModalOpen, setIsSendSignalModalOpen] = useState(false)
  const [isAnimatingSignal, setIsAnimatingSignal] = useState(false)
  const socket = useSocket()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const { setReplyingToSignal } = useChatStore()
  const [isSearching, setIsSearching] = useState(false)
  const [searchMessage, setSearchMessage] = useState("")
  const [newMarkersCount, setNewMarkersCount] = useState(0)
  const [newMarkerIds, setNewMarkerIds] = useState<Set<string>>(new Set())
  
  const searchMessages = [
    "Buscando nuevas señales",
    "Detectando señales en el Radar",
    "Escuchando nuevas señales",
    "Rastreando usuarios cercanos",
    "Explorando el área",
    "Señales en detección",
  ]

  /* =========================
     SOCKET
  ========================= */

  useSocketEvent<{ userId: string; latitude: number; longitude: number }>(
    "location-updated",
    (data) => {
      updateUserLocation(data.userId, data.latitude, data.longitude)
    },
    [updateUserLocation],
  )

  /* =========================
     FETCH
  ========================= */

  const fetchNearbyData = async () => {
    if (!currentLocation || !isVisible) return

    setIsSearching(true)
    let msgIndex = 0

    const msgTimer = setInterval(() => {
      setSearchMessage(searchMessages[msgIndex % searchMessages.length])
      msgIndex++
    }, 1500)

    try {
      const { users, events, signals } = await radarService.getNearby(
        currentLocation.latitude,
        currentLocation.longitude,
        radius,
      )

      const prevIds = new Set(nearbyUsers.map((u) => u.userId))
      setNewMarkerIds(
        new Set(users.filter((u) => !prevIds.has(u.userId)).map((u) => u.userId)),
      )

      setNearbyUsers(users)
      setNearbyEvents(events)
      setNearbySignals(signals)

      setConnections(await connectionService.getAcceptedConnections())
      setPendingsConnections(await connectionService.getMyPendingConnections())

      setTimeout(() => setNewMarkerIds(new Set()), 3000)
    } finally {
      clearInterval(msgTimer)
      setTimeout(() => setIsSearching(false), 800)
    }
  }

  useEffect(() => {
    if (isVisible) fetchNearbyData()
    else {
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
      setCurrentLocation({
        latitude: user.lastLatitude!,
        longitude: user.lastLongitude!,
      })
    }
  }, [currentLocation, setCurrentLocation, user])

  useEffect(() => {

    if (user && user.isVerified === false && !user.displayName && !showWelcomeModal) {
      setShowWelcomeModal(true)
    }
  }, [])

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
    setReplyingToSignal(signal)
    router.push(`/chats/${signal.senderId}?signalId=${signal.signalId}`)
    setSelectedSignal(null)
  }

  const handleViewProfile = (userId: string) => {
    setSelectedSignal(null)
    router.push(`/profile/${userId}`)
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

  const usersToRender = [...nearbyUsers]
    .filter((u) => typeof u.distance === "number")
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 15)

  const ringsCount = USER_RADII.length
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

  const { isModalOpen } = useUIStore()

  return (
    <div className="relative w-full h-screen bg-black  flex flex-col">

      {/* HEADER */}
      <header className="z-20 bg-[#1A1A1A]/60 backdrop-blur p-6 border-b border-[#00FFB3]/20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-[#00FFB3]" />
            <span className="text-[#00FFB3]">{radius / 1000} km</span>
          </div>
          <h1 className="text-white font-bold">RADAR</h1>
          <GhostButton onClick={toggleVisibility} isActive={!isVisible} />
        </div>

        <div className="flex gap-2">
          {[2000, 5000, 10000].map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`flex-1 py-2 rounded-full text-sm ${
                radius === r
                  ? "bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black"
                  : "border border-[#00FFB3]/20 text-[#C5C5C5]"
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
            className="absolute top-28 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full border border-[#00FFB3] bg-[#00FFB3]/20 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="text-[#00FFB3] text-sm font-semibold">
              {searchMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isVisible && <InvisibleBadge />}
       

      {/* RADAR */}
      <div className={cn("flex-1 flex items-center justify-center relative", selectedUser && "pointer-events-none")}>
        <motion.div
          className="relative w-full max-w-[420px] aspect-square"
          style={{ pointerEvents: isModalOpen ? 'none' : 'auto', filter: isModalOpen ? 'blur(2px)' : 'none' }}
        >

          {/* PARTICLES */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full bg-[#00FFB3]"
              style={{ left: "50%", top: "50%" }}
              initial={{ opacity: 0.2, x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                x: [Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100],
                y: [Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100],
              }}
              transition={{ duration: 10 + Math.random() * 5, repeat: Infinity }}
            />
          ))}

          {/* WAVES */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: "35%",
                height: "35%",
                left: "32.5%",
                top: "32.5%",
                borderWidth: 3,
                borderColor: "rgba(0, 255, 179, 0.4)",
              }}
              animate={{ scale: [0.7, 2], opacity: [0.8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                delay: i * 1,
                ease: "easeOut",
              }}
            />
          ))}

          {/* RINGS */}
          {[35, 60, 85].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-[#00FFB3]/20"
              style={{
                width: `${s}%`,
                height: `${s}%`,
                left: `${(100 - s) / 2}%`,
                top: `${(100 - s) / 2}%`,
              }}
            />
          ))}

          {/* CENTER */}
          <CentralUserMarker
            initial={user?.displayName?.[0]?.toUpperCase() || "U"}
          />

          {/* USERS */}
            {isVisible &&
              ringBuckets.map((bucket, ringIndex) => {
                const count = bucket.length || 1
                const offset = ringIndex * (Math.PI / 6)
                const baseRadius = USER_RADII[ringIndex]
                return bucket.map((nearbyUser, idxInRing) => {
                  const angle =
                    idxInRing * GOLDEN_ANGLE +
                    offset +
                    (hashToUnit(nearbyUser.userId, "a") - 0.5) * ANGLE_JITTER
                  const radius =
                    baseRadius +
                    (hashToUnit(nearbyUser.userId, "r") - 0.5) * 2 * RADIAL_JITTER
                  const position = {
                    x: CENTER + radius * Math.cos(angle),
                    y: CENTER + radius * Math.sin(angle),
                  }
                  const hasSignal = nearbySignals.some((s) => s.senderId === nearbyUser.userId)
                  const findSignal = nearbySignals.findLast((s) => s.senderId === nearbyUser.userId)
                  const isNew = newMarkerIds.has(nearbyUser.userId)

                  return (
                    <div key={nearbyUser.userId}>
                      {isNew && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute bg-[#00FFB3] px-3 py-1 rounded-full z-30"
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
                        index={idxInRing}
                        onSelectSignal={() => setSelectedSignal(findSignal)}
                      />
                    </div>
                  )
                })
              })}

          {/* EVENTS 
          {isVisible &&
            nearbyEvents.map((e, i) => (
              <EventMarker
                    key={e.eventId}
                    event={e}
                    position={position}
                    onClick={() => handleEventClick(e)}
                    index={i}
                  />
            ))}*/}
        </motion.div>

        {/* ACTION BUTTONS */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30" style={{ pointerEvents: isModalOpen ? 'none' : 'auto', opacity: isModalOpen ? 0 : 1 }}>
          <motion.div
            className="absolute inset-0 w-16 h-16 rounded-full bg-[#00FFB3]/30"
            animate={{ scale: isAnimatingSignal ? 1.2 : 1 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.button
            onClick={() => setIsSendSignalModalOpen(true)}
            className="relative w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2]"
          >
            <Radio className="text-black" />
          </motion.button>
        </div>

        <motion.button
          onClick={fetchNearbyData}
          className="absolute bottom-8 right-8 w-14 h-14 rounded-full border-2 border-[#00FFB3] flex items-center justify-center z-30"
          animate={{ rotate: isSearching ? 360 : 0 }}
          transition={{ duration: 1, ease: "linear" }}
        >
          {newMarkerIds.size > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4FD8] rounded-full flex items-center justify-center z-10">
              <span className="text-white text-[10px] font-bold">{newMarkerIds.size}</span>
            </div>
          )}
          <RefreshCcw className="text-[#00FFB3]" />
        </motion.button>
      </div>


      <BottomNav activeTab="radar" onTabChange={(t) => router.push(`/${t}`)} />


      {/* MODALS */}
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
          isConnectionPending={() => isTheConnectionPending(selectedSignal.senderId)}
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
