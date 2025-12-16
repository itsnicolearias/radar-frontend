"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Animated, Easing, StyleSheet, Text, View } from "react-native"

export type InvisibleBadgeProps = {
  text?: string
}

const InvisibleBadge: React.FC<InvisibleBadgeProps> = ({ text = "Modo invisible activado" }) => {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(-20)).current
  const scale = useRef(new Animated.Value(0.9)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]).start()
  }, [opacity, translateY, scale])

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 140,
    left: 0,
    right: 0,
    zIndex: 50,
    alignItems: "center",
  },
  container: {
    alignItems: "center",
  },
  text: {
    backgroundColor: "#FF005C",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: "hidden",
    textAlign: "center",
  },
})

export default InvisibleBadge
