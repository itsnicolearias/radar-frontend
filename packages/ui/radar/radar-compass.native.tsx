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
    top: -140,
    right: -5,
    width: 96,
    height: 96,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  outerRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "rgba(0, 255, 179, 0.4)",
  },
  direction: {
    position: "absolute",
    fontWeight: "bold",
    fontSize: 14,
    color: "#00FFB3",
    fontFamily: "System",
  },
  north: {
    top: 8,
  },
  east: {
    right: 8,
  },
  south: {
    bottom: 8,
  },
  west: {
    left: 8,
  },
  centerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0, 255, 179, 0.8)",
  },
})
