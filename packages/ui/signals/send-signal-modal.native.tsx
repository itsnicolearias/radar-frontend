import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native"
import { X } from "lucide-react-native"

interface SendSignalModalProps {
  onClose: () => void
  onSend: (note: string | null) => void
}

export const SendSignalModal: React.FC<SendSignalModalProps> = ({ onClose, onSend }) => {
  const [note, setNote] = useState("")

  const handleSend = () => {
    onSend(note.trim() || null)
    onClose()
  }

  return (
    <Modal visible transparent onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Enviar Señal</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Escribe tu mensaje temporal..."
            placeholderTextColor="#9CA3AF"
            style={styles.textarea}
            maxLength={100}
            multiline
          />
          <Text style={styles.charCount}>{note.length}/100</Text>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Enviar Señal (1/día)</Text>
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
  textarea: {
    backgroundColor: "#374151",
    color: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
    height: 100,
    textAlignVertical: "top",
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
  },
  sendButton: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
})
