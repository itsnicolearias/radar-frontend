"use client"

import type React from "react"
import { Eye } from "lucide-react"
import { cn } from "../lib/utils"

interface ProfileViewItemProps {
  displayName: string
  photoUrl?: string
  timestamp: string | Date
  onClick?: () => void
  className?: string
}

export const ProfileViewItem: React.FC<ProfileViewItemProps> = ({
  displayName,
  photoUrl,
  timestamp,
  onClick,
  className,
}) => {
  const formatRelativeTime = (date: string | Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Ahora"
    if (diffMins < 60) return `Hace ${diffMins}m`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays === 1) return "Ayer"
    return `Hace ${diffDays} días`
  }

  const initials = displayName![0];

  return (
    <div
      className={cn("flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors", className)}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFB3] to-[#14B8A6] flex items-center justify-center">
          {photoUrl ? (
            <img src={photoUrl || "/placeholder.svg"} alt={displayName} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-[#0E2A3E] font-semibold text-sm">{initials}</span>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FF4FD8] rounded-full flex items-center justify-center border-2 border-white">
          <Eye className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{displayName}</h3>
        <p className="text-sm text-gray-600">{formatRelativeTime(timestamp)}</p>
      </div>
    </div>
  )
}
