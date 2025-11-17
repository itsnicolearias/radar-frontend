"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { ChatListItem, Tabs, BottomNav, ProfileViewItem } from "@radar/ui"
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
    <div className="min-h-screen bg-black flex flex-col">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1DE3F2]/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 bg-black px-6 py-4 pt-12 border-b border-[#00FFB3]/10">
        <h1 className="text-2xl font-bold text-white">Chats</h1>
      </header>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as typeof activeTab)} />

      {/* Content */}
      <div className="relative flex-1 bg-black overflow-y-auto">
        {activeTab === "messages" && (
          <div>
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <p className="text-[#C5C5C5]">No tienes conversaciones aún</p>
                <p className="text-sm text-[#8B8B8B] mt-2">Conecta con personas cercanas para empezar a chatear</p>
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
                <p className="text-[#C5C5C5]">No tienes solicitudes pendientes</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div
                  key={request.connectionId}
                  className="flex items-center justify-between p-4 border-b border-[#1A1A1A]/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] flex items-center justify-center">
                      <span className="text-black font-semibold text-sm">
                        {request.senderId.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Nueva solicitud</p>
                      <p className="text-sm text-[#8B8B8B]">{formatTimestamp(String(request.createdAt))}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => connectionService.updateConnection(request.connectionId, "accepted")}
                      className="px-4 py-2 bg-[#00FFB3] text-black rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-[#00FFB3]/30"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => connectionService.updateConnection(request.connectionId, "rejected")}
                      className="px-4 py-2 bg-[#1A1A1A] text-[#C5C5C5] rounded-full text-sm font-medium border border-[#1DE3F2]/30 hover:border-[#1DE3F2] transition-all"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "connected" && (
          <div>
            <div className="border-b border-[#1A1A1A]/50 pb-4">
              <button
                onClick={() => setShowProfileViews(!showProfileViews)}
                className="w-full px-6 py-3 flex items-center justify-between hover:bg-[#1A1A1A]/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#FF005C] text-lg">👁️</span>
                  <span className="font-semibold text-white">Vieron tu perfil</span>
                  {profileViews.length > 0 && (
                    <span className="px-2 py-0.5 bg-[#FF005C] text-white text-xs font-bold rounded-full">
                      {profileViews.length}
                    </span>
                  )}
                </div>
                <span className="text-[#8B8B8B]">{showProfileViews ? "▼" : "▶"}</span>
              </button>

              {showProfileViews && (
                <div className="mt-2">
                  {profileViews.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <p className="text-[#8B8B8B] text-sm">Aún nadie ha visto tu perfil</p>
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
                <p className="text-[#C5C5C5]">No tienes conexiones aún</p>
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
  )
}
