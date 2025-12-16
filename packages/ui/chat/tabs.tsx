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
    <div className={cn("flex items-center gap-2 px-4 py-3 bg-black border-b border-[#00FFB3]/10", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeTab === tab.id 
              ? "bg-[#00FFB3] text-black shadow-lg shadow-[#00FFB3]/30" 
              : "bg-transparent text-[#C5C5C5] hover:text-white border border-[#1DE3F2]/20",
          )}
        >
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF005C] text-white text-xs rounded-full flex items-center justify-center font-bold">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
