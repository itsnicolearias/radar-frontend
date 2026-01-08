"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { ArrowLeft, Send, X } from "lucide-react-native"
import { MotiView } from "moti"
import { useChatStore, useAuthStore, useSocketEvent } from "@radar/features"
import { messageService, emitSocketEvent } from "@radar/api"
import type { IMessageResponse } from "@radar/types"
import { useSafeAreaInsets } from "react-native-safe-area-context"

function ChatConversationPage() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const userId = params.userId as string
  const insets = useSafeAreaInsets()

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
      const msg = await messageService.sendMessage(messageData)
      emitSocketEvent("send-message", messageData)
      setReplyingToSignal(null)
      setMessage("")

      addMessage(userId, msg)
      await messageService.markAsRead([msg.messageId])
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

  const firstMsg = userMessages[0]
  const name = firstMsg
    ? firstMsg.Sender.userId === userId
      ? firstMsg.Sender.displayName
      : firstMsg.Receiver.displayName
    : "Chat"

  const photoUrl = firstMsg
    ? firstMsg.senderId === userId
      ? firstMsg.Sender?.Profile?.photoUrl
      : firstMsg.Receiver?.Profile?.photoUrl
    : ""

  const distance = firstMsg
    ? firstMsg.Sender?.userId === userId
      ? firstMsg.Sender?.distance
      : firstMsg.Receiver?.distance
    : 0

  const formatDistance = (distance?: number) => {
    if (!distance) return "Cerca"
    if (distance < 50) return "50m"
    if (distance < 1000) return `${Math.round(distance)}m`
    return `${(distance / 1000).toFixed(1)}km`
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color="#00FFB3" size={20} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <View style={styles.headerAvatar}>
              {photoUrl && photoUrl !== "" ? (
                <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.headerAvatarText}>{name?.[0] || "?"}</Text>
              )}
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{name}</Text>
              <View style={styles.headerMeta}>
                <View style={styles.distanceDot} />
                <Text style={styles.distanceText}>{formatDistance(distance)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {userMessages.map((msg, index) => {
          const isSent = msg.senderId === user?.userId
          return (
            <MotiView
              key={msg.messageId}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 50 }}
              style={[styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble]}
            >
              <View style={[styles.bubble, isSent ? styles.sentBubbleInner : styles.receivedBubbleInner]}>
                <Text style={[styles.messageText, isSent && styles.sentMessageText]}>{msg.content}</Text>
              </View>
              <Text style={[styles.timestamp, isSent ? styles.timestampSent : styles.timestampReceived]}>
                {formatTimestamp(String(msg.createdAt))}
              </Text>
            </MotiView>
          )
        })}
      </ScrollView>

      {replyingToSignal && (
        <View style={styles.replyingToContainer}>
          <View style={styles.replyingToContent}>
            <Text style={styles.replyingToLabel}>Respondiendo a la señal:</Text>
            <Text style={styles.replyingToText}>{replyingToSignal.note}</Text>
          </View>
          <TouchableOpacity onPress={() => setReplyingToSignal(null)} style={styles.closeReplyButton}>
            <X color="#C5C5C5" size={16} />
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Escribí un mensaje..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Send color="#000" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default function ChatConversationPageWithSuspense() {
  return (
    <Suspense
      fallback={
        <View style={styles.container}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      }
    >
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
    backgroundColor: "rgba(26, 26, 26, 0.5)",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 179, 0.2)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 179, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  distanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1DE3F2",
  },
  distanceText: {
    fontSize: 12,
    color: "#1DE3F2",
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: "75%",
    marginBottom: 12,
  },
  sentBubble: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  receivedBubble: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  sentBubbleInner: {
    backgroundColor: "#00FFB3",
  },
  receivedBubbleInner: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#FFFFFF",
  },
  sentMessageText: {
    color: "#000000",
  },
  timestamp: {
    fontSize: 11,
    color: "#C5C5C5",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  timestampSent: {
    textAlign: "right",
  },
  timestampReceived: {
    textAlign: "left",
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  replyingToContainer: {
    backgroundColor: "#1A1A1A",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  replyingToContent: {
    flex: 1,
  },
  replyingToLabel: {
    fontSize: 12,
    color: "#C5C5C5",
    marginBottom: 4,
  },
  replyingToText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  closeReplyButton: {
    padding: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 255, 179, 0.2)",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    borderRadius: 24,
    color: "#FFFFFF",
    fontSize: 14,
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: "#00FFB3",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  loadingText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 100,
  },
})
