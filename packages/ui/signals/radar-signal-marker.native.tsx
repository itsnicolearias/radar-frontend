import React from "react"
import { TouchableOpacity, StyleSheet, View } from "react-native"
import { MotiView } from 'moti'

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
    >
      <MotiView
        from={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{
          type: 'timing',
          duration: 2000,
          loop: true,
          easing: () => 1,
        }}
        style={styles.pulse}
      />
    </TouchableOpacity>
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
    backgroundColor: "#FF005C",
    justifyContent: "center",
    alignItems: "center",
  },
  pulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF005C',
  },
})
