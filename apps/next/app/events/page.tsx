"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { EventCard, EventCategoryFilter, BottomNav, Button, GradientBackground } from "@radar/ui"
import { useEventsStore, useAuthStore } from "@radar/features"
import { eventService } from "@radar/api"
import { motion } from "framer-motion"

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
    <GradientBackground>
      <div className="relative z-10 min-h-screen text-white flex flex-col">
        {/* Header */}
        <header className="bg-[#1A1A1A]/50 backdrop-blur-lg p-6 border-b border-[#00FFB3]/20 sticky top-0 z-20">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Eventos</h1>
            <Button
              variant="icon"
              size="icon"
              onClick={() => router.push("/events/create")}
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>

          <EventCategoryFilter
            categories={CATEGORIES.slice(1)}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="mt-4">
            <Button
              variant={showMyEvents ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowMyEvents(!showMyEvents)}
            >
              {showMyEvents ? "Mostrando Mis Eventos" : "Mis Eventos"}
            </Button>
          </div>
        </header>

        {/* Events list */}
        <div className="px-6 py-6 space-y-4 flex-1 overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-white/70">No hay eventos que coincidan.</p>
              <p className="text-sm text-white/50 mt-2">Probá cambiando los filtros o creando un nuevo evento.</p>
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.eventId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <EventCard
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
              </motion.div>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab="events" onTabChange={handleTabChange} />
      </div>
    </GradientBackground>
  )
}