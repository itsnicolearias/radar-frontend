"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { MessageCircle, Users, Check, X, Crown } from "lucide-react-native"
import { MotiView } from "moti"
import { useChatStore, useConnectionStore, useSocketEvent, useProfileViewsStore, useAuthStore } from "@radar/features"
import { messageService, connectionService, profileViewService } from "@radar/api"
import type { IMessageResponse, IConnectionResponse } from "@radar/types"
import { BottomNavNative } from "@radar/ui/navigation/bottom-nav.native"

export default function ChatsScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"chats" | "solicitudes" | "conectados">("chats")

  const { user } = useAuthStore()
  const { chats, setChats, updateChatLastMessage, incrementUnreadCount } = useChatStore()
  const { connections, pendingRequests, setConnections, setPendingRequests } = useConnectionStore()
  const { profileViews, setProfileViews } = useProfileViewsStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatsData, connectionsData, requestsData, viewsData] = await Promise.all([
          messageService.getConversations(),
          connectionService.getAcceptedConnections(),
          connectionService.getPendingConnections(),
          profileViewService.getProfileViews(),
        ])

        setChats(chatsData)
        setConnections(connectionsData)
        setPendingRequests(requestsData)
        setProfileViews(viewsData)
      } catch (error) {
        console.error("[v0] Error fetching chats data:", error)
      }
    }

    fetchData()
  }, [setChats, setConnections, setPendingRequests, setProfileViews])

  useSocketEvent<IMessageResponse>(
    "new-message",
    (message) => {
      updateChatLastMessage(message.senderId, message)
      incrementUnreadCount(message.senderId)
    },
    [updateChatLastMessage, incrementUnreadCount],
  )

  useSocketEvent<IConnectionResponse>(
    "new-connection-request",
    (connection) => {
      setPendingRequests([connection, ...pendingRequests])
    },
    [pendingRequests, setPendingRequests],
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

  const handleAcceptConnection = async (connectionId: string) => {
    try {
      await connectionService.updateConnection(connectionId, "accepted")
      setPendingRequests(pendingRequests.filter((r) => r.connectionId !== connectionId))
    } catch (error) {
      console.error("[v0] Error accepting connection:", error)
    }
  }

  const handleRejectConnection = async (connectionId: string) => {
    try {
      await connectionService.updateConnection(connectionId, "rejected")
      setPendingRequests(pendingRequests.filter((r) => r.connectionId !== connectionId))
    } catch (error) {
      console.error("[v0] Error rejecting connection:", error)
    }
  }

    const formatDistance = (distance?: number) => {
    if (!distance) return "Cerca"
    if (distance < 1000) return `${Math.round(distance)}m`
    return `${(distance / 1000).toFixed(1)}km`
  }

    const formatRelativeTime = (date: string | Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Ahora"
    if (diffMins < 60) return `Hace ${diffMins}m`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays === 1) return "Ayer"
    return `Hace ${diffDays} días`
  }

  return (
    <View style={styles.container}>
      <View style={styles.gradientBg} />

      <View style={styles.header}>
        <Text style={styles.title}>Conexiones</Text>
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "chats" && styles.tabActive]}
            onPress={() => setActiveTab("chats")}
          >
            <MessageCircle size={16} color={activeTab === "chats" ? "#000" : "rgba(255,255,255,0.7)"} />
            <Text style={[styles.tabText, activeTab === "chats" && styles.tabTextActive]}>Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "solicitudes" && styles.tabActive]}
            onPress={() => setActiveTab("solicitudes")}
          >
            <Users size={16} color={activeTab === "solicitudes" ? "#000" : "rgba(255,255,255,0.7)"} />
            <Text style={[styles.tabText, activeTab === "solicitudes" && styles.tabTextActive]}>Solicitudes</Text>
            {pendingRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingRequests.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "conectados" && styles.tabActive]}
            onPress={() => setActiveTab("conectados")}
          >
            <Check size={16} color={activeTab === "conectados" ? "#000" : "rgba(255,255,255,0.7)"} />
            <Text style={[styles.tabText, activeTab === "conectados" && styles.tabTextActive]}>Conectados</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Chats Tab */}
        {activeTab === "chats" && (
          <View style={styles.section}>
            {chats.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No tienes conversaciones aún</Text>
                <Text style={styles.emptySubtext}>Conecta con personas cercanas para empezar a chatear</Text>
              </View>
            ) : (
              chats.map((chat, index) => (
                <MotiView
                  key={chat.conversationId}
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: index * 50 }}
                >
                  <TouchableOpacity style={styles.chatCard} onPress={() => router.push(`/chats/${chat.user.userId}`)}>
                    <View style={styles.chatCardContent}>
                      <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>{chat.user.displayName?.[0] || "U"}</Text>
                        </View>
                        {chat.unreadCount > 0 && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.chatInfo}>
                        <View style={styles.chatHeader}>
                          <Text style={styles.chatName}>{chat.user.displayName}</Text>
                          {chat.lastMessage && (
                            <Text style={styles.chatTime}>{formatTimestamp(String(chat.lastMessage.createdAt))}</Text>
                          )}
                        </View>
                        {chat.lastMessage && (
                          <Text style={styles.chatMessage} numberOfLines={1}>
                            {chat.lastMessage.content}
                          </Text>
                        )}
                        <View style={styles.distanceContainer}>
                          <View style={styles.distanceDot} />
                          <Text style={styles.distanceText}>{formatDistance(chat.user.distance)}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </MotiView>
              ))
            )}
          </View>
        )}

        {/* Solicitudes Tab */}
        {activeTab === "solicitudes" && (
          <View style={styles.section}>
            {pendingRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No tienes solicitudes pendientes</Text>
              </View>
            ) : (
              pendingRequests.map((request, index) => (
                <MotiView
                  key={request.connectionId}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: index * 100 }}
                >
                  <View style={styles.requestCard}>
                    <View style={styles.requestContent}>
                      <View style={styles.requestAvatar}>
                        <Text style={styles.requestAvatarText}>{request.Sender.displayName![0]}</Text>
                      </View>

                      <View style={styles.requestInfo}>
                        <Text style={styles.requestName}>{request.Sender.Profile?.showAge ? `${request.Sender.displayName}, ${request.Sender.Profile.age}` : request.Sender.displayName}</Text>
                        <View style={styles.requestMeta}>
                          <View style={styles.distanceDot} />
                          <Text style={styles.distanceText}>{formatDistance(request.Sender?.distance)}</Text>
                          {/**<Text style={styles.interestText}> • 3 intereses en común</Text> */}
                        </View>

                        <View style={styles.requestActions}>
                          <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => handleAcceptConnection(request.connectionId)}
                          >
                            <Text style={styles.acceptButtonText}>Aceptar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.rejectButton}
                            onPress={() => handleRejectConnection(request.connectionId)}
                          >
                            <X size={16} color="#FF005C" />
                            <Text style={styles.rejectButtonText}>Rechazar</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </MotiView>
              ))
            )}
          </View>
        )}

        {/* Conectados Tab */}
        {activeTab === "conectados" && (
          <View style={styles.section}>
            <View style={styles.profileViewsSection}>
              <View style={styles.profileViewsHeader}>
                <View style={styles.profileViewsIcon}>
                  <Text style={styles.eyeIcon}>👁️</Text>
                </View>
                <Text style={styles.profileViewsTitle}>Vieron tu perfil</Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profileViewsScroll}>
                {profileViews.map((view, index) => (
                  
                  <>                  
                  <MotiView
                    key={view.profileViewId}
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 100 }}
                  >
                    <TouchableOpacity
                      style={styles.profileView}
                      onPress={() => router.push(`/profile/${view.viewerId}`)}
                    >
                      <View style={styles.profileViewAvatarContainer}>
                        <View style={styles.profileViewAvatar}>
                          <Text style={styles.profileViewAvatarText}>{view.Viewer.displayName![0]}</Text>
                        </View>
                        <View style={styles.onlineIndicator} />
                      </View>
                      <Text style={styles.profileViewName}>{view.Viewer.displayName![0]}</Text>
                      <Text style={styles.profileViewTime}>{formatRelativeTime(view.createdAt)}</Text>
                    </TouchableOpacity>
                  </MotiView>
                  </>
                  
                ))}
              </ScrollView>
            </View>

            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}>
              <TouchableOpacity style={styles.premiumBanner}>
                <Crown size={20} color="#000" />
                <Text style={styles.premiumText}>Desbloquea todos los visitantes con Premium</Text>
              </TouchableOpacity>
            </MotiView>

            <View style={styles.connectedList}>
              {connections.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No tienes conexiones aún</Text>
                </View>
              ) : (
                connections.map((connection, index) => {
                  const connectedUser = connection.senderId === user?.userId ? connection.Receiver : connection.Sender
                  return (
                    <MotiView
                      key={connection.connectionId}
                      from={{ opacity: 0, translateX: -20 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{ delay: index * 50 }}
                    >
                      <View style={styles.connectedCard}>
                        <View style={styles.connectedInfo}>
                          <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{connectedUser.displayName?.[0] || "A"}</Text>
                          </View>
                          <View>
                            <Text style={styles.connectedName}>{connectedUser.displayName}</Text>
                            <View style={styles.distanceContainer}>
                              <View style={styles.distanceDot} />
                              <Text style={styles.distanceText}>{formatDistance(connectedUser.distance)}</Text>
                            </View>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={styles.chatButton}
                          onPress={() =>
                            router.push(
                              `/chats/${connection.senderId === user?.userId ? connection.receiverId : connection.senderId}`,
                            )
                          }
                        >
                          <MessageCircle size={16} color="#000" />
                          <Text style={styles.chatButtonText}>Chat</Text>
                        </TouchableOpacity>
                      </View>
                    </MotiView>
                  )
                })
              )}
            </View>
          </View>
        )}
      </ScrollView>

     <BottomNavNative
             activeTab="chats"
             onTabChange={(tab) => {
               if (tab === "events") router.push("/events")
               else if (tab === "radar") router.push("/radar")
               else if (tab === "profile") router.push("/profile")
             }}
           />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  gradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  header: {
    backgroundColor: "rgba(26, 26, 26, 0.5)",
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
  tabsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 9999,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 9999,
    gap: 6,
    position: "relative",
  },
  tabActive: {
    backgroundColor: "#00FFB3",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
  },
  tabTextActive: {
    color: "#000000",
    fontWeight: "600",
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
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  section: {
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyText: {
    color: "#C5C5C5",
    fontSize: 16,
  },
  emptySubtext: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  chatCard: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  chatCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 179, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "600",
  },
  unreadBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF005C",
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  chatInfo: {
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
    color: "#C5C5C5",
  },
  chatMessage: {
    fontSize: 14,
    color: "#C5C5C5",
    marginBottom: 4,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  distanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1DE3F2",
  },
  distanceText: {
    fontSize: 12,
    color: "#1DE3F2",
  },
  requestCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: "rgba(0, 255, 179, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
  },
  requestContent: {
    flexDirection: "row",
    gap: 16,
  },
  requestAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
  },
  requestAvatarText: {
    color: "#1A1A1A",
    fontSize: 20,
    fontWeight: "bold",
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  requestMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  interestText: {
    fontSize: 12,
    color: "#1DBF73",
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#00FFB3",
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#000000",
    fontWeight: "600",
  },
  rejectButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 92, 0.3)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  rejectButtonText: {
    color: "#FF005C",
    fontWeight: "600",
  },
  profileViewsSection: {
    marginBottom: 24,
  },
  profileViewsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  profileViewsIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIcon: {
    fontSize: 20,
  },
  profileViewsTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  profileViewsScroll: {
    marginTop: 8,
  },
  profileView: {
    alignItems: "center",
    marginRight: 16,
  },
  profileViewAvatarContainer: {
    position: "relative",
  },
  profileViewAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#1DE3F2",
    justifyContent: "center",
    alignItems: "center",
  },
  profileViewAvatarText: {
    color: "#1A1A1A",
    fontSize: 20,
    fontWeight: "600",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#1DE3F2",
    borderWidth: 2,
    borderColor: "#000000",
  },
  profileViewName: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
  },
  profileViewTime: {
    color: "#1DE3F2",
    fontSize: 11,
    marginTop: 2,
  },
  premiumBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#00FFB3",
    marginBottom: 24,
  },
  premiumText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  connectedList: {
    gap: 12,
  },
  connectedCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  connectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  connectedName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#00FFB3",
  },
  chatButtonText: {
    color: "#000000",
    fontWeight: "600",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(26, 26, 26, 0.9)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 255, 179, 0.2)",
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navIcon: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#C5C5C5",
  },
  navLabelActive: {
    color: "#00FFB3",
  },
})
