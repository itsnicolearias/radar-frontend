import type React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { MotiView } from "moti"
import type { IRadarUser } from "@radar/types"

interface UserMarkerProps {
  user: IRadarUser
  position: { x: number; y: number }
  hasSignal: boolean
  onPress: () => void
  index: number
}

export const UserMarkerNative: React.FC<UserMarkerProps> = ({ user, position, hasSignal, onPress, index }) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 300, delay: index * 50 }}
      style={[styles.container, { left: position.x - 24, top: position.y - 24 }]}
    >
      {hasSignal && (
        <MotiView
          from={{ translateY: 0 }}
          animate={{ translateY: -4 }}
          transition={{
            type: "timing",
            duration: 2000,
            loop: true,
          }}
          style={styles.signalIndicator}
        >
          <Text style={styles.signalEmoji}>🎵</Text>
        </MotiView>
      )}

      <TouchableOpacity style={styles.userCircle} onPress={onPress}>
        <Text style={styles.userInitials}>
          {user.displayName?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase()}
        </Text>
      </TouchableOpacity>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  signalIndicator: {
    position: "absolute",
    top: -20,
    zIndex: 10,
  },
  signalEmoji: {
    fontSize: 16,
  },
  userCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00FFB3",
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  userInitials: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
})
