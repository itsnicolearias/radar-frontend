"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RadarContainer, RadarUserMarker, RadarEventMarker, BottomNav, SendSignalModal, Button, RadarSignalMarker, GhostButton, InvisibleBadge } from "@radar/ui"
import { useRadarStore, useAuthStore, useSocket, useSocketEvent, useNotificationStore } from "@radar/features"
import { radarService, signalService } from "@radar/api"
import type { IEventResponse, IRadarUser, IRadarSignal } from "@radar/types"
import { SignalDetailModal } from "../../../../packages/ui/signals/signal-detail-modal"
import { AnimatePresence } from "framer-motion"
import { motion } from "framer-motion"
import { EventDetailModal } from "../../../../packages/ui/events/event-detail-modal"
import { Radio } from "lucide-react"

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
    addNearbyUser,
    addNearbySignal,
    updateUserLocation,
  } = useRadarStore()

  const [selectedUser, setSelectedUser] = useState<IRadarUser | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<IEventResponse | null>(null)
  const [selectedSignal, setSelectedSignal] = useState<IRadarSignal | null>(null)
  const [isSendSignalModalOpen, setIsSendSignalModalOpen] = useState(false)
  const [seenSignals, setSeenSignals] = useState<string[]>([])
  const [showSignalReplyNotification, setShowSignalReplyNotification] = useState(false)
  const socket = useSocket()


  useSocketEvent<{ senderName: string }>(
    "signal:reply",
    (data) => {
      addNotification({
        notificationId: new Date().toISOString(),
        message: `💬 ${data.senderName} respondió a tu señal.`,
        isRead: false,
        createdAt: new Date(),
      })
      setShowSignalReplyNotification(true)
      setTimeout(() => setShowSignalReplyNotification(false), 3000)
    },
    [addNotification],
  )

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
      setCurrentLocation({ latitude: user.lastLatitude!, longitude: user.lastLongitude! }) // Buenos Aires
    }
  }, [currentLocation, setCurrentLocation])

  const handleUserClick = (nearbyUser: IRadarUser) => {
    setSelectedUser(nearbyUser)
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

  const handleTabChange = (tab: "radar" | "chats" | "events" | "profile") => {
    router.push(`/${tab === "radar" ? "radar" : tab}`)
  }

  return (
    <div className="relative min-h-screen bg-[#0E2A3E] overflow-hidden">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 pt-12">
        <h1 className="text-2xl font-bold text-white">Radar</h1>
        <div className="flex items-center gap-4">
          <GhostButton onClick={handleToggleVisibility} isActive={!isVisible} />
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white text-sm">{user?.firstName?.[0] || "U"}</span>
          </button>
        </div>
      </header>

      {/* Radar Container */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-8">
        <RadarContainer className="w-full max-w-md aspect-square">
          <AnimatePresence>{showInvisibleBadge && <InvisibleBadge />}</AnimatePresence>
          {/* Current user in center */}
          <RadarUserMarker
            initials={"TÚ"}
            distance={0}
            angle={0}
            maxDistance={1000}
            isCurrentUser
          />

          {/* Nearby users */}
          {isVisible && nearbyUsers && nearbyUsers.length > 0 && (
            <>
             {nearbyUsers.map((nearbyUser, index) => {
              const angle = (index / nearbyUsers.length) * Math.PI * 2
              return (
                <RadarUserMarker
                  key={nearbyUser.userId}
                  initials={`${nearbyUser.displayName![0]}`}
                  distance={nearbyUser.distance}
                  angle={angle}
                  maxDistance={1000}
                  //photoUrl={nearbyUser.Profile.photoUrl}
                  onClick={() => handleUserClick(nearbyUser)}
                />
              )
            })}
            </>
             
          )}
          

          {/* Nearby events */}
          { nearbyEvents && nearbyEvents.length > 0 && (
            <>
            {(nearbyEvents as unknown as IEventResponse[]).map((event, index) => {
            const angle = ((index + 0.5) / nearbyEvents.length) * Math.PI * 2
            const distance = 500 + Math.random() * 300
            return (
              <RadarEventMarker
                key={event.eventId}
                title={event.title}
                distance={distance}
                angle={angle}
                maxDistance={1000}
                onClick={() => handleEventClick(event)}
              />
            )
          })}
            </>
          )}
          
          {/* Nearby signals */}
          {nearbySignals.map((signal, index) => {
            const angle = ((index + 0.25) / nearbySignals.length) * Math.PI * 2
            return (
              <RadarSignalMarker
                key={signal.signalId}
                distance={signal.distance}
                angle={angle}
                note={signal.note}
                isNew={!seenSignals.includes(signal.signalId)}
                onClick={() => handleSignalClick(signal)}
              />
            )
          })}
        </RadarContainer>
        <motion.button
          data-testid="send-signal-button"
          onClick={() => setIsSendSignalModalOpen(true)}
          className="absolute bottom-16 w-20 h-20 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center shadow-2xl shadow-[#00FFB3]/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 255, 179, 0.5)",
              "0 0 40px rgba(0, 255, 179, 0.8)",
              "0 0 20px rgba(0, 255, 179, 0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Radio className={`w-8 h-8  text-black relative z-10`} />
        </motion.button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab="radar"
        onTabChange={handleTabChange}
        showSignalReplyNotification={showSignalReplyNotification}
      />

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

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}
