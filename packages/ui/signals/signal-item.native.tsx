import React from "react"
import { View, Text, StyleSheet } from "react-native"
import type { ISignal } from "@radar/types"

interface SignalItemProps {
  signal: ISignal
}

export const SignalItem: React.FC<SignalItemProps> = ({ signal }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Señal de {signal.Sender?.firstName ?? ""}
      </Text>
      {signal.note ? (
        <Text style={styles.note}>
          {signal.note}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  note: {
    color: "#d1d5db",
    marginTop: 8,
  },
})
