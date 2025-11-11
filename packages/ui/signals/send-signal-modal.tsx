import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/button"
import { Textarea } from "../components/textarea"
import { X } from "lucide-react"

interface SendSignalModalProps {
  onClose: () => void
  onSend: (note: string | null) => void
}

export const SendSignalModal: React.FC<SendSignalModalProps> = ({ onClose, onSend }) => {
  const [note, setNote] = useState("")

  const handleSend = () => {
    onSend(note.trim() || null)
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-[#1A1A1A] rounded-3xl p-6 w-full max-w-sm border border-[#00FFB3]/30 shadow-2xl">
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
        <div className="text-right text-sm text-[#C5C5C5] mt-2">
          {note.length}/100
        </div>
        <div className="mt-6">
          <button
            onClick={handleSend}
            className="w-full h-14 rounded-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-bold hover:shadow-lg transition-all duration-300 shadow-[#00FFB3]/30"
          >
            Enviar Señal (1/día)
          </button>
        </div>
      </div>
    </motion.div>
  )
}
