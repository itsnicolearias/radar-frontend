"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { useChatStore, useConnectionStore, useSocketEvent } from "@radar/features"
import { messageService, connectionService } from "@radar/api"
import type { IMessageResponse } from "@radar/types"

export default function ChatsScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"messages" | "requests" | "connected">("messages")

  const { chats, setChats, updateChatLastMessage, incrementUnreadCount } = useChatStore()
  const { connections, pendingRequests, setConnections, setPendingRequests } = useConnectionStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatsData, connectionsData, requestsData] = await Promise.all([
          messageService.getConversations(),
          connectionService.getAcceptedConnections(),
          connectionService.getPendingConnections(),
        ])

        setChats(chatsData)
        setConnections(connectionsData)
        setPendingRequests(requestsData)
      } catch (error) {
        console.error("[v0] Error fetching chats data:", error)
      }
    }

    fetchData()
  }, [setChats, setConnections, setPendingRequests])

  useSocketEvent<IMessageResponse>(
    "new-message",
    (message) => {
      updateChatLastMessage(message.senderId, message)
      incrementUnreadCount(message.senderId)
    },
    [updateChatLastMessage, incrementUnreadCount],
  )

  const formatTimestamp = (date: string) => {
    const messageDate = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - messageDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) return `${diffMins}m`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`
    return messageDate.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "messages" && styles.tabActive]}
          onPress={() => setActiveTab("messages")}
        >
          <Text style={[styles.tabText, activeTab === "messages" && styles.tabTextActive]}>Mensajes</Text>
          {chats.reduce((sum, chat) => sum + chat.unreadCount, 0) > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{chats.reduce((sum, chat) => sum + chat.unreadCount, 0)}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "requests" && styles.tabActive]}
          onPress={() => setActiveTab("requests")}
        >
          <Text style={[styles.tabText, activeTab === "requests" && styles.tabTextActive]}>Solicitudes</Text>
          {pendingRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "connected" && styles.tabActive]}
          onPress={() => setActiveTab("connected")}
        >
          <Text style={[styles.tabText, activeTab === "connected" && styles.tabTextActive]}>Conectados</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === "messages" && (
          <>
            {chats.map((chat) => (
              <TouchableOpacity
                key={chat.user.userId}
                style={styles.chatItem}
                onPress={() => router.push(`/chats/${chat.user.userId}`)}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {chat.user.displayName![0]}
                  </Text>
                </View>
                <View style={styles.chatContent}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>
                      {chat.user.displayName} 
                    </Text>
                    {chat.lastMessage && (
                      <Text style={styles.chatTime}>{formatTimestamp(String(chat.lastMessage.createdAt))}</Text>
                    )}
                  </View>
                  {chat.lastMessage && (
                    <Text style={styles.chatMessage} numberOfLines={1}>
                      {chat.lastMessage.content}
                    </Text>
                  )}
                </View>
                {chat.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/radar")}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Radar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.navIconActive]} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/events")}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/profile")}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    backgroundColor: "#000000",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 179, 0.2)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 179, 0.1)",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
  },
  tabActive: {
    backgroundColor: "#00FFB3",
    borderColor: "#00FFB3",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8B8B8B",
  },
  tabTextActive: {
    color: "#000000",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF005C",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: "#000000",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 179, 0.1)",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  chatTime: {
    fontSize: 12,
    color: "#8B8B8B",
  },
  chatMessage: {
    fontSize: 14,
    color: "#8B8B8B",
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF005C",
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 255, 179, 0.2)",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
  },
  navIconActive: {
    backgroundColor: "#00FFB3",
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8B8B8B",
  },
  navLabelActive: {
    color: "#00FFB3",
  },
})
