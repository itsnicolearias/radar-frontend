"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChatListItem, Tabs, BottomNav } from "@radar/ui"
import { useChatStore, useConnectionStore, useSocketEvent } from "@radar/features"
import { messageService, connectionService } from "@radar/api"
import type { Message, Connection } from "@radar/types"

export default function ChatsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"messages" | "requests" | "connected">("messages")

  const { chats, setChats, updateChatLastMessage, incrementUnreadCount } = useChatStore()
  const { connections, pendingRequests, setConnections, setPendingRequests } = useConnectionStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatsData, connectionsData, requestsData] = await Promise.all([
          messageService.getChats(),
          connectionService.getConnections("accepted"),
          connectionService.getConnections("pending"),
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

  useSocketEvent<Message>(
    "new-message",
    (message) => {
      updateChatLastMessage(message.senderId, message)
      incrementUnreadCount(message.senderId)
    },
    [updateChatLastMessage, incrementUnreadCount],
  )

  useSocketEvent<Connection>(
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#2C5F8D] text-white px-6 py-4 pt-12">
        <h1 className="text-2xl font-bold">Chats</h1>
      </header>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as typeof activeTab)} />

      {/* Content */}
      <div className="flex-1 bg-white overflow-y-auto">
        {activeTab === "messages" && (
          <div>
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <p className="text-gray-500">No tienes conversaciones aún</p>
                <p className="text-sm text-gray-400 mt-2">Conecta con personas cercanas para empezar a chatear</p>
              </div>
            ) : (
              chats.map((chat) => (
                <ChatListItem
                  key={chat.userId}
                  name={`${chat.user.firstName} ${chat.user.lastName}`}
                  lastMessage={chat.lastMessage?.content}
                  timestamp={chat.lastMessage ? formatTimestamp(chat.lastMessage.createdAt) : undefined}
                  unreadCount={chat.unreadCount}
                  photoUrl={chat.profile.photoUrl}
                  isOnline={true}
                  onClick={() => handleChatClick(chat.userId)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div>
            {pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <p className="text-gray-500">No tienes solicitudes pendientes</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div
                  key={request.connectionId}
                  className="flex items-center justify-between p-4 border-b border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFB3] to-[#14B8A6] flex items-center justify-center">
                      <span className="text-[#0E2A3E] font-semibold text-sm">
                        {request.senderId.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Nueva solicitud</p>
                      <p className="text-sm text-gray-500">{formatTimestamp(request.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => connectionService.updateConnectionStatus(request.connectionId, "accepted")}
                      className="px-4 py-2 bg-[#00FFB3] text-[#0E2A3E] rounded-full text-sm font-medium"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => connectionService.updateConnectionStatus(request.connectionId, "rejected")}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium"
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
            {connections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <p className="text-gray-500">No tienes conexiones aún</p>
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
