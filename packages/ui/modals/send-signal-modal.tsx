"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Textarea } from "../components/textarea"
import { X } from "lucide-react"
import { useUIStore } from "@radar/features"
import React from "react"

interface SendSignalModalProps {
  onClose: () => void
  onSend: (note?: string) => void
}

export const SendSignalModal: React.FC<SendSignalModalProps> = ({ onClose, onSend }) => {
  const [note, setNote] = useState("")
  const { openModal, closeModal } = useUIStore()

  const quickReplies = ["¿Alguien más por acá? 👋", "Disponible para charlar 💬", "En el parque 🌳"]

  const handleSend = () => {
    onSend(note.trim())
    onClose()
  }

  // sync global UI modal state on mount/unmount like profile modal
  React.useEffect(() => {
    openModal()
    return () => closeModal()
  }, [openModal, closeModal])

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-9999 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ transform: 'none', willChange: 'auto', position: 'fixed', pointerEvents: 'auto' }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0F2B33] rounded-3xl p-6 w-full max-w-sm border border-[#00FFB3]/30 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Enviar Señal</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-[#0D0D0D] rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-transparent hover:border-[#00FFB3]/30"
          >
            <X className="w-5 h-5 text-[#C5C5C5]" />
          </button>
        </div>

        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escribe tu mensaje temporal..."
          className="w-full h-24 px-4 py-3 bg-black/50 border border-[#00FFB3]/30 rounded-xl text-white placeholder-white/40 resize-none focus:outline-none focus:border-[#00FFB3]"
          maxLength={100}
        />
        <div className="text-right text-sm text-white/60 mt-2">{note.length}/100</div>

        {/* Quick reply options */}
        <div className="mt-4 flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => setNote(reply)}
              className="px-3 py-1.5 bg-[#1A1A1A] border border-[#00FFB3]/30 rounded-full text-[#C5C5C5] text-sm hover:bg-[#00FFB3]/10 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={handleSend}
            disabled={!note.trim()}
            className="w-full h-14 rounded-full bg-linear-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-semibold hover:shadow-lg transition-all duration-300 shadow-[#00FFB3]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Radio className="w-5 h-5" />
            Enviar señal (1/día)
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Radio({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 11a7 7 0 0 1 14 0" />
      <path d="M8.5 11a4.5 4.5 0 0 1 9 0" />
      <circle cx="12" cy="11" r="1" fill="currentColor" />
    </svg>
  )
}
