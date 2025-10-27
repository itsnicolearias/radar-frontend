import { View, Text, StyleSheet } from "react-native"
import { RadarCircle } from "@radar/ui"

export default function RadarScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Radar</Text>
        <Text style={styles.subtitle}>Personas cerca de ti</Text>
      </View>

      <View style={styles.radarContainer}>
        <RadarCircle nearbyCount={10} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1628",
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F8FAFC",
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    marginTop: 8,
  },
  radarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
