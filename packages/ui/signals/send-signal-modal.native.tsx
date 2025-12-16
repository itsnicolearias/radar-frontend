"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native"
import { X, Send } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

interface SendSignalModalNativeProps {
  onClose: () => void
  onSend: (note?: string, quickReply?: string, availableToChat?: boolean, inPark?: boolean) => void
}

export const SendSignalModalNative: React.FC<SendSignalModalNativeProps> = ({ onClose, onSend }) => {
  const [note, setNote] = useState("")
  const [selectedQuickReply, setSelectedQuickReply] = useState<string | null>(null)
  const [availableToChat, setAvailableToChat] = useState(false)
  const [inPark, setInPark] = useState(false)

  const quickReplies = ["¿Alguien más por acá?", "Disponible para charlar 💬", "En el parque 🏞️"]

  const handleSend = () => {
    onSend(note.trim() || undefined, selectedQuickReply || undefined, availableToChat, inPark)
    onClose()
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Enviar Señal</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="#8B8B8B" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Escribe tu mensaje temporal..."
              placeholderTextColor="rgba(197, 197, 197, 0.5)"
              style={styles.textarea}
              maxLength={100}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.charCount}>{note.length}/100</Text>

            <View style={styles.quickRepliesContainer}>
              {quickReplies.map((reply, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.quickReplyChip, selectedQuickReply === reply && styles.quickReplyChipActive]}
                  onPress={() => setSelectedQuickReply(selectedQuickReply === reply ? null : reply)}
                >
                  <Text style={[styles.quickReplyText, selectedQuickReply === reply && styles.quickReplyTextActive]}>
                    {reply}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <LinearGradient
                colors={["#00FFB3", "#1DE3F2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sendButtonGradient}
              >
                <Send color="#000000" size={20} />
                <Text style={styles.sendButtonText}>Enviar señal (1/día)</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(26, 26, 26, 0.95)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  textarea: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    height: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    fontSize: 16,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#8B8B8B",
    marginTop: 8,
    marginBottom: 16,
  },
  quickRepliesContainer: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  quickReplyChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
  },
  quickReplyChipActive: {
    backgroundColor: "rgba(0, 255, 179, 0.1)",
    borderColor: "#00FFB3",
  },
  quickReplyText: {
    color: "#C5C5C5",
    fontSize: 14,
    fontWeight: "500",
  },
  quickReplyTextActive: {
    color: "#00FFB3",
  },
  sendButton: {
    marginTop: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  sendButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  sendButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },
})
