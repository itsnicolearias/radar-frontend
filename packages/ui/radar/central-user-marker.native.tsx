import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MotiView } from "moti"

interface CentralUserMarkerProps {
  initial: string
}

export const CentralUserMarkerNative: React.FC<CentralUserMarkerProps> = ({ initial }) => {
  return (
    <View style={styles.container}>
      <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "timing", duration: 500 }}>
        <LinearGradient colors={["#00FFB3", "#1DE3F2"]} style={styles.gradient}>
          <Text style={styles.initial}>{initial}</Text>
        </LinearGradient>
      </MotiView>
      <Text style={styles.label}>Tú</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    zIndex: 20,
  },
  gradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00FFB3",
    shadowColor: "#00FFB3",
    shadowOpacity: 0.8,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  initial: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    marginTop: 8,
    color: "#00FFB3",
    fontSize: 14,
    fontWeight: "600",
  },
})
