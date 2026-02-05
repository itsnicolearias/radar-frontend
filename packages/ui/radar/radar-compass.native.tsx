import type React from "react"
import { View, Text, StyleSheet } from "react-native"

export const RadarCompassNative: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Outer ring */}
      <View style={styles.outerRing} />

      {/* Cardinal directions */}
      <Text style={[styles.direction, styles.north]}>N</Text>
      <Text style={[styles.direction, styles.east]}>E</Text>
      <Text style={[styles.direction, styles.south]}>S</Text>
      <Text style={[styles.direction, styles.west]}>O</Text>

      {/* Center dot */}
      <View style={styles.centerDot} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  outerRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.4)",
  },
  direction: {
    position: "absolute",
    fontWeight: "bold",
    fontSize: 10,
    color: "#00FFB3",
    fontFamily: "System",
  },
  north: {
    top: 4,
  },
  east: {
    right: 4,
  },
  south: {
    bottom: 4,
  },
  west: {
    left: 4,
  },
  centerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0, 255, 179, 0.6)",
  },
})
