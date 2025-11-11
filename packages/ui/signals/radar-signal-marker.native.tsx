import React from "react"
import { TouchableOpacity, StyleSheet } from "react-native"

interface RadarSignalMarkerProps {
  distance: number
  angle: number
  onClick?: () => void
}

export const RadarSignalMarker: React.FC<RadarSignalMarkerProps> = ({ distance, angle, onClick }) => {
  const markerStyle = {
    transform: [
      { rotate: `${angle}rad` },
      { translateX: distance },
    ],
  }

  return (
    <TouchableOpacity
      style={[styles.marker, markerStyle]}
      onPress={onClick}
    />
  )
}

const styles = StyleSheet.create({
  marker: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#00E0FF",
    shadowColor: "#00E0FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
})
