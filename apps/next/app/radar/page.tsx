"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RadarContainer, RadarUserMarker, RadarEventMarker, BottomNav, SendSignalModal, Button, RadarSignalMarker } from "@radar/ui"
import { motion } from "framer-motion"
import { useRadarStore, useAuthStore, useSocket, useSocketEvent, useNotificationStore } from "@radar/features"
import { radarService, signalService } from "@radar/api"
import type { IEventResponse, IRadarUser, IRadarSignal } from "@radar/types"
import { SignalDetailModal } from "../../../../packages/ui/signals/signal-detail-modal"
import { EventDetailModal } from "../../../../packages/ui/events/event-detail-modal"
import { Radio } from "lucide-react"
import { GradientBackground } from "@radar/ui"

export default function RadarPage() {
  const router = useRouter()
  const { user } = useAuthStore()
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
      if (!currentLocation) return

      try {
        const { users, events, signals } = await radarService.getNearby(currentLocation.latitude, currentLocation.longitude)

        setNearbyUsers(users)
        setNearbyEvents(events)
        setNearbySignals(signals)
      } catch (error) {
        console.error("[v0] Error fetching nearby data:", error)
      }
    }

    fetchNearbyData()
  }, [currentLocation, setNearbyUsers, setNearbyEvents, setNearbySignals])

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
    <GradientBackground>
      <div className="relative z-10 min-h-screen text-white flex flex-col">
        {/* Header */}
        <header className="bg-[#1A1A1A]/50 backdrop-blur-lg p-6 border-b border-[#00FFB3]/20 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Radar</h1>
          <Button
            variant="icon"
            size="icon"
            onClick={() => router.push("/profile")}
          >
            <img
              src={`https://avatar.vercel.sh/${user?.email}.png`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </Button>
        </header>

        {/* Radar Container */}
        <div className="flex-1 flex items-center justify-center relative">
          <RadarContainer className="w-full max-w-md aspect-square">
            {/* Current user in center */}
            <RadarUserMarker
              initials={user ? `${user?.firstName?.[0]}${user?.lastName?.[0]}` : "TÚ"}
              distance={0}
              angle={0}
              maxDistance={1000}
              isCurrentUser
              photoUrl={`https://avatar.vercel.sh/${user?.email}.png`}
            />

            {/* Nearby users */}
            {nearbyUsers.map((nearbyUser, index) => {
              const angle = (index / nearbyUsers.length) * Math.PI * 2
              return (
                <RadarUserMarker
                  key={nearbyUser.userId}
                  initials={`${nearbyUser.displayName![0]}`}
                  distance={nearbyUser.distance}
                  angle={angle}
                  maxDistance={1000}
                  // photoUrl={nearbyUser.profile.photoUrl}
                  onClick={() => handleUserClick(nearbyUser)}
                />
              )
            })}

            {/* Nearby events */}
            {nearbyEvents.map((event, index) => {
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

          <Button
            variant="fab"
            size="fab"
            onClick={() => setIsSendSignalModalOpen(true)}
            className="absolute bottom-24"
          >
            <Radio className="w-8 h-8 text-black" />
          </Button>
        </div>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab="radar"
          onTabChange={handleTabChange}
          showSignalReplyNotification={showSignalReplyNotification}
        />

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
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </GradientBackground>
  )
}
