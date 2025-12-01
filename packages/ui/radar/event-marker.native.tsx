import type React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { MotiView } from "moti"
import type { IEventResponse } from "@radar/types"

interface EventMarkerProps {
  event: IEventResponse
  position: { x: number; y: number }
  onPress: () => void
  index: number
}

export const EventMarkerNative: React.FC<EventMarkerProps> = ({ event, position, onPress, index }) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 300, delay: index * 50 }}
      style={[styles.container, { left: position.x - 24, top: position.y - 24 }]}
    >
      <TouchableOpacity style={styles.eventCircle} onPress={onPress}>
        <Text style={styles.eventInitial}>{event.title[0].toUpperCase()}</Text>
      </TouchableOpacity>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 48,
    height: 48,
    zIndex: 5,
  },
  eventCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#FF005C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF005C",
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  eventInitial: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
})
