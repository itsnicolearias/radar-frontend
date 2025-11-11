import React from "react"
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native"
import { X } from "lucide-react-native"
import type { ISignal } from "@radar/types"

interface SignalDetailModalProps {
  signal: ISignal
  onClose: () => void
  onRespond: (signalId: string) => void
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({ signal, onClose, onRespond }) => {
  return (
    <Modal visible transparent onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Señal de {signal.senderId}</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.note}>{signal.note}</Text>
          <TouchableOpacity style={styles.respondButton} onPress={() => onRespond(signal.signalId)}>
            <Text style={styles.respondButtonText}>Responder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#1F2937",
    padding: 24,
    borderRadius: 16,
    width: "80%",
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
  note: {
    color: "#FFFFFF",
    marginBottom: 16,
  },
  respondButton: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  respondButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
})
