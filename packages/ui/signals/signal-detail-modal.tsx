import React from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import type { IRadarSignal } from "@radar/types"

interface SignalDetailModalProps {
  signal: IRadarSignal
  onClose: () => void
  onRespond: (signal: IRadarSignal) => void
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({ signal, onClose, onRespond }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-[#1A1A1A] rounded-3xl p-6 w-full max-w-sm border border-[#FF005C]/30 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Señal de {signal.Sender.displayName}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-[#0D0D0D] rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-transparent hover:border-[#FF005C]/30"
          >
            <X className="w-5 h-5 text-[#C5C5C5]" />
          </button>
        </div>
        <p className="text-[#C5C5C5] text-base leading-relaxed">{signal.note}</p>
        <div className="mt-6">
          <button
            onClick={() => onRespond(signal)}
            className="w-full h-14 rounded-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-bold hover:shadow-lg transition-all duration-300 shadow-[#00FFB3]/30"
          >
            Responder
          </button>
        </div>
      </div>
    </motion.div>
  )
}
