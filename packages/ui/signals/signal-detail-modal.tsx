import React from "react"
import { motion } from "framer-motion"
import { Button } from "../components/button"
import { X } from "lucide-react"
import type { ISignal } from "@radar/types"

interface SignalDetailModalProps {
  signal: ISignal
  onClose: () => void
  onRespond: (signalId: string) => void
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({ signal, onClose, onRespond }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Señal de {signal.senderId}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-gray-400" />
          </Button>
        </div>
        <p className="text-white">{signal.note}</p>
        <div className="mt-4">
          <Button onClick={() => onRespond(signal.signalId)} className="w-full">
            Responder
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
