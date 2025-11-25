"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, X, Send } from "lucide-react"
import { motion } from "framer-motion"
import { useChatStore, useAuthStore, useSocketEvent } from "@radar/features"
import { messageService, emitSocketEvent, signalService } from "@radar/api"
import type { IMessageResponse, IRadarSignal } from "@radar/types"

function ChatConversationPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string

  const { user } = useAuthStore()
  const { messages, setMessages, addMessage, resetUnreadCount } = useChatStore()
  const [isTyping, setIsTyping] = useState(false)
  const [message, setMessage] = useState("")
  const [replyingTo, setReplyingTo] = useState<IRadarSignal | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const signalId = searchParams.get("signalId")

  const userMessages = messages[userId] || []

  useEffect(() => {
    if (!signalId) return

    const fetchSignal = async () => {
      try {
        const signal = await signalService.getSignalById(signalId)
        setReplyingTo(signal)
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
  }, [messages[userId]])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      const messageData = {
        receiverId: userId,
        content: message,
        signalId: replyingTo ? replyingTo.signalId : undefined,
      }
      const msg = await messageService.sendMessage(messageData)
      emitSocketEvent("send-message", messageData)
      setReplyingTo(null)
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
    ? firstMsg.senderId === userId
      ? firstMsg.Sender.displayName
      : firstMsg.Receiver.displayName
    : "Chat"

  const formatDistance = (distance?: number) => {
    if (!distance) return "Cerca"
    if (distance < 1000) return `${Math.round(distance)}m`
    return `${(distance / 1000).toFixed(1)}km`
  }

  const distance = firstMsg ?? firstMsg?.senderId === userId
      ? firstMsg?.Sender?.distance
      : firstMsg?.Receiver?.distance


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

        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-[#00FFB3]/50">
            <span className="text-[#1A1A1A] font-semibold">{name[0]}</span>
          </div>
          <div>
            <h2 className="font-semibold text-white">{name}</h2>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#1DE3F2] rounded-full" />
              <span className="text-xs text-[#1DE3F2]">{formatDistance(distance)}</span>
            </div>
          </div>
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
              className={`flex flex-col max-w-[75%] mb-4 ${isSent ? "self-end items-end" : "self-start items-start"}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl ${
                  isSent
                    ? "bg-linear-to-r from-[#00FFB3] to-[#1DE3F2] text-black shadow-lg shadow-[#00FFB3]/20"
                    : "bg-[#1A1A1A] text-white border border-[#00FFB3]/30"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
              <span className="text-xs text-[#C5C5C5] mt-1 px-1">{formatTimestamp(String(msg.createdAt))}</span>
            </motion.div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {replyingTo && (
        <div className="relative bg-[#1A1A1A] p-3 mx-6 mb-2 rounded-xl border border-[#00FFB3]/20">
          <p className="text-xs text-[#C5C5C5]">Respondiendo a la señal:</p>
          <p className="text-sm text-white">{replyingTo.note}</p>
          <button
            onClick={() => setReplyingTo(null)}
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
            className="w-14 h-14 bg-linear-to-r from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center shadow-lg shadow-[#00FFB3]/30 hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
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
