import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { MapPin, MessageCircle, Calendar, User } from "lucide-react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNotificationStore } from "@radar/features"

interface BottomNavProps {
  activeTab: "radar" | "chats" | "events" | "profile"
  onTabChange: (tab: "radar" | "chats" | "events" | "profile") => void
}

export const BottomNavNative: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const insets = useSafeAreaInsets()
  const { unreadCount } = useNotificationStore()

  const tabs = [
    { id: "radar" as const, label: "Radar", icon: MapPin },
    { id: "chats" as const, label: "Chats", icon: MessageCircle },
    { id: "events" as const, label: "Eventos", icon: Calendar },
    { id: "profile" as const, label: "Perfil", icon: User },
  ]

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 8 }]}>
      <View style={styles.content}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <TouchableOpacity key={tab.id} onPress={() => onTabChange(tab.id)} style={styles.tab}>
              {tab.id === "chats" && unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
                </View>
              )}
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
    paddingTop: 12,
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
  badge: {
    position: "absolute",
    top: -4,
    right: 4,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    backgroundColor: "#FF005C",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF005C",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
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
