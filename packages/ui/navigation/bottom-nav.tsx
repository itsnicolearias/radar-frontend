"use client"

import type React from "react"
import { MapPin, MessageCircle, Calendar, User } from "lucide-react"
import { cn } from "../lib/utils"

interface BottomNavProps {
  activeTab: "radar" | "chats" | "events" | "profile"
  onTabChange: (tab: "radar" | "chats" | "events" | "profile") => void
  className?: string
  showNotification?: boolean
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, className, showNotification }) => {
  const tabs = [
    { id: "radar" as const, label: "Radar", icon: MapPin },
    { id: "chats" as const, label: "Chats", icon: MessageCircle },
    { id: "events" as const, label: "Eventos", icon: Calendar },
    { id: "profile" as const, label: "Perfil", icon: User },
  ]

  return (
    <nav
      className={cn(
        "relative z-20 bg-[#1A1A1A]/90 backdrop-blur-lg rounded-t-3xl px-6 py-4 shadow-lg border-t border-[#00FFB3]/20",
        className,
      )}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1.5 p-2 transition-colors"
            >
              {tab.id === "chats" && showNotification && (
                <div className="absolute top-0 right-2 w-2 h-2 bg-[#FF005C] rounded-full shadow-lg shadow-[#FF005C]/50" />
              )}
              <Icon className={cn("w-6 h-6 transition-colors", isActive ? "text-[#00FFB3]" : "text-[#C5C5C5]")} />
              <span
                className={cn("text-xs font-medium transition-colors", isActive ? "text-[#00FFB3]" : "text-[#C5C5C5]")}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
