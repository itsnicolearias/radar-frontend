import React from "react"
import { View, Text } from "react-native"
import { motion } from "framer-motion"
import type { ISignal } from "@radar/types"

interface SignalItemProps {
  signal: ISignal
}

export const SignalItem: React.FC<SignalItemProps> = ({ signal }) => {
  return (
    <motion.div
      className="bg-gray-800 p-4 rounded-lg shadow-md mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Text className="text-white font-bold">Señal de {signal.senderId}</Text>
      {signal.note && <Text className="text-gray-300 mt-2">{signal.note}</Text>}
    </motion.div>
  )
}
