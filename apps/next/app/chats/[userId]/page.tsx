"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { MessageBubble, ChatInput } from "@radar/ui"
import { useChatStore, useAuthStore, useSocketEvent } from "@radar/features"
import { messageService, emitSocketEvent } from "@radar/api"
import type { Message } from "@radar/types"

export default function ChatConversationPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string

  const { user } = useAuthStore()
  const { messages, setMessages, addMessage, resetUnreadCount, typingUsers } = useChatStore()
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  useSocketEvent<Message>(
    "new-message",
    (message) => {
      if (message.senderId === userId || message.receiverId === userId) {
        addMessage(userId, message)
        if (message.senderId === userId) {
          messageService.markAsRead(message.messageId)
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
  }, [userMessages])

  const handleSendMessage = async (content: string) => {
    try {
      await messageService.sendMessage({ receiverId: userId, content })
      emitSocketEvent("send-message", { receiverId: userId, content })
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  const handleTyping = () => {
    emitSocketEvent("typing", { receiverId: userId })
  }

  const handleStopTyping = () => {
    emitSocketEvent("stop-typing", { receiverId: userId })
  }

  const formatTimestamp = (date: string) => {
    return new Date(date).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col h-screen bg-[#0E2A3E]">
      {/* Header */}
      <header className="bg-[#2C5F8D] text-white px-4 py-3 pt-12 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00FFB3] flex items-center justify-center">
            <span className="text-[#0E2A3E] font-semibold text-sm">{userId.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-semibold">Usuario</h2>
            <p className="text-xs text-white/70">{isTyping ? "Escribiendo..." : "120m de distancia"}</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col">
        {userMessages.map((message) => (
          <MessageBubble
            key={message.messageId}
            content={message.content}
            timestamp={formatTimestamp(message.createdAt)}
            isSent={message.senderId === user?.userId}
            isRead={message.isRead}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} onTyping={handleTyping} onStopTyping={handleStopTyping} />
    </div>
  )
}
