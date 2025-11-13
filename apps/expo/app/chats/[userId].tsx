"use client"

import React, { useEffect, useState, useRef, Suspense } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { ArrowLeft } from "lucide-react-native"
import { useChatStore, useAuthStore, useSocketEvent } from "@radar/features"
import { messageService, emitSocketEvent, signalService } from "@radar/api"
import type { IMessageResponse, IRadarSignal } from "@radar/types"

function ChatConversationPage() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const userId = params.userId as string

  const { user } = useAuthStore()
  const { messages, setMessages, addMessage, resetUnreadCount, replyingToSignal, setReplyingToSignal } = useChatStore()
  const [isTyping, setIsTyping] = useState(false)
  const [message, setMessage] = useState("")
  const scrollViewRef = useRef<ScrollView>(null)

  const userMessages = messages[userId] || []

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await messageService.getMessages(userId)
        setMessages(userId, data)
        resetUnreadCount(userId)
      } catch (error) {
        console.error("[v0] Error fetching messages:", error)
      }
    }

    fetchMessages()
  }, [userId, setMessages, resetUnreadCount])

  useSocketEvent<IMessageResponse>(
    "new-message",
    (message) => {
      if (message.senderId === userId || message.receiverId === userId) {
        addMessage(userId, message)
        if (message.senderId === userId) {
          messageService.markAsRead([message.messageId])
        }
      }
    },
    [userId, addMessage],
  )

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      const messageData = {
        receiverId: userId,
        content: message,
        signalId: replyingToSignal ? replyingToSignal.signalId : undefined,
      }
      await messageService.sendMessage(messageData)
      emitSocketEvent("send-message", messageData)
      setReplyingToSignal(null)
      setMessage("")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  const formatTimestamp = (date: string) => {
    return new Date(date).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userId}</Text>
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {userMessages.map((msg) => (
          <View
            key={msg.messageId}
            style={[
              styles.messageBubble,
              msg.senderId === user?.userId ? styles.sentBubble : styles.receivedBubble,
            ]}
          >
            <Text style={styles.messageText}>{msg.content}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(String(msg.createdAt))}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        {replyingToSignal && (
          <View style={styles.replyingToContainer}>
            <Text style={styles.replyingToText}>Respondiendo a: {replyingToSignal.note}</Text>
            <TouchableOpacity onPress={() => setReplyingToSignal(null)}>
              <Text style={styles.closeReplyText}>&times;</Text>
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#8A8A8A"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function ChatConversationPageWithSuspense() {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ChatConversationPage />
    </Suspense>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#1A1A1A",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 179, 0.2)",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  messagesContainer: {
    padding: 10,
    flexGrow: 1,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "80%",
  },
  sentBubble: {
    backgroundColor: "#00FFB3",
    alignSelf: "flex-end",
  },
  receivedBubble: {
    backgroundColor: "#1A1A1A",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "white",
  },
  timestamp: {
    color: "#C5C5C5",
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopColor: "rgba(0, 255, 179, 0.2)",
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },
  sendButtonText: {
    color: "#00FFB3",
    fontWeight: "bold",
  },
  replyingToContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1A1A1A",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#00FFB3",
  },
  replyingToText: {
    color: "white",
  },
  closeReplyText: {
    color: "white",
    fontSize: 18,
  },
})
