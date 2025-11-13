"use client"

import type React from "react"
import { MapPin, Calendar, Users, Heart, DollarSign } from "lucide-react"
import { cn } from "../lib/utils"

interface EventCardProps {
  title: string
  description?: string
  location: string
  startDate: string
  attendeesCount?: number
  price?: number
  distance?: number
  category?: string
  isInterested?: boolean
  isBoosted?: boolean
  photoUrl?: string
  onInterestClick?: () => void
  onClick?: () => void
  className?: string
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  location,
  startDate,
  attendeesCount = 0,
  price = 0,
  distance,
  category,
  isInterested = false,
  isBoosted = false,
  photoUrl,
  onInterestClick,
  onClick,
  className,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const timeStr = date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })

    if (date.toDateString() === today.toDateString()) {
      return `Hoy, ${timeStr}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Mañana, ${timeStr}`
    } else {
      return date.toLocaleDateString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    }
  }

  const initial = title.charAt(0).toUpperCase()

  return (
    <div
      className={cn(
        "bg-[#1A3A4F] rounded-2xl border-2 border-[#00FFB3]/20 overflow-hidden hover:border-[#00FFB3]/40 transition-colors",
        isBoosted && "border-[#00FFB3]",
        className,
      )}
      onClick={onClick}
    >
      {/* Badge */}
      {(isBoosted || category) && (
        <div className="px-4 pt-3 flex gap-2">
          {isBoosted && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#00FFB3] text-[#0E2A3E]">
              💎 BOOSTED
            </span>
          )}
          {category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FF4FD8]/20 text-[#FF4FD8] border border-[#FF4FD8]/30">
              {category}
            </span>
          )}
        </div>
      )}

      {/* Image */}
      <div className="p-4">
        <div className="w-full aspect-video bg-gradient-to-br from-[#00FFB3]/30 to-[#14B8A6]/30 rounded-xl flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <img src={photoUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#00FFB3] text-6xl font-bold">{initial}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 space-y-3">
        <h3 className="text-white font-bold text-lg">{title}</h3>

        {description && <p className="text-gray-400 text-sm line-clamp-2">{description}</p>}

        {/* Info row */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#00FFB3]" />
            <span>{location}</span>
            {distance !== undefined && <span className="text-[#00FFB3]">• {distance}m</span>}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-[#00FFB3]" />
            <span>{formatDate(startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-[#00FFB3]" />
            <span>{attendeesCount}</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onInterestClick?.()
          }}
          className={cn(
            "w-full py-3 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2",
            isInterested
              ? "bg-[#00FFB3] text-[#0E2A3E] hover:bg-[#00FFB3]/90"
              : "bg-[#00FFB3]/10 text-[#00FFB3] hover:bg-[#00FFB3]/20 border border-[#00FFB3]/30",
          )}
        >
          <Heart className={cn("w-4 h-4", isInterested && "fill-current")} />
          {isInterested ? "Me interesa ❤️" : "Me interesa"}
        </button>

        {price > 0 && (
          <div className="flex items-center gap-1 text-white">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold">${price}</span>
          </div>
        )}
      </div>
    </div>
  )
}
