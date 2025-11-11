"use client"

import type React from "react"
import { cn } from "../lib/utils"

interface EventCategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  className?: string
}

export const EventCategoryFilter: React.FC<EventCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
}) => {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2 scrollbar-hide", className)}>
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0",
          selectedCategory === null
            ? "bg-[#00FFB3] text-[#0E2A3E]"
            : "bg-[#1A3A4F] text-gray-400 hover:text-white border border-[#00FFB3]/20",
        )}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0",
            selectedCategory === category
              ? "bg-[#00FFB3] text-[#0E2A3E]"
              : "bg-[#1A3A4F] text-gray-400 hover:text-white border border-[#00FFB3]/20",
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
