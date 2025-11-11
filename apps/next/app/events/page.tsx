"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { EventCard, EventCategoryFilter, BottomNav } from "@radar/ui"
import { useEventsStore, useAuthStore } from "@radar/features"
import { eventService } from "@radar/api"

const CATEGORIES = ["Todos", "Música", "Gastronomía", "Arte", "Deportes", "Social"]

export default function EventsPage() {
  const router = useRouter()
  const { events, setEvents, toggleInterest, selectedCategory, setSelectedCategory, setLoading } = useEventsStore()
  const { user } = useAuthStore()
  const [showMyEvents, setShowMyEvents] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const response = await eventService.getAllEvents()
        setEvents(response.rows)
      } catch (error) {
        console.error("[v0] Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [setEvents, setLoading])

  const handleInterestClick = async (eventId: string, isInterested: boolean) => {
    try {
      if (isInterested) {
        await eventService.unmarkInterest(eventId)
      } else {
        await eventService.markInterest(eventId)
      }
      toggleInterest(eventId)
    } catch (error) {
      console.error("[v0] Error toggling interest:", error)
    }
  }

  const filteredEvents = events.filter((event) => {
    if (showMyEvents && event.userId !== user?.userId) return false
    if (selectedCategory && event.category !== selectedCategory) return false
    return true
  })

  const handleTabChange = (tab: "radar" | "chats" | "events" | "profile") => {
    router.push(`/${tab === "radar" ? "radar" : tab}`)
  }

  return (
    <div className="min-h-screen bg-[#0E2A3E] pb-24">
      {/* Header */}
      <header className="bg-[#0E2A3E] px-6 py-4 pt-12 sticky top-0 z-10 border-b border-[#00FFB3]/20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Eventos Cercanos</h1>
          <button
            onClick={() => router.push("/events/create")}
            className="p-2 bg-[#00FFB3] rounded-full hover:bg-[#00FFB3]/90 transition-colors"
          >
            <Plus className="w-6 h-6 text-[#0E2A3E]" />
          </button>
        </div>

        {/* Category filter */}
        <EventCategoryFilter
          categories={CATEGORIES.slice(1)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* My events toggle */}
        <div className="mt-4">
          <button
            onClick={() => setShowMyEvents(!showMyEvents)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              showMyEvents ? "bg-[#FF4FD8] text-white" : "bg-[#1A3A4F] text-gray-400 border border-[#00FFB3]/20"
            }`}
          >
            {showMyEvents ? "Mostrando mis eventos" : "Mis eventos"}
          </button>
        </div>
      </header>

      {/* Events list */}
      <div className="px-6 py-6 space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-400 text-lg">No hay eventos disponibles</p>
            <p className="text-gray-500 text-sm mt-2">Crea el primer evento de tu zona</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.eventId}
              title={event.title}
              description={event.description}
              location={event.location}
              startDate={event.startDate}
              attendeesCount={event.attendeesCount}
              price={event.price}
              distance={event.distance}
              category={event.category}
              isInterested={event.isInterested}
              isBoosted={false}
              onInterestClick={() => handleInterestClick(event.eventId, event.isInterested || false)}
              onClick={() => router.push(`/events/${event.eventId}`)}
            />
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="events" onTabChange={handleTabChange} />
    </div>
  )
}
