"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MessageCircle, Users, Check, X, Crown } from "lucide-react"
import { motion } from "framer-motion"
import { useChatStore, useConnectionStore, useSocketEvent, useProfileViewsStore, useAuthStore } from "@radar/features"
import { messageService, connectionService, profileViewService } from "@radar/api"
import type { IConnectionResponse, IMessageResponse } from "@radar/types"

export default function ChatsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"chats" | "solicitudes" | "conectados">("chats")
  const [showProfileViews, setShowProfileViews] = useState(false)

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

  const handleChatClick = (userId: string) => {
    router.push(`/chats/${userId}`)
  }

  const handleTabChange = (tab: "radar" | "chats" | "events" | "profile") => {
    router.push(`/${tab === "radar" ? "radar" : tab}`)
  }

  const formatTimestamp = (date: string) => {
    const messageDate = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - messageDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) return `${diffMins}m`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`
    return messageDate.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return "Cerca"
    if (distance < 1000) return `${Math.round(distance)}m`
    return `${(distance / 1000).toFixed(1)}km`
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

  return (
    <div className="h-screen bg-black flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.12) 0%, transparent 70%)",
        }}
      />

      <header className="relative z-10 bg-[#1A1A1A]/50 backdrop-blur-lg p-6 pb-4 border-b border-[#00FFB3]/20">
        <h1 className="text-2xl font-bold text-white">Conexiones</h1>
      </header>

      <div className="relative z-10 flex bg-[#1A1A1A] backdrop-blur-sm rounded-full p-1 mx-6 mt-4 mb-4 border border-[#00FFB3]/20">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 relative ${
            activeTab === "chats"
              ? "bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black shadow-lg"
              : "text-white/70"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Chats</span>
        </button>

        <button
          onClick={() => setActiveTab("solicitudes")}
          className={`flex-1 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 relative ${
            activeTab === "solicitudes"
              ? "bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black shadow-lg"
              : "text-white/70"
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">Solicitudes</span>
          {pendingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF005C] rounded-full text-white text-xs flex items-center justify-center font-bold">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("conectados")}
          className={`flex-1 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === "conectados"
              ? "bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black shadow-lg"
              : "text-white/70"
          }`}
        >
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Conectados</span>
        </button>
      </div>

      <div className="relative flex-1 overflow-y-auto px-6 pb-24">
        {/* Chats Tab */}
        {activeTab === "chats" && (
          <div className="space-y-3">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <p className="text-[#C5C5C5]">No tienes conversaciones aún</p>
                <p className="text-sm text-white/50 mt-2">Conecta con personas cercanas para empezar a chatear</p>
              </div>
            ) : (
              chats.map((chat, index) => (
                <motion.div
                  key={chat.conversationId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleChatClick(chat.user.userId)}
                  className="bg-[#1A1A1A] border border-[#00FFB3]/20 rounded-2xl p-4 cursor-pointer hover:border-[#00FFB3]/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-[#00FFB3]/50">
                        <span className="text-[#1A1A1A] font-semibold text-base">
                          {chat.user.displayName?.[0] || "U"}
                        </span>
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF005C] rounded-full text-white text-xs flex items-center justify-center font-bold">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white">{chat.user.displayName}</h3>
                        {chat.lastMessage && (
                          <span className="text-xs text-[#C5C5C5]">
                            {formatTimestamp(String(chat.lastMessage.createdAt))}
                          </span>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <p className="text-sm text-[#C5C5C5] truncate">{chat.lastMessage.content}</p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-[#1DE3F2] rounded-full" />
                        <span className="text-xs text-[#1DE3F2]">120m</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Solicitudes Tab */}
        {activeTab === "solicitudes" && (
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <p className="text-[#C5C5C5]">No tienes solicitudes pendientes</p>
              </div>
            ) : (
              pendingRequests.map((request, index) => (
                <motion.div
                  key={request.connectionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl p-5 bg-gradient-to-br from-[#00FFB3]/10 to-[#1DE3F2]/5 border border-[#00FFB3]/30"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-2 border-[#00FFB3]">
                      <span className="text-[#1A1A1A] font-bold text-lg">S</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white text-base">Sofia, 24</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-[#1DE3F2] rounded-full" />
                            <span className="text-xs text-[#1DE3F2]">35m</span>
                            <span className="text-xs text-[#1DBF73]"> • 3 intereses en común</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleAcceptConnection(request.connectionId)}
                          className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-medium shadow-lg shadow-[#00FFB3]/30 hover:scale-105 transition-transform"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleRejectConnection(request.connectionId)}
                          className="flex-1 h-10 rounded-xl bg-[#1A1A1A] border border-[#FF005C]/30 hover:bg-[#FF005C]/10 text-[#FF005C] transition-all"
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Conectados Tab */}
        {activeTab === "conectados" && (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-[#00FFB3]/30">
                  <span className="text-2xl">👁️</span>
                </div>
                <h2 className="text-white font-semibold">Vieron tu perfil</h2>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {profileViews.slice(0, 5).map((view, index) => (
                  <motion.div
                    key={view.profileViewId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 text-center cursor-pointer"
                    onClick={() => router.push(`/profile/${view.viewerId}`)}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-[#1DE3F2] shadow-lg shadow-[#1DE3F2]/30">
                        <span className="text-[#1A1A1A] font-semibold text-lg">{view.Viewer.displayName[0]}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#1DE3F2] border-2 border-black rounded-full" />
                    </div>
                    <p className="text-white text-xs font-medium mt-2">{view.Viewer.displayName.split(" ")[0]}</p>
                    <p className="text-[#1DE3F2] text-xs">Hace 15 min</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-black" />
                <p className="text-black font-semibold flex-1">Desbloquea todos los visitantes con Premium</p>
              </div>
            </motion.div>

            <div className="space-y-3">
              {connections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <p className="text-[#C5C5C5]">No tienes conexiones aún</p>
                </div>
              ) : (
                connections.map((connection, index) => {
                  const connectedUser = connection.senderId === user?.userId ? connection.Receiver : connection.Sender
                  return (
                    <motion.div
                      key={connection.connectionId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#1A1A1A] border border-[#00FFB3]/20 rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-[#00FFB3]/50">
                          <span className="text-[#1A1A1A] font-semibold">{connectedUser.displayName?.[0] || "A"}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{connectedUser.displayName}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-[#1DE3F2] rounded-full" />
                            <span className="text-xs text-[#1DE3F2]">120m</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleChatClick(
                            connection.senderId === user?.userId ? connection.receiverId : connection.senderId,
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-medium shadow-lg shadow-[#00FFB3]/30 hover:scale-105 transition-transform flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat</span>
                      </button>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A]/90 backdrop-blur-lg rounded-t-3xl px-6 py-4 shadow-lg border-t border-[#00FFB3]/20 z-20">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[
            { id: "radar", label: "Radar", icon: "📡" },
            { id: "chats", label: "Chats", icon: "💬" },
            { id: "events", label: "Eventos", icon: "📅" },
            { id: "profile", label: "Perfil", icon: "👤" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className="flex flex-col items-center gap-1 p-2 transition-colors"
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className={`text-xs font-medium ${tab.id === "chats" ? "text-[#00FFB3]" : "text-[#C5C5C5]"}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
