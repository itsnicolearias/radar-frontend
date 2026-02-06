"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, X, Send, Trash2, MoreVertical } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useChatStore, useAuthStore, useSocketEvent } from "@radar/features"
import { messageService, emitSocketEvent, signalService, connectionService } from "@radar/api"
import type { IMessageResponse, IRadarSignal, IRadarUser } from "@radar/types"
import { UserProfileModal } from "@radar/ui"
import { useConnectionStore } from "@radar/features"

function ChatConversationPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string

  const { user } = useAuthStore()
  const { messages, setMessages, addMessage, resetUnreadCount, replyingToSignal, setReplyingToSignal, removeMessage, removeConversation } = useChatStore()
  const { connections, pendingRequests, myPendingRequests } = useConnectionStore()
  const [isTyping, setIsTyping] = useState(false)
  const [message, setMessage] = useState("")
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileUser, setProfileUser] = useState<IRadarUser | null>(null)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const signalId = searchParams.get("signalId")

  const [optimisticMessages, setOptimisticMessages] = useState<IMessageResponse[]>([])

  const allMessages = [...(messages[userId] || []), ...optimisticMessages]
  const userMessages = allMessages.filter((msg) => !msg.deletedFor?.includes(user!.userId))

  useEffect(() => {
    if (!signalId) return

    const fetchSignal = async () => {
      try {
        const signal = await signalService.getSignalById(signalId)
      } catch (error) {
        console.error("Error fetching signal:", error)
      }
    }

    fetchSignal()
  }, [signalId])

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

  useSocketEvent<{ userId: string }>(
    "user-typing",
    (data) => {
      if (data.userId === userId) {
        setIsTyping(true)
      }
    },
    [userId],
  )

  useSocketEvent<{ userId: string }>(
    "user-stopped-typing",
    (data) => {
      if (data.userId === userId) {
        setIsTyping(false)
      }
    },
    [userId],
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages[userId], optimisticMessages])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const optimisticMessage: IMessageResponse = {
      messageId: `temp-${Date.now()}`,
      senderId: user!.userId,
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
      alert("No se pudo enviar el mensaje")
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
    ? firstMsg.senderId === userId
      ? firstMsg?.Sender?.displayName
      : firstMsg?.Receiver?.displayName
    : "Chat"

  const photoUrl = firstMsg
    ? firstMsg.senderId === userId
      ? firstMsg.Sender.Profile?.photoUrl
      : firstMsg.Receiver.Profile?.photoUrl
    : ""

  const formatDistance = (distance?: number) => {
    if (!distance) return "Cerca"
    if (distance < 50) return "50m"
    if (distance < 1000) return `${Math.round(distance)}m`
    return `${(distance / 1000).toFixed(1)}km`
  }

  const distance = firstMsg ? (firstMsg.senderId === userId ? firstMsg.Sender.distance : firstMsg.Receiver.distance) : 0

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
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const isTheConnectionPending = (userId: string): boolean => {
    const isPending = myPendingRequests.some((c) => c.receiverId === userId)
    return isPending
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("¿Eliminar este mensaje?")) return
    
    try {
      await messageService.deleteMessage(messageId)
      removeMessage(userId, messageId)
    } catch (error) {
      console.error("[v0] Error deleting message:", error)
      alert("No se pudo eliminar el mensaje")
    }
  }

  const handleDeleteConversation = async () => {
    if (!confirm("¿Eliminar toda la conversación? Esta acción no se puede deshacer.")) return
    
    try {
      await messageService.deleteConversation(userId)
      removeConversation(userId)
      router.push("/chats")
    } catch (error) {
      console.error("[v0] Error deleting conversation:", error)
      alert("No se pudo eliminar la conversación")
    }
  }

  return (
    <div className="h-screen bg-black flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 20%, rgba(0, 255, 179, 0.08) 0%, transparent 60%)",
        }}
      />

      <header className="relative z-10 bg-[#1A1A1A]/50 backdrop-blur-lg p-6 pt-12 flex items-center gap-4 border-b border-[#00FFB3]/20">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-[#00FFB3]/30"
        >
          <ArrowLeft className="w-5 h-5 text-[#00FFB3]" />
        </button>

        <button onClick={handleOpenProfile} className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-[#00FFB3]/50">
            {photoUrl && photoUrl !== "" ? (
              <img
                src={photoUrl || "/placeholder.svg"}
                alt={name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-[#1A1A1A] font-semibold text-base">{name?.[0] || "U"}</span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-white text-left">{name}</h2>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#1DE3F2] rounded-full" />
              <span className="text-xs text-[#1DE3F2]">{formatDistance(distance)}</span>
            </div>
          </div>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-[#00FFB3]/30"
          >
            <MoreVertical className="w-5 h-5 text-[#00FFB3]" />
          </button>

          <AnimatePresence>
            {showOptionsMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-12 bg-[#1A1A1A] border border-[#00FFB3]/30 rounded-xl shadow-2xl z-50 min-w-[200px] overflow-hidden"
              >
                <button
                  onClick={() => {
                    setShowOptionsMenu(false)
                    handleDeleteConversation()
                  }}
                  className="w-full px-4 py-3 text-left text-[#FF005C] hover:bg-[#FF005C]/10 transition-colors flex items-center gap-3"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar conversación
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="relative flex-1 overflow-y-auto px-6 py-6 flex flex-col">
        {userMessages.map((msg, index) => {
          const isSent = msg.senderId === user?.userId
          return (
            <motion.div
              key={msg.messageId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex flex-col max-w-[75%] mb-4 group ${isSent ? "self-end items-end" : "self-start items-start"}`}
            >
              <div className="relative">
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    isSent
                      ? "bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black shadow-lg shadow-[#00FFB3]/20"
                      : "bg-[#1A1A1A] text-white border border-[#00FFB3]/30"
                  }`}
                >
                  {msg.Signal && (
                    <div className={`mb-2 pb-2 border-b ${isSent ? "border-black/20" : "border-white/20"}`}>
                      <p className={`text-xs ${isSent ? "text-black/60" : "text-white/60"} mb-1`}>Respuesta a señal:</p>
                      <p className={`text-xs italic ${isSent ? "text-black/80" : "text-white/80"}`}>
                        "{msg.Signal.note}"
                      </p>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                {!msg.messageId.startsWith("temp-") && (
                  <button
                    onClick={() => handleDeleteMessage(msg.messageId)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF005C] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Eliminar mensaje"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
              <span className="text-xs text-[#C5C5C5] mt-1 px-1">{formatTimestamp(String(msg.createdAt))}</span>
            </motion.div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {replyingToSignal && (
        <div className="relative bg-[#1A1A1A] p-3 mx-6 mb-2 rounded-xl border border-[#00FFB3]/20">
          <p className="text-xs text-[#C5C5C5]">Respondiendo a la señal:</p>
          <p className="text-sm text-white">{replyingToSignal.note}</p>
          <button
            onClick={() => setReplyingToSignal(null)}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:scale-110 transition-transform"
          >
            <X className="w-4 h-4 text-[#C5C5C5]" />
          </button>
        </div>
      )}

      <div className="relative p-6 bg-black border-t border-[#00FFB3]/20">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Escribí un mensaje..."
            className="flex-1 h-14 px-4 bg-[#1A1A1A] backdrop-blur-sm border border-[#00FFB3]/30 rounded-full focus:ring-2 focus:ring-[#00FFB3]/50 text-white placeholder-white/50 outline-none transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="w-14 h-14 bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center shadow-lg shadow-[#00FFB3]/30 hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      {showProfileModal && profileUser && (
        <UserProfileModal
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
    </div>
  )
}

export default function ChatConversationPageWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-black flex items-center justify-center">
          <p className="text-white">Cargando...</p>
        </div>
      }
    >
      <ChatConversationPage />
    </Suspense>
  )
}
