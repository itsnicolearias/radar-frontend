import React, { useEffect, useRef } from "react"
import { Pressable, StyleSheet, View, Animated, Easing } from "react-native"
import { Ghost } from "lucide-react-native"

export type GhostButtonProps = {
  onPress?: () => void
  isActive?: boolean
}

// React Native version of GhostButton with similar styling/animations
const GhostButton: React.FC<GhostButtonProps> = ({ onPress, isActive = false }) => {
  const pressScale = useRef(new Animated.Value(1)).current
  const pulse = useRef(new Animated.Value(1)).current
  const pulseOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (isActive) {
      const loop = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulse, { toValue: 1.2, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(pulse, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(pulseOpacity, { toValue: 0.8, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(pulseOpacity, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          ]),
        ])
      )
      loop.start()
      return () => loop.stop()
    } else {
      pulse.setValue(1)
      pulseOpacity.setValue(1)
    }
  }, [isActive, pulse, pulseOpacity])

  const handlePressIn = () => {
    Animated.spring(pressScale, { toValue: 0.95, useNativeDriver: true, friction: 6, tension: 250 }).start()
  }
  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 250 }).start()
  }

  const bgColor = isActive ? "rgba(255, 0, 92, 0.2)" : "#1A1A1A"
  const borderColor = isActive ? "rgba(255, 0, 92, 0.5)" : "rgba(29, 227, 242, 0.3)"
  const iconColor = isActive ? "#FF005C" : "#00FFB3"
  const shadowColor = isActive ? "#FF005C" : "#00FFB3"

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: borderColor }}
        style={[styles.button, { backgroundColor: bgColor, borderColor, shadowColor }]}
      >
        <Animated.View style={{ transform: [{ scale: isActive ? pulse : 1 }], opacity: pulseOpacity }}>
          <Ghost color={iconColor} size={24} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
})

export default GhostButton
