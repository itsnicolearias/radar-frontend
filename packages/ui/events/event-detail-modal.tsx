"use client"

import type React from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import type { IEventResponse } from "@radar/types"

interface EventDetailModalProps {
  event: IEventResponse
  onClose: () => void
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-[#1A1A1A] rounded-3xl p-6 w-full max-w-sm border border-[#00FFB3]/30 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{event.title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-[#0D0D0D] rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-transparent hover:border-[#00FFB3]/30"
          >
            <X className="w-5 h-5 text-[#C5C5C5]" />
          </button>
        </div>
        <p className="text-[#C5C5C5] text-base leading-relaxed">{event.description}</p>
        <div className="mt-6">
          <p className="text-sm text-white">
            <strong>Ubicación:</strong> {event.location}
          </p>
          <p className="text-sm text-white">
            <strong>Fecha:</strong> {new Date(event.startDate).toLocaleDateString("es-AR")}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
