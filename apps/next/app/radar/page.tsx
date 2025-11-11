"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RadarContainer, RadarUserMarker, RadarEventMarker, BottomNav, SendSignalModal, Button, RadarSignalMarker, SignalDetailModal } from "@radar/ui"
import { useRadarStore, useAuthStore, useSocket, useSocketEvent } from "@radar/features"
import { radarService, signalService } from "@radar/api"
import type { NearbyUser, IEventResponse, ISignal } from "@radar/types"

export default function RadarPage() {
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
    addNearbyUser,
    addNearbySignal,
    updateUserLocation,
  } = useRadarStore()

  const [selectedUser, setSelectedUser] = useState<NearbyUser | null>(null)
  const [selectedSignal, setSelectedSignal] = useState<ISignal | null>(null)
  const [isSendSignalModalOpen, setIsSendSignalModalOpen] = useState(false)
  const socket = useSocket()

  useEffect(() => {
    const fetchNearbyData = async () => {
      if (!currentLocation) return

      try {
        const { users, events, signals } = await radarService.getNearbyAll(currentLocation.latitude, currentLocation.longitude)

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
    
    if (!currentLocation && user) {
      setCurrentLocation({ latitude: user.lastLatitude!, longitude: user.lastLongitude! }) // Buenos Aires
    }
  }, [currentLocation, setCurrentLocation])

  const handleUserClick = (nearbyUser: NearbyUser) => {
    setSelectedUser(nearbyUser)
    router.push(`/profile/${nearbyUser.userId}`)
  }

  const handleEventClick = (event: IEventResponse) => {
    router.push(`/events/${event.eventId}`)
  }

  const handleSignalClick = (signal: ISignal) => {
    setSelectedSignal(signal)
  }

  const handleRespond = (signalId: string) => {
    // Implement respond logic here
    console.log("Responding to signal:", signalId)
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
          <Button onClick={() => setIsSendSignalModalOpen(true)}>
            Señales: {nearbySignals.length}
          </Button>
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white text-sm">{user?.firstName?.[0] || "U"}</span>
          </button>
        </div>
      </header>

      {/* Radar Container */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-8">
        <RadarContainer className="w-full max-w-md aspect-square">
          {/* Current user in center */}
          <RadarUserMarker
            initials={user ? `${user?.firstName}${user?.lastName}` : "TÚ"}
            distance={0}
            angle={0}
            maxDistance={1000}
            isCurrentUser
          />

          {/* Nearby users */}
          { nearbyUsers && nearbyUsers.length > 0 && (
            <>
             {nearbyUsers.map((nearbyUser, index) => {
              const angle = (index / nearbyUsers.length) * Math.PI * 2
              return (
                <RadarUserMarker
                  key={nearbyUser.userId}
                  initials={`${nearbyUser.firstName[0]}${nearbyUser.lastName[0]}`}
                  distance={nearbyUser.distance}
                  angle={angle}
                  maxDistance={1000}
                  photoUrl={nearbyUser.Profile.photoUrl}
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
                onClick={() => handleSignalClick(signal)}
              />
            )
          })}
        </RadarContainer>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="radar" onTabChange={handleTabChange} />

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
    </div>
  )
}
