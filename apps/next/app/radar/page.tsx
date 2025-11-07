"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RadarContainer, RadarUserMarker, RadarEventMarker, BottomNav } from "@radar/ui"
import { useRadarStore, useAuthStore, useSocket, useSocketEvent } from "@radar/features"
import { radarService, eventService } from "@radar/api"
import type { NearbyUser, Event } from "@radar/types"

export default function RadarPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const {
    nearbyUsers,
    nearbyEvents,
    currentLocation,
    setNearbyUsers,
    setNearbyEvents,
    setCurrentLocation,
    addNearbyUser,
    updateUserLocation,
  } = useRadarStore()

  const [selectedUser, setSelectedUser] = useState<NearbyUser | null>(null)
  const socket = useSocket()

  useEffect(() => {
    const fetchNearbyData = async () => {
      if (!currentLocation) return

      try {
        const [users, events] = await Promise.all([
          radarService.getNearbyUsers(currentLocation.latitude, currentLocation.longitude),
          eventService.getNearbyEvents(currentLocation.latitude, currentLocation.longitude),
        ])
        setNearbyUsers(users)
        setNearbyEvents(events)
      } catch (error) {
        console.error("[v0] Error fetching nearby data:", error)
      }
    }

    fetchNearbyData()
  }, [currentLocation, setNearbyUsers, setNearbyEvents])

  useSocketEvent<{ userId: string; latitude: number; longitude: number }>(
    "location-updated",
    (data) => {
      updateUserLocation(data.userId, data.latitude, data.longitude)
    },
    [updateUserLocation],
  )

  useEffect(() => {
    if (!currentLocation) {
      setCurrentLocation({ latitude: -34.6037, longitude: -58.3816 }) // Buenos Aires
    }
  }, [currentLocation, setCurrentLocation])

  const handleUserClick = (nearbyUser: NearbyUser) => {
    setSelectedUser(nearbyUser)
    router.push(`/profile/${nearbyUser.user.userId}`)
  }

  const handleEventClick = (event: Event) => {
    router.push(`/events/${event.eventId}`)
  }

  const handleTabChange = (tab: "radar" | "chats" | "events" | "profile") => {
    router.push(`/${tab === "radar" ? "radar" : tab}`)
  }

  return (
    <div className="relative min-h-screen bg-[#0E2A3E] overflow-hidden">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 pt-12">
        <h1 className="text-2xl font-bold text-white">Radar</h1>
        <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-white text-sm">{user?.firstName?.[0] || "U"}</span>
        </button>
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
          {nearbyUsers.map((nearbyUser, index) => {
            const angle = (index / nearbyUsers.length) * Math.PI * 2
            return (
              <RadarUserMarker
                key={nearbyUser.user.userId}
                initials={`${nearbyUser.user.firstName[0]}${nearbyUser.user.lastName[0]}`}
                distance={nearbyUser.distance}
                angle={angle}
                maxDistance={1000}
                photoUrl={nearbyUser.profile.photoUrl}
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
        </RadarContainer>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="radar" onTabChange={handleTabChange} />
    </div>
  )
}
