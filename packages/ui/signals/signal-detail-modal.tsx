"use client"

import { motion } from "framer-motion"
import { MessageCircle, User, Heart } from "lucide-react"
import type { IRadarSignal } from "@radar/types"
import React from "react"
import { formatDistance } from "lib/utils/format-distance"

interface SignalDetailModalProps {
  signal: IRadarSignal
  onClose: () => void
  onRespond: (signal: IRadarSignal) => void
  onViewProfile: () => void
  isUserConnected?: boolean
  sendConnection?: () => void
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({
  signal,
  onClose,
  onRespond,
  onViewProfile,
  isUserConnected,
  sendConnection,
}) => {
  const [isAnimating, setIsAnimating] = React.useState(false)
  const connected = isUserConnected ? isUserConnected : false

  const handleSendConnection = () => {
    if (sendConnection) {
      setIsAnimating(true)
      sendConnection()
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

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

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#0F2B33] rounded-3xl p-6 w-full max-w-sm border border-[#00FFB3]/30 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* User info */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-black font-bold text-2xl border-2 border-[#FF005C] overflow-hidden">
              {signal.Sender.Profile?.photoUrl ? (
                <img
                  src={signal.Sender.Profile.photoUrl || "/placeholder.svg"}
                  alt={signal.Sender.displayName || "U"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{signal.Sender.displayName?.[0]?.toUpperCase()}</span>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#1DE3F2] border-2 border-[#0F2B33] rounded-full shadow-lg shadow-[#1DE3F2]/50" />
          </div>
          <h3 className="text-white font-bold text-lg">{signal.Sender.displayName}</h3>
          <p className="text-[#1DE3F2] text-sm flex items-center gap-1">
            <span>{formatDistance(signal.distance)}</span>
          </p>
        </div>

        {/* Signal message */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 mb-2 border border-[#FF005C]/30">
          <p className="text-white font-semibold text-center flex items-center justify-center gap-2">{signal.note}</p>
          <p className="text-[#C5C5C5] text-xs text-center mb-6">{formatRelativeTime(signal.createdAt)}</p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {connected ? (
            <button
              onClick={() => onRespond(signal)}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-semibold hover:shadow-lg transition-all duration-300 shadow-[#00FFB3]/30 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Responder señal
            </button>
          ) : (
            <motion.button
              onClick={handleSendConnection}
              className="w-full h-12 rounded-full border border-[#FF005C]/30 text-[#FF005C] font-semibold hover:bg-[#FF005C]/10 transition-all flex items-center justify-center gap-2 bg-[#1A1A1A]"
              animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className="w-5 h-5" />
              Enviar solicitud
            </motion.button>
          )}

          <button
            onClick={onViewProfile}
            className="w-full h-12 rounded-full bg-[#1A1A1A] border border-[#00FFB3]/30 text-white font-medium hover:bg-[#1A1A1A]/80 transition-all flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" />
            Ver perfil
          </button>
        </div>

        <button onClick={onClose} className="w-full mt-4 text-[#C5C5C5] text-sm hover:text-white transition-colors">
          Cerrar
        </button>
      </motion.div>
    </motion.div>
  )
}
