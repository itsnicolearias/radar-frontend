import React from "react"
import { motion } from "framer-motion"

interface SignalPopoverProps {
  note?: string
  onClose: () => void
}

export const SignalPopover: React.FC<SignalPopoverProps> = ({ onClose }) => {
  return (
    <motion.div
      className="absolute bottom-full mb-2 w-max max-w-xs bg-[#1A1A1A] text-white text-sm rounded-lg p-2 shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      📝
      <button onClick={onClose} className="absolute top-0 right-0 p-1 text-white/50 hover:text-white">
        &times;
      </button>
    </motion.div>
  )
}
