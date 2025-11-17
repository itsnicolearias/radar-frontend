"use client"

import type React from "react"
import { cn } from "../lib/utils"

interface ChatListItemProps {
  name: string
  lastMessage?: string
  timestamp?: string
  unreadCount?: number
  photoUrl?: string
  isOnline?: boolean
  onClick?: () => void
  className?: string
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  name,
  lastMessage,
  timestamp,
  unreadCount = 0,
  photoUrl,
  isOnline = false,
  onClick,
  className,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={cn("flex items-center gap-3 p-4 hover:bg-[#1A1A1A]/50 cursor-pointer transition-colors border-b border-[#1A1A1A]/50", className)}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] flex items-center justify-center shadow-lg shadow-[#00FFB3]/30">
          {photoUrl ? (
            <img src={photoUrl || "/placeholder.svg"} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-black font-semibold text-sm">{initials}</span>
          )}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00FFB3] border-2 border-black rounded-full shadow-lg shadow-[#00FFB3]/50" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-white truncate">{name}</h3>
          {timestamp && <span className="text-xs text-[#8B8B8B] flex-shrink-0 ml-2">{timestamp}</span>}
        </div>
        {lastMessage && <p className="text-sm text-[#C5C5C5] truncate">{lastMessage}</p>}
      </div>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <div className="flex-shrink-0 w-6 h-6 bg-[#FF005C] rounded-full flex items-center justify-center shadow-lg shadow-[#FF005C]/30">
          <span className="text-white text-xs font-bold">{unreadCount}</span>
        </div>
      )}
    </div>
  )
}
