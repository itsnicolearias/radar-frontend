"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChatListItem, Tabs, BottomNav, ProfileViewItem, GradientBackground } from "@radar/ui"
import { useChatStore, useConnectionStore, useSocketEvent, useProfileViewsStore, useAuthStore } from "@radar/features"
import { messageService, connectionService, profileViewService } from "@radar/api"
import { IConnectionResponse, IMessageResponse } from "@radar/types"

export default function ChatsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"messages" | "requests" | "connected">("messages")
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

  const tabs = [
    { id: "messages", label: "Mensajes", badge: chats.reduce((sum, chat) => sum + chat.unreadCount, 0) },
    { id: "requests", label: "Solicitudes", badge: pendingRequests.length },
    { id: "connected", label: "Conectados" },
  ]

  return (
    <GradientBackground>
      <div className="relative z-10 min-h-screen text-white flex flex-col">
        {/* Header */}
        <header className="bg-[#1A1A1A]/50 backdrop-blur-lg p-6 border-b border-[#00FFB3]/20">
          <h1 className="text-2xl font-bold">Chats</h1>
        </header>

        {/* Tabs */}
        <div className="p-4">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as typeof activeTab)} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "messages" && (
            <div>
              {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <p className="text-white/70">No tenés conversaciones aún.</p>
                  <p className="text-sm text-white/50 mt-2">¡Empezá a conectar con gente cerca tuyo!</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <ChatListItem
                    key={chat.conversationId}
                    name={`${chat.user.displayName}`}
                    lastMessage={chat.lastMessage.content}
                    timestamp={chat.lastMessage ? formatTimestamp(String(chat.lastMessage.createdAt)) : undefined}
                    unreadCount={chat.unreadCount}
                    photoUrl={chat.user.Profile?.photoUrl!}
                    isOnline={true}
                    onClick={() => handleChatClick(chat.user.userId)}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div>
              {pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <p className="text-white/70">No tenés solicitudes pendientes.</p>
                </div>
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.connectionId}
                    className="flex items-center justify-between p-4 border-b border-[#00FFB3]/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] flex items-center justify-center">
                        <span className="text-black font-bold text-lg">
                          {request.senderId.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">Nueva solicitud de conexión</p>
                        <p className="text-sm text-white/50">{formatTimestamp(String(request.createdAt))}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => connectionService.updateConnection(request.connectionId, "accepted")}
                      >
                        Aceptar
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => connectionService.updateConnection(request.connectionId, "rejected")}
                      >
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "connected" && (
            <div>
              <div className="border-b border-[#00FFB3]/20 pb-4">
                <button
                  onClick={() => setShowProfileViews(!showProfileViews)}
                  className="w-full px-6 py-3 flex items-center justify-between hover:bg-[#1A1A1A]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👁️</span>
                    <span className="font-semibold text-white">Vieron tu perfil</span>
                    {profileViews.length > 0 && (
                      <span className="px-2 py-0.5 bg-[#FF005C] text-white text-xs font-bold rounded-full">
                        {profileViews.length}
                      </span>
                    )}
                  </div>
                  <span className="text-white/50 transition-transform duration-300" style={{ transform: showProfileViews ? 'rotate(180deg)' : 'rotate(0deg)'}}>▼</span>
                </button>

                {showProfileViews && (
                  <div className="mt-2">
                    {profileViews.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <p className="text-white/70 text-sm">Nadie ha visto tu perfil todavía.</p>
                      </div>
                    ) : (
                      profileViews.map((view) => (
                        <ProfileViewItem
                          key={view.profileViewId}
                          name={`${view.Viewer.firstName} ${view.Viewer.lastName}`}
                          displayName={view.Viewer.displayName}
                          photoUrl={view.Viewer.photoUrl}
                          timestamp={view.createdAt}
                          onClick={() => router.push(`/profile/${view.viewerId}`)}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>

              {connections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <p className="text-white/70">Aún no tenés conexiones.</p>
                </div>
              ) : (
                connections.map((connection) => (
                  <ChatListItem
                    key={connection.connectionId}
                    name={connection.receiverId}
                    photoUrl={undefined}
                    isOnline={false}
                    onClick={() => handleChatClick(connection.receiverId)}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab="chats" onTabChange={handleTabChange} />
      </div>
    </GradientBackground>
  )
}
