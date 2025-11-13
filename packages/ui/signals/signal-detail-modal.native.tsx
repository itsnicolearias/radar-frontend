import React from "react"
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native"
import { X } from "lucide-react-native"
import { IRadarSignal } from "@radar/types"

interface SignalDetailModalProps {
  signal: IRadarSignal
  onClose: () => void
  onRespond: (signal: ISignal) => void
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({ signal, onClose, onRespond }) => {
  return (
    <Modal visible transparent onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Señal de {signal.Sender.firstName}</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#C5C5C5" />
            </TouchableOpacity>
          </View>
          <Text style={styles.note}>{signal.note}</Text>
          <TouchableOpacity style={styles.respondButton} onPress={() => onRespond(signal)}>
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
    borderColor: "rgba(255, 0, 92, 0.3)",
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
    color: "#C5C5C5",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  respondButton: {
    backgroundColor: "#00FFB3",
    padding: 16,
    borderRadius: 9999,
    alignItems: "center",
    marginTop: 16,
  },
  respondButtonText: {
    color: "#000000",
    fontWeight: "bold",
  },
})
