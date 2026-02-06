"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Modal, TextInput } from "react-native"
import { useRouter } from "expo-router"
import { useEventsStore, useAuthStore } from "@radar/features"
import { eventService } from "@radar/api"
import { BottomNavNative } from "../../../packages/ui/navigation/bottom-nav.native"
import { Edit, Trash2, X } from "lucide-react-native"
import type { IEventResponse } from "@radar/types"

const { width } = Dimensions.get("window")
const CATEGORIES = ["Todos", "Música", "Gastronomía", "Arte", "Deportes", "Social"]

export default function EventsScreen() {
  const router = useRouter()
  const { events, setEvents, toggleInterest, selectedCategory, setSelectedCategory, setLoading, removeEvent } = useEventsStore()
  const { user } = useAuthStore()
  const [showMyEvents, setShowMyEvents] = useState(false)
  const [editingEvent, setEditingEvent] = useState<IEventResponse | null>(null)

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

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      "Eliminar evento",
      "¿Estás seguro que deseas eliminar el evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eventService.deleteEvent(eventId)
              removeEvent(eventId)
              Alert.alert("Éxito", "Evento eliminado correctamente")
            } catch (error) {
              console.error("[v0] Error deleting event:", error)
              Alert.alert("Error", "Error al eliminar el evento")
            }
          },
        },
      ]
    )
  }

  const handleSaveEdit = async () => {
    if (!editingEvent) return

    try {
      const updated = await eventService.updateEvent(editingEvent.eventId, {
        title: editingEvent.title,
        description: editingEvent.description,
        location: editingEvent.location,
        price: editingEvent.price,
      })
      
      setEvents(events.map(e => e.eventId === updated.eventId ? updated : e))
      setEditingEvent(null)
      Alert.alert("Éxito", "Evento actualizado correctamente")
    } catch (error) {
      console.error("[v0] Error updating event:", error)
      Alert.alert("Error", "Error al actualizar el evento")
    }
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
            const isOwner = event.userId === user?.userId

            return (
              <View key={event.eventId} style={styles.eventCardWrapper}>
                <TouchableOpacity
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

                {isOwner && (
                  <View style={styles.eventActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => setEditingEvent(event)}
                    >
                      <Edit color="#000" size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteEvent(event.eventId)}
                    >
                      <Trash2 color="#FFF" size={16} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )
          })
        )}
      </ScrollView>

      <Modal
        visible={!!editingEvent}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingEvent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>Editar evento</Text>
              <TouchableOpacity onPress={() => setEditingEvent(null)}>
                <X color="#C5C5C5" size={24} />
              </TouchableOpacity>
            </View>

            {editingEvent && (
              <View style={styles.editForm}>
                <Text style={styles.editLabel}>Título</Text>
                <TextInput
                  style={styles.editInput}
                  value={editingEvent.title}
                  onChangeText={(text) => setEditingEvent({ ...editingEvent, title: text })}
                  placeholderTextColor="#7f7f7f"
                />

                <Text style={styles.editLabel}>Descripción</Text>
                <TextInput
                  style={[styles.editInput, styles.editTextarea]}
                  value={editingEvent.description}
                  onChangeText={(text) => setEditingEvent({ ...editingEvent, description: text })}
                  multiline
                  placeholderTextColor="#7f7f7f"
                />

                <Text style={styles.editLabel}>Ubicación</Text>
                <TextInput
                  style={styles.editInput}
                  value={editingEvent.location}
                  onChangeText={(text) => setEditingEvent({ ...editingEvent, location: text })}
                  placeholderTextColor="#7f7f7f"
                />

                <Text style={styles.editLabel}>Precio</Text>
                <TextInput
                  style={styles.editInput}
                  value={String(editingEvent.price)}
                  onChangeText={(text) => setEditingEvent({ ...editingEvent, price: Number(text) })}
                  keyboardType="numeric"
                  placeholderTextColor="#7f7f7f"
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                  <Text style={styles.saveButtonText}>Guardar cambios</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

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
  eventCardWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  eventActions: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    backgroundColor: "#00FFB3",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: 32,
    height: 32,
    backgroundColor: "#FF005C",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  editModal: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    width: "100%",
    maxWidth: 400,
    padding: 20,
  },
  editModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  editForm: {
    gap: 12,
  },
  editLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  editInput: {
    backgroundColor: "#0D0D0D",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 14,
  },
  editTextarea: {
    height: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#00FFB3",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
})
