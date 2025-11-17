"use client"

"use client"

import { useEffect, useState } from "react"
import { View } from "react-native"
import { useRouter } from "expo-router"
import {
  RadarContainer,
  RadarUserMarker,
  RadarEventMarker,
  BottomNav,
  SendSignalModal,
  Button,
  RadarSignalMarker,
  GradientBackground,
  Header,
} from "@radar/ui"
import { useRadarStore, useAuthStore, useSocket, useSocketEvent, useNotificationStore } from "@radar/features"
import { radarService, signalService } from "@radar/api"
import type { IEventResponse, IRadarUser, IRadarSignal } from "@radar/types"
import { SignalDetailModal } from "../../../packages/ui/signals/signal-detail-modal.native"
import { EventDetailModal } from "../../../packages/ui/events/event-detail-modal.native"
import { Radio } from "lucide-react-native"

export default function RadarScreen() {
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
    addNearbySignal,
    updateUserLocation,
  } = useRadarStore()

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
        const { users, events, signals } = await radarService.getNearby(
          currentLocation.latitude,
          currentLocation.longitude,
        )
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
      setCurrentLocation({ latitude: user.lastLatitude!, longitude: user.lastLongitude! })
    }
  }, [currentLocation, setCurrentLocation, user])

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
    router.push(`/chats/${signal.senderId}?signalId=${signal.signalId}`)
    setSelectedSignal(null)
  }

  const handleTabChange = (tab: "radar" | "chats" | "events" | "profile") => {
    router.push(`/${tab}`)
  }

  return (
    <GradientBackground>
      <View className="flex-1">
        <Header />
        <View className="flex-1 items-center justify-center relative">
          <RadarContainer>
            <RadarUserMarker
              initials={user ? `${user.firstName?.[0]}${user.lastName?.[0]}` : "TÚ"}
              distance={0}
              angle={0}
              maxDistance={1000}
              isCurrentUser
              photoUrl={`https://avatar.vercel.sh/${user?.email}.png`}
            />

            {nearbyUsers.map((nearbyUser, index) => {
              const angle = (index / nearbyUsers.length) * Math.PI * 2
              return (
                <RadarUserMarker
                  key={nearbyUser.userId}
                  initials={`${nearbyUser.displayName![0]}`}
                  distance={nearbyUser.distance}
                  angle={angle}
                  maxDistance={1000}
                  onClick={() => handleUserClick(nearbyUser)}
                />
              )
            })}

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
            onPress={() => setIsSendSignalModalOpen(true)}
            className="absolute bottom-24"
          >
            <Radio className="w-8 h-8 text-primary-foreground" />
          </Button>
        </View>

        <BottomNav
          activeTab="radar"
          onTabChange={handleTabChange}
          showSignalReplyNotification={showSignalReplyNotification}
        />

        {isSendSignalModalOpen && (
          <SendSignalModal onClose={() => setIsSendSignalModalOpen(false)} onSend={handleSendSignal} />
        )}
        {selectedSignal && (
          <SignalDetailModal
            signal={selectedSignal}
            onClose={() => setSelectedSignal(null)}
            onRespond={() => handleRespond(selectedSignal)}
          />
        )}
        {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </View>
    </GradientBackground>
  )
}
