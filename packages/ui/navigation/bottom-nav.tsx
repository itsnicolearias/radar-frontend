"use client"

import type React from "react"
import { MapPin, MessageCircle, Calendar, User } from 'lucide-react'
import { cn } from "../lib/utils"

interface BottomNavProps {
  activeTab: "radar" | "chats" | "events" | "profile"
  onTabChange: (tab: "radar" | "chats" | "events" | "profile") => void
  className?: string
  showSignalReplyNotification?: boolean
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  className,
  showSignalReplyNotification,
}) => {
  const tabs = [
    { id: "radar" as const, label: "Mapa", icon: MapPin },
    { id: "chats" as const, label: "Chats", icon: MessageCircle },
    { id: "events" as const, label: "Eventos", icon: Calendar },
    { id: "profile" as const, label: "Perfil", icon: User },
  ]

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 bg-black rounded-t-3xl shadow-lg shadow-[#00FFB3]/20 px-6 py-4 border-t border-[#00FFB3]/10", className)}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1 transition-colors"
            >
              {tab.id === "chats" && showSignalReplyNotification && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF005C] rounded-full" />
              )}
              <Icon className={cn("w-6 h-6 transition-colors", isActive ? "text-[#00FFB3]" : "text-[#8B8B8B]")} />
              <span
                className={cn("text-xs font-medium transition-colors", isActive ? "text-[#00FFB3]" : "text-[#8B8B8B]")}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
