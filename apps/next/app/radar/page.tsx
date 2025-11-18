"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { useRadarStore, useAuthStore, useSocket, useSocketEvent, useNotificationStore } from "@radar/features"
import { radarService, signalService } from "@radar/api"
import type { IEventResponse, IRadarUser, IRadarSignal } from "@radar/types"
import { SendSignalModal, GhostButton, InvisibleBadge } from "@radar/ui"
import { SignalDetailModal } from "../../../../packages/ui/signals/signal-detail-modal"
import { EventDetailModal } from "../../../../packages/ui/events/event-detail-modal"
import { AnimatePresence, motion } from "framer-motion"
import { Radio } from 'lucide-react'

export default function RadarPage() {
  const router = useRouter()
  const { user, isVisible, toggleVisibility } = useAuthStore()
  const [showInvisibleBadge, setShowInvisibleBadge] = useState(false)
  const { addNotification } = useNotificationStore()
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

  const [selectedEvent, setSelectedEvent] = useState<IEventResponse | null>(null)
  const [selectedSignal, setSelectedSignal] = useState<IRadarSignal | null>(null)
  const [isSendSignalModalOpen, setIsSendSignalModalOpen] = useState(false)
  const [seenSignals, setSeenSignals] = useState<string[]>([])
  const socket = useSocket()

  useEffect(() => {
    const fetchNearbyData = async () => {
      if (!currentLocation || !isVisible) return
      try {
        const { users, events, signals } = await radarService.getNearby(currentLocation.latitude, currentLocation.longitude)
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
    if (!currentLocation && user) {
      setCurrentLocation({ latitude: user.lastLatitude!, longitude: user.lastLongitude! })
    }
  }, [currentLocation, setCurrentLocation])

  const handleUserClick = (nearbyUser: IRadarUser) => {
    router.push(`/profile/${nearbyUser.userId}`)
  }

  const handleEventClick = (event: IEventResponse) => {
    setSelectedEvent(event)
  }

  const handleSignalClick = (signal: IRadarSignal) => {
    setSelectedSignal(signal)
    if (!seenSignals.includes(signal.signalId)) {
      setSeenSignals([...seenSignals, signal.signalId])
    }
  }

  const handleRespond = (signal: IRadarSignal) => {
    router.push(`/chat/${signal.senderId}?signalId=${signal.signalId}`)
    setSelectedSignal(null)
  }

  const renderUserMarker = (user: IRadarUser, index: number) => {
    const angle = (index / (nearbyUsers.length || 1)) * Math.PI * 2
    const normalizedDistance = Math.min(user.distance / 1000, 1)
    const radius = normalizedDistance * 180
    const x = 50 + (radius * Math.cos(angle)) / 200
    const y = 50 + (radius * Math.sin(angle)) / 200

    return (
      <motion.button
        key={user.userId}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-sm border-2 cursor-pointer"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -50%)",
          backgroundColor: "#FF1493",
          borderColor: "#FF1493",
          boxShadow: "0 0 20px rgba(255, 20, 147, 0.6), 0 0 40px rgba(255, 20, 147, 0.3)",
        }}
        onClick={() => handleUserClick(user)}
      >
        {user.firstName?.[0]}{user.lastName?.[0]}
      </motion.button>
    )
  }

  const renderEventMarker = (event: IEventResponse, index: number) => {
    const angle = ((index + 0.5) / (nearbyEvents.length || 1)) * Math.PI * 2
    const radius = 150
    const x = 50 + (radius * Math.cos(angle)) / 200
    const y = 50 + (radius * Math.sin(angle)) / 200

    return (
      <motion.button
        key={event.eventId}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-2"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -50%)",
          backgroundColor: "#FF1493",
          borderColor: "#FF1493",
          boxShadow: "0 0 20px rgba(255, 20, 147, 0.6)",
        }}
        onClick={() => handleEventClick(event)}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </motion.button>
    )
  }

  const renderSignalMarker = (signal: IRadarSignal, index: number) => {
    const angle = ((index + 0.25) / (nearbySignals.length || 1)) * Math.PI * 2
    const radius = 140
    const x = 50 + (radius * Math.cos(angle)) / 200
    const y = 50 + (radius * Math.sin(angle)) / 200

    return (
      <motion.button
        key={signal.signalId}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-2"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -50%)",
          backgroundColor: "#00FFB3",
          borderColor: "#00FFB3",
          boxShadow: "0 0 15px rgba(0, 255, 179, 0.6), 0 0 30px rgba(29, 227, 242, 0.3)",
        }}
        onClick={() => handleSignalClick(signal)}
      >
        {!seenSignals.includes(signal.signalId) && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border border-white text-xs flex items-center justify-center text-white font-bold">
            !
          </div>
        )}
      </motion.button>
    )
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      <header className="relative z-20 px-6 py-4 border-b border-[#00FFB3]/20 bg-black/80 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Radio: <span className="text-[#00FFB3] font-semibold">10 km</span>
          </div>
          <h1 className="text-white font-bold text-lg">RADAR</h1>
          <div className="flex items-center gap-3">
            <GhostButton onClick={handleToggleVisibility} isActive={!isVisible} />
          </div>
        </div>
      </header>

      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Radial gradient background grid */}
        <svg className="absolute inset-0 w-full h-full opacity-30" style={{ pointerEvents: "none" }}>
          <defs>
            <radialGradient id="radarGrid" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00FFB3" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#00FFB3" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#00FFB3" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="25%" fill="url(#radarGrid)" />
          <circle cx="50%" cy="50%" r="50%" fill="url(#radarGrid)" />
          <circle cx="50%" cy="50%" r="75%" fill="url(#radarGrid)" />
          
          {/* Grid lines */}
          <circle cx="50%" cy="50%" r="25%" fill="none" stroke="#00FFB3" strokeWidth="1" opacity="0.2" />
          <circle cx="50%" cy="50%" r="50%" fill="none" stroke="#00FFB3" strokeWidth="1" opacity="0.15" />
          <circle cx="50%" cy="50%" r="75%" fill="none" stroke="#00FFB3" strokeWidth="1" opacity="0.1" />
        </svg>

        <div className="relative w-full h-full flex items-center justify-center">
          {/* Current user in center */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute w-16 h-16 rounded-full flex items-center justify-center font-bold text-black text-sm border-2 z-10"
            style={{
              backgroundColor: "#00FFB3",
              borderColor: "#00FFB3",
              boxShadow: "0 0 30px rgba(0, 255, 179, 0.8), 0 0 60px rgba(0, 255, 179, 0.4)",
            }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </motion.div>

          {/* Nearby users */}
          {isVisible && nearbyUsers && nearbyUsers.map(renderUserMarker)}

          {/* Nearby events */}
          {isVisible && nearbyEvents && nearbyEvents.map(renderEventMarker)}

          {/* Nearby signals */}
          {nearbySignals && nearbySignals.map(renderSignalMarker)}
        </div>

        <motion.button
          onClick={() => setIsSendSignalModalOpen(true)}
          className="absolute bottom-20 w-20 h-20 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center shadow-2xl border border-[#00FFB3]/50 cursor-pointer z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 255, 179, 0.5), 0 0 40px rgba(29, 227, 242, 0.3)",
              "0 0 40px rgba(0, 255, 179, 0.8), 0 0 60px rgba(29, 227, 242, 0.5)",
              "0 0 20px rgba(0, 255, 179, 0.5), 0 0 40px rgba(29, 227, 242, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Radio className="w-8 h-8 text-black" />
        </motion.button>

        <AnimatePresence>{showInvisibleBadge && <InvisibleBadge />}</AnimatePresence>
      </div>

      <nav className="relative z-20 border-t border-[#00FFB3]/20 px-6 py-4 flex justify-around items-center bg-black/90 backdrop-blur-sm">
        <NavButton label="Radar" icon="📍" active onClick={() => router.push("/radar")} />
        <NavButton label="Chats" icon="💬" onClick={() => router.push("/chats")} />
        <NavButton label="Eventos" icon="📅" onClick={() => router.push("/events")} />
        <NavButton label="Perfil" icon="👤" onClick={() => router.push("/profile")} />
      </nav>

      {/* Modals */}
      {isSendSignalModalOpen && (
        <SendSignalModal
          onClose={() => setIsSendSignalModalOpen(false)}
          onSend={handleSendSignal}
        />
      )}

      {selectedSignal && (
        <SignalDetailModal
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
          onRespond={() => handleRespond(selectedSignal)}
        />
      )}

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}

function NavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${
        active ? "text-[#00FFB3]" : "text-gray-500 hover:text-gray-300"
      }`}
    >
      <div className="text-xl">{icon}</div>
      <div className="text-xs font-medium">{label}</div>
    </button>
  )
}
