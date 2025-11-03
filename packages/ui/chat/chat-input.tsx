"use client"

import type React from "react"
import { useState } from "react"
import { Send } from "lucide-react"
import { cn } from "../lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  onTyping?: () => void
  onStopTyping?: () => void
  placeholder?: string
  className?: string
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onTyping,
  onStopTyping,
  placeholder = "Escribe un mensaje...",
  className,
}) => {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)

    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true)
      onTyping?.()
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false)
      onStopTyping?.()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message.trim())
      setMessage("")
      setIsTyping(false)
      onStopTyping?.()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex items-center gap-2 p-4 bg-white border-t border-gray-200", className)}
    >
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00FFB3]"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
          message.trim() ? "bg-[#00FFB3] text-[#0E2A3E]" : "bg-gray-200 text-gray-400",
        )}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  )
}
