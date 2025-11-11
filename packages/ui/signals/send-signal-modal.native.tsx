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
              <X color="#C5C5C5" />
            </TouchableOpacity>
          </View>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Escribe tu mensaje temporal..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
  textarea: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    height: 96,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#C5C5C5",
    marginTop: 8,
  },
  sendButton: {
    backgroundColor: "#00FFB3",
    padding: 16,
    borderRadius: 9999,
    alignItems: "center",
    marginTop: 24,
  },
  sendButtonText: {
    color: "#000000",
    fontWeight: "bold",
  },
})
