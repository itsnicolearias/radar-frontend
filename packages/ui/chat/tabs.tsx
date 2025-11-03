"use client"

import type React from "react"
import { cn } from "../lib/utils"

interface Tab {
  id: string
  label: string
  badge?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, className }) => {
  return (
    <div className={cn("flex items-center gap-2 px-4 py-3 bg-[#2C5F8D]", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeTab === tab.id ? "bg-white text-[#2C5F8D]" : "bg-transparent text-white/70 hover:text-white",
          )}
        >
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4FD8] text-white text-xs rounded-full flex items-center justify-center">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
