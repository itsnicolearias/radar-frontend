import React from "react"
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native"
import { X } from "lucide-react-native"
import type { IEventResponse } from "@radar/types"

interface EventDetailModalProps {
  event: IEventResponse
  onClose: () => void
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  return (
    <Modal visible transparent onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{event.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#C5C5C5" />
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>{event.description}</Text>
          <View style={styles.details}>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Ubicación:</Text> {event.location}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Fecha:</Text> {new Date(event.date).toLocaleDateString("es-AR")}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#1A1A1A",
    padding: 24,
    borderRadius: 24,
    width: "90%",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  description: {
    color: "#C5C5C5",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  details: {
    marginTop: 16,
  },
  detailText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
})
