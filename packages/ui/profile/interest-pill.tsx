"use client"

import type React from "react"
import { X } from "lucide-react"
import { cn } from "../lib/utils"

interface InterestPillProps {
  label: string
  onRemove?: () => void
  className?: string
}

export const InterestPill: React.FC<InterestPillProps> = ({ label, onRemove, className }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 bg-white text-[#1A3A52] rounded-full text-sm font-medium",
        className,
      )}
    >
      <span>{label}</span>
      {onRemove && (
        <button onClick={onRemove} className="hover:bg-gray-200 rounded-full p-0.5 transition-colors">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
