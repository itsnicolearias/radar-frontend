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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Enviar Señal</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-gray-400" />
          </Button>
        </div>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escribe tu mensaje temporal..."
          className="w-full bg-gray-700 text-white rounded-lg p-2"
          maxLength={100}
        />
        <div className="text-right text-sm text-gray-400 mt-2">
          {note.length}/100
        </div>
        <div className="mt-4">
          <Button onClick={handleSend} className="w-full">
            Enviar Señal (1/día)
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
