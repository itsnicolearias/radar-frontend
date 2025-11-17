"use client"

import { cn } from "@radar/ui/lib/utils"
import { Compass, MessageCircle, Calendar, User } from "lucide-react"

type BottomNavProps = {
  activeTab: "radar" | "chats" | "events" | "profile"
  onTabChange: (tab: "radar" | "chats" | "events" | "profile") => void
  showSignalReplyNotification?: boolean
}

export function BottomNav({
  activeTab,
  onTabChange,
  showSignalReplyNotification,
}: BottomNavProps) {
  const navItems = [
    { id: "radar", label: "Radar", icon: Compass },
    { id: "chats", label: "Chats", icon: MessageCircle },
    { id: "events", label: "Events", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ] as const

  return (
    <nav
      className={cn(
        "bg-background/80 border-t border-primary/20 flex justify-around items-center p-4",
        "sticky bottom-0 z-50",
      )}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className="flex flex-col items-center gap-1"
        >
          <item.icon
            className={cn(
              "w-6 h-6",
              activeTab === item.id ? "text-primary" : "text-muted-foreground",
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              activeTab === item.id ? "text-primary" : "text-muted-foreground",
            )}
          >
            {item.label}
          </span>
          {item.id === "chats" && showSignalReplyNotification && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full" />
          )}
        </button>
      ))}
    </nav>
  )
}
