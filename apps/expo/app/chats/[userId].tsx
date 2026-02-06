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
  Alert,
  Modal,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { ArrowLeft, Send, X, Trash2, MoreVertical } from "lucide-react-native"
import { MotiView, AnimatePresence } from "moti"
import { useChatStore, useAuthStore, useSocketEvent, useConnectionStore } from "@radar/features"
import { messageService, emitSocketEvent, connectionService } from "@radar/api"
import type { IMessageResponse, IRadarUser } from "@radar/types"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { UserProfileModalNative } from "../../../../packages/ui/profile/user-profile-modal.native"

function ChatConversationPage() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const userId = params.userId as string
  const insets = useSafeAreaInsets()

  const { user } = useAuthStore()
  const { messages, setMessages, addMessage, resetUnreadCount, replyingToSignal, setReplyingToSignal, removeMessage, removeConversation } = useChatStore()
  const { connections, pendingRequests, removeConnection, myPendingRequests } = useConnectionStore()
  const [isTyping, setIsTyping] = useState(false)
  const [message, setMessage] = useState("")
  const [optimisticMessages, setOptimisticMessages] = useState<IMessageResponse[]>([])
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileUser, setProfileUser] = useState<IRadarUser | null>(null)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  const allMessages = [...(messages[userId] || []), ...optimisticMessages]
  const userMessages = allMessages.filter((msg) => !msg.deletedFor?.includes(user!.userId))

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await messageService.getMessages(userId)
        setMessages(userId, data)
        resetUnreadCount(userId)

        const unreadMessages = data.filter((msg) => !msg.isRead && msg.receiverId === user?.userId && !msg.deletedFor?.includes(user?.userId))
        
        if (unreadMessages.length > 0) {
          const unreadIds = unreadMessages.map((msg) => msg.messageId)
          await messageService.markAsRead(unreadIds)
        }
      } catch (error) {
        console.error("[v0] Error fetching messages:", error)
      }
    }

    fetchMessages()
  }, [userId, setMessages, resetUnreadCount, user?.userId])

  useSocketEvent<IMessageResponse>(
    "new-message",
    async (message) => {
      if (message.senderId === userId || message.receiverId === userId) {
        addMessage(userId, message)
        if (message.senderId === userId && !message.isRead) {
          try {
            await messageService.markAsRead([message.messageId])
          } catch (error) {
            console.error("[v0] Error marking message as read:", error)
          }
        }
      }
    },
    [userId, addMessage],
  )

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const optimisticMessage: IMessageResponse = {
      messageId: `temp-${Date.now()}`,
      senderId: user?.userId!,
      receiverId: userId,
      content: message,
      createdAt: new Date(),
      isRead: false,
      Signal: replyingToSignal ? replyingToSignal : undefined,
      Sender: user as any,
      Receiver: {} as any,
    }

    setOptimisticMessages((prev) => [...prev, optimisticMessage])
    const messageContent = message
    setMessage("")
    setReplyingToSignal(null)

    try {
      const messageData = {
        receiverId: userId,
        content: messageContent,
        signalId: replyingToSignal ? replyingToSignal.signalId : undefined,
      }
      const msg = await messageService.sendMessage(messageData)
      emitSocketEvent("send-message", messageData)

      setOptimisticMessages((prev) => prev.filter((m) => m.messageId !== optimisticMessage.messageId))
      addMessage(userId, msg)
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      setOptimisticMessages((prev) => prev.filter((m) => m.messageId !== optimisticMessage.messageId))
      Alert.alert("Error", "No se pudo enviar el mensaje")
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

  const handleOpenProfile = () => {
    if (!firstMsg) return
    const otherUser = firstMsg.senderId === userId ? firstMsg.Sender : firstMsg.Receiver
    setProfileUser(otherUser as IRadarUser)
    setShowProfileModal(true)
  }

  const isUserConnected = (userId: string): boolean => {
    const isConnected = connections.some((c) => c.receiverId === userId || c.senderId === userId)
    return isConnected
  }

  const handleConnect = async (receiverId: string) => {
    try {
      await connectionService.createConnection(receiverId!)
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const handleDeleteConnection = async (userId: string) => {
    try {
      const conecc = connections.find((c) => c.receiverId === userId || c.senderId === userId)
      if (!conecc) return
      const { connectionId } = conecc
      await connectionService.deleteConnection(connectionId)
      removeConnection(connectionId)
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const isTheConnectionPending = (userId: string): boolean => {
    const isPending = myPendingRequests.some((c) => c.receiverId === userId)
    return isPending
  }

  const handleDeleteMessage = async (messageId: string) => {
    Alert.alert(
      "Eliminar mensaje",
      "¿Eliminar este mensaje?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await messageService.deleteMessage(messageId)
              removeMessage(userId, messageId)
            } catch (error) {
              console.error("[v0] Error deleting message:", error)
              Alert.alert("Error", "No se pudo eliminar el mensaje")
            }
          },
        },
      ]
    )
  }

  const handleDeleteConversation = async () => {
    Alert.alert(
      "Eliminar conversación",
      "¿Eliminar toda la conversación? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await messageService.deleteConversation(userId)
              removeConversation(userId)
              router.push("/chats")
            } catch (error) {
              console.error("[v0] Error deleting conversation:", error)
              Alert.alert("Error", "No se pudo eliminar la conversación")
            }
          },
        },
      ]
    )
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

          <TouchableOpacity onPress={handleOpenProfile} style={styles.headerInfo}>
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
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowOptionsMenu(true)} style={styles.optionsButton}>
            <MoreVertical color="#00FFB3" size={20} />
          </TouchableOpacity>
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
              <View style={styles.messageContainer}>
                <View style={[styles.bubble, isSent ? styles.sentBubbleInner : styles.receivedBubbleInner]}>
                  {msg.Signal && (
                    <View style={[styles.signalReply, isSent ? styles.signalReplySent : styles.signalReplyReceived]}>
                      <Text style={[styles.signalReplyLabel, isSent && styles.signalReplyLabelSent]}>
                        Respuesta a señal:
                      </Text>
                      <Text style={[styles.signalReplyText, isSent && styles.signalReplyTextSent]}>
                        "{msg.Signal.note}"
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.messageText, isSent && styles.sentMessageText]}>{msg.content}</Text>
                </View>
                {!msg.messageId.startsWith("temp-") && (
                  <TouchableOpacity
                    onPress={() => handleDeleteMessage(msg.messageId)}
                    style={styles.deleteMessageButton}
                  >
                    <Trash2 color="#FFFFFF" size={12} />
                  </TouchableOpacity>
                )}
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

      <Modal
        visible={showOptionsMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptionsMenu(false)}
        >
          <View style={styles.optionsModal}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsMenu(false)
                handleDeleteConversation()
              }}
            >
              <Trash2 color="#FF005C" size={20} />
              <Text style={styles.optionText}>Eliminar conversación</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {showProfileModal && profileUser && (
        <UserProfileModalNative
          user={profileUser}
          onClose={() => setShowProfileModal(false)}
          onMessage={() => {
            setShowProfileModal(false)
          }}
          isUserConnected={() => isUserConnected(profileUser.userId)}
          sendConnection={() => handleConnect(profileUser.userId)}
          deleteConnection={() => handleDeleteConnection(profileUser.userId)}
          isConnectionPending={() => isTheConnectionPending(profileUser.userId)}
        />
      )}
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
  signalReply: {
    marginBottom: 8,
    paddingBottom: 8,
  },
  signalReplySent: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
  },
  signalReplyReceived: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  signalReplyLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },
  signalReplyLabelSent: {
    color: "rgba(0, 0, 0, 0.6)",
  },
  signalReplyText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "rgba(255, 255, 255, 0.8)",
  },
  signalReplyTextSent: {
    color: "rgba(0, 0, 0, 0.8)",
  },
  optionsButton: {
    width: 40,
    height: 40,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    position: "relative",
  },
  deleteMessageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: "#FF005C",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsModal: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    minWidth: 250,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  optionText: {
    fontSize: 16,
    color: "#FF005C",
    fontWeight: "500",
  },
})
