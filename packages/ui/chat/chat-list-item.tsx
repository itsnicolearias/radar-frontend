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
      className={cn("flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors", className)}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFB3] to-[#14B8A6] flex items-center justify-center">
          {photoUrl ? (
            <img src={photoUrl || "/placeholder.svg"} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-[#0E2A3E] font-semibold text-sm">{initials}</span>
          )}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00FFB3] border-2 border-white rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          {timestamp && <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{timestamp}</span>}
        </div>
        {lastMessage && <p className="text-sm text-gray-600 truncate">{lastMessage}</p>}
      </div>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <div className="flex-shrink-0 w-6 h-6 bg-[#FF4FD8] rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{unreadCount}</span>
        </div>
      )}
    </div>
  )
}
