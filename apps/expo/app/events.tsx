"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { useEventsStore, useAuthStore } from "@radar/features"
import { eventService } from "@radar/api"

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
      toggleInterest(eventId)
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Eventos Cercanos</Text>
          <TouchableOpacity style={styles.createButton} onPress={() => router.push("/events/create")}>
            <Text style={styles.createButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(category === "Todos" ? null : category)}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* My events toggle */}
        <TouchableOpacity
          style={[styles.myEventsButton, showMyEvents && styles.myEventsButtonActive]}
          onPress={() => setShowMyEvents(!showMyEvents)}
        >
          <Text style={[styles.myEventsText, showMyEvents && styles.myEventsTextActive]}>
            {showMyEvents ? "Mostrando mis eventos" : "Mis eventos"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Events list */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay eventos disponibles</Text>
            <Text style={styles.emptySubtext}>Crea el primer evento de tu zona</Text>
          </View>
        ) : (
          filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.eventId}
              style={styles.eventCard}
              onPress={() => router.push(`/events/${event.eventId}`)}
            >
              {/* Event image placeholder */}
              <View style={styles.eventImage}>
                <Text style={styles.eventImageText}>{event.title[0]}</Text>
              </View>

              {/* Event info */}
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {event.title}
                </Text>
                <Text style={styles.eventLocation} numberOfLines={1}>
                  📍 {event.location} · {event.distance ? `${(event.distance / 1000).toFixed(1)} km` : "Cerca"}
                </Text>
                <View style={styles.eventMeta}>
                  <Text style={styles.eventDate}>🕐 {formatDate(event.startDate)}</Text>
                  <Text style={styles.eventAttendees}>👥 {event.attendeesCount || 0}</Text>
                </View>
                <View style={styles.eventFooter}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{event.category}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.interestButton, event.isInterested && styles.interestButtonActive]}
                    onPress={() => handleInterestClick(event.eventId, event.isInterested || false)}
                  >
                    <Text style={[styles.interestButtonText, event.isInterested && styles.interestButtonTextActive]}>
                      {event.isInterested ? "Me interesa ❤️" : "Me interesa"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/radar")}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/chats")}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.navIconActive]} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/profile")}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E2A3E",
  },
  header: {
    backgroundColor: "#0E2A3E",
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
    color: "#0E2A3E",
  },
  categoriesScroll: {
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A3A4F",
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
    color: "#94A3B8",
  },
  categoryTextActive: {
    color: "#0E2A3E",
  },
  myEventsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A3A4F",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
  },
  myEventsButtonActive: {
    backgroundColor: "#FF4FD8",
    borderColor: "#FF4FD8",
  },
  myEventsText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94A3B8",
  },
  myEventsTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: "#94A3B8",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#5A6E7A",
  },
  eventCard: {
    backgroundColor: "#1A3A4F",
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
    color: "#0E2A3E",
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
    color: "#94A3B8",
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  eventDate: {
    fontSize: 14,
    color: "#94A3B8",
  },
  eventAttendees: {
    fontSize: 14,
    color: "#94A3B8",
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
    backgroundColor: "#FF4FD8",
  },
  interestButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0E2A3E",
  },
  interestButtonTextActive: {
    color: "#FFFFFF",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#5A6E7A",
  },
  navIconActive: {
    backgroundColor: "#00FFB3",
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#5A6E7A",
  },
  navLabelActive: {
    color: "#00FFB3",
  },
})
