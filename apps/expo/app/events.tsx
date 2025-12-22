"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { useEventsStore, useAuthStore } from "@radar/features"
import { eventService } from "@radar/api"
import { BottomNavNative } from "../../../packages/ui/navigation/bottom-nav.native"
//import { formatDistance } from "../../../lib/utils/format-distance"

const { width } = Dimensions.get("window")
const CATEGORIES = ["Todos", "Música", "Gastronomía", "Arte", "Deportes", "Social"]

export default function EventsScreen() {
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
      // Update local state immediately
      toggleInterest(eventId, user!.userId!)
    } catch (error) {
      console.error("[v0] Error toggling interest:", error)
    }
  }

  const filteredEvents = events.filter((event) => {
    if (showMyEvents && event.userId !== user?.userId) return false
    if (selectedCategory && selectedCategory !== "Todos" && event.category !== selectedCategory) return false
    return true
  })

  const formatDate = (date: string) => {
    const eventDate = new Date(date)
    return eventDate.toLocaleDateString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Eventos Cercanos</Text>
          <TouchableOpacity style={styles.createButton} onPress={() => router.push("/events/create")}>
            <Text style={styles.createButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(selectedCategory === category ? "Todos" : category)}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.myEventsButton, showMyEvents && styles.myEventsButtonActive]}
          onPress={() => setShowMyEvents(!showMyEvents)}
        >
          <Text style={[styles.myEventsText, showMyEvents && styles.myEventsTextActive]}>
            {showMyEvents ? "Mostrando mis eventos" : "Mis eventos"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay eventos disponibles</Text>
            <Text style={styles.emptySubtext}>Crea el primer evento de tu zona</Text>
          </View>
        ) : (
          filteredEvents.map((event) => {
            const isInterested = event?.InterestedUsers?.some((u) => u.userId === user?.userId)

            return (
              <TouchableOpacity
                key={event.eventId}
                style={styles.eventCard}
                onPress={() => router.push(`/events/${event.eventId}`)}
              >
                <View style={styles.eventImage}>
                  <Text style={styles.eventImageText}>{event.title[0]}</Text>
                </View>

                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={styles.eventLocation} numberOfLines={1}>
                    📍 {event.location} · {event.distance}
                  </Text>
                  <View style={styles.eventMeta}>
                    <Text style={styles.eventDate}>🕐 {formatDate(event.startDate)}</Text>
                    <Text style={styles.eventAttendees}>👥 {event.InterestedUsers?.length || 0}</Text>
                  </View>
                  <View style={styles.eventFooter}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{event.category}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.interestButton, isInterested && styles.interestButtonActive]}
                      onPress={() => handleInterestClick(event.eventId, isInterested || false)}
                    >
                      <Text style={[styles.interestButtonText, isInterested && styles.interestButtonTextActive]}>
                        {isInterested ? "No me interesa" : "Me interesa ❤️"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>

      <BottomNavNative
        activeTab="events"
        onTabChange={(tab) => {
          if (tab === "chats") router.push("/chats")
          else if (tab === "radar") router.push("/radar")
          else if (tab === "profile") router.push("/profile")
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    backgroundColor: "#000000",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 179, 0.2)",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  categoriesScroll: {
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
  },
  categoryChipActive: {
    backgroundColor: "#00FFB3",
    borderColor: "#00FFB3",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8B8B8B",
  },
  categoryTextActive: {
    color: "#000000",
  },
  myEventsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
  },
  myEventsButtonActive: {
    backgroundColor: "#FF005C",
    borderColor: "#FF005C",
  },
  myEventsText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8B8B8B",
  },
  myEventsTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#000000",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: "#8B8B8B",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#5A6E7A",
  },
  eventCard: {
    backgroundColor: "#0a0e27",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
  },
  eventImageText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#000000",
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 14,
    color: "#8B8B8B",
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  eventDate: {
    fontSize: 14,
    color: "#8B8B8B",
  },
  eventAttendees: {
    fontSize: 14,
    color: "#8B8B8B",
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(0, 255, 179, 0.2)",
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00FFB3",
  },
  interestButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#00FFB3",
  },
  interestButtonActive: {
    backgroundColor: "#FF005C",
  },
  interestButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  interestButtonTextActive: {
    color: "#FFFFFF",
  },
})
