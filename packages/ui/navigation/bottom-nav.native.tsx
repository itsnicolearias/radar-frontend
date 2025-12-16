import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { MapPin, MessageCircle, Calendar, User } from "lucide-react-native"

interface BottomNavProps {
  activeTab: "radar" | "chats" | "events" | "profile"
  onTabChange: (tab: "radar" | "chats" | "events" | "profile") => void
  showNotification?: boolean
}

export const BottomNavNative: React.FC<BottomNavProps> = ({ activeTab, onTabChange, showNotification }) => {
  const tabs = [
    { id: "radar" as const, label: "Radar", icon: MapPin },
    { id: "chats" as const, label: "Chats", icon: MessageCircle },
    { id: "events" as const, label: "Eventos", icon: Calendar },
    { id: "profile" as const, label: "Perfil", icon: User },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <TouchableOpacity key={tab.id} onPress={() => onTabChange(tab.id)} style={styles.tab}>
              {tab.id === "chats" && showNotification && <View style={styles.notification} />}
              <Icon color={isActive ? "#00FFB3" : "#C5C5C5"} size={24} />
              <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(26, 26, 26, 0.9)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 255, 179, 0.2)",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    position: "relative",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: 8,
  },
  notification: {
    position: "absolute",
    top: 0,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: "#FF005C",
    borderRadius: 4,
    shadowColor: "#FF005C",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#C5C5C5",
  },
  labelActive: {
    color: "#00FFB3",
  },
})
