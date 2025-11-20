"use client"

import type React from "react"
import { motion } from "framer-motion"
import { X, MapPin, MessageCircle, Heart } from "lucide-react"
import type { IRadarUser } from "@radar/types"

interface UserProfileModalProps {
  user: IRadarUser
  onClose: () => void
  onMessage: () => void
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onMessage }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#0A0E12] rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-b from-[#197387] to-[#0F2B33] p-8 pb-16">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-black font-bold text-4xl mb-4 border-2 border-[#00FFB3]">
              {user.displayName?.[0]?.toUpperCase()}
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4 text-[#1DE3F2]" />
              <span>{Math.round(user.distance)}m de distancia</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name and location */}
          <div>
            <h2 className="text-white font-bold text-2xl">
              {user.displayName || `${user.firstName} ${user.lastName}`}, {user.age || 26}
            </h2>
            <p className="text-[#1DE3F2] flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {user.city || "Buenos Aires"}, {user.neighborhood || "Palermo"}
            </p>
          </div>

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">Intereses</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <span key={interest} className="px-4 py-2 bg-white rounded-full text-black text-sm font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {user.bio && (
            <div>
              <h3 className="text-white font-semibold mb-2">Sobre mí</h3>
              <p className="text-[#C5C5C5] leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onMessage}
              className="flex-1 h-14 rounded-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-semibold hover:shadow-lg transition-all duration-300 shadow-[#00FFB3]/30 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar mensaje
            </button>

            <button className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-[#FF005C]/30 flex items-center justify-center hover:bg-[#FF005C]/10 transition-colors">
              <Heart className="w-6 h-6 text-[#FF005C]" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
