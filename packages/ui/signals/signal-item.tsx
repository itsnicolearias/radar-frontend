import React from "react"
import { Platform, View, Text } from "react-native"
import type { ISignal } from "@radar/types"

interface SignalItemProps {
  signal: ISignal
}

export const SignalItem: React.FC<SignalItemProps> = ({ signal }) => {
  const Container: React.ElementType = Platform.OS === "web" ? (require("framer-motion").motion?.div ?? "div") : View

  const containerProps =
    Platform.OS === "web"
      ? {
          className: "bg-gray-800 p-4 rounded-lg shadow-md mb-4",
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
        }
      : { style: { backgroundColor: "#1f2937", padding: 16, borderRadius: 12, marginBottom: 16 } }

  const titleClass = Platform.OS === "web" ? "text-white font-bold" : undefined
  const noteClass = Platform.OS === "web" ? "text-gray-300 mt-2" : undefined
  const titleStyle = Platform.OS !== "web" ? { color: "#ffffff", fontWeight: "bold" as const } : undefined
  const noteStyle = Platform.OS !== "web" ? { color: "#d1d5db", marginTop: 8 } : undefined
  const textPropsTitle = Platform.OS === "web" ? { className: titleClass } : { style: titleStyle }
  const textPropsNote = Platform.OS === "web" ? { className: noteClass } : { style: noteStyle }

  return (
    <Container {...containerProps}>
      <Text {...textPropsTitle}>
        Señal de {signal.Sender?.firstName ?? ""}
      </Text>
      {signal.note ? (
        <Text {...textPropsNote}>
          {signal.note}
        </Text>
      ) : null}
    </Container>
  )
}
