"use client"

import type React from "react"
import { cn } from "../lib/utils"

interface MessageBubbleProps {
  content: string
  timestamp: string
  isSent: boolean
  isRead?: boolean
  className?: string
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  timestamp,
  isSent,
  isRead = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col max-w-[75%] mb-4",
        isSent ? "self-end items-end" : "self-start items-start",
        className,
      )}
    >
      <div
        className={cn(
          "px-4 py-2 rounded-2xl",
          isSent 
            ? "bg-[#1DE3F2] text-black rounded-br-sm shadow-lg shadow-[#1DE3F2]/30" 
            : "bg-[#1A1A1A] text-white border border-[#00FFB3]/30 rounded-bl-sm",
        )}
      >
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
      <span className="text-xs text-[#8B8B8B] mt-1 px-1">{timestamp}</span>
    </div>
  )
}
