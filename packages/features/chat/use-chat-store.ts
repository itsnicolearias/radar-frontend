import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { RecentChats, Message } from "@radar/types"

interface ChatState {
  chats: RecentChats[]
  currentChat: RecentChats | null
  // Clave por conversationId
  messages: Record<string, Message[]>
  // Maneja conversationIds que están tecleando
  typingUsers: Set<string>
  isLoading: boolean

  setChats: (chats: RecentChats[]) => void
  setCurrentChat: (chat: RecentChats | null) => void

  // Acciones por conversationId
  setMessages: (conversationId: string, messages: Message[]) => void
  addMessage: (conversationId: string, message: Message) => void
  updateChatLastMessage: (conversationId: string, message: Message) => void
  incrementUnreadCount: (conversationId: string) => void
  resetUnreadCount: (conversationId: string) => void

  addTypingUser: (conversationId: string) => void
  removeTypingUser: (conversationId: string) => void

  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useChatStore = create<ChatState>()(
  immer((set) => ({
    chats: [],
    currentChat: null,
    messages: {},
    typingUsers: new Set(),
    isLoading: false,

    setChats: (chats) =>
      set((state) => {
        state.chats = chats
      }),

    setCurrentChat: (chat) =>
      set((state) => {
        state.currentChat = chat
      }),

    setMessages: (conversationId, messages) =>
      set((state) => {
        state.messages[conversationId] = messages
      }),

    addMessage: (conversationId, message) =>
      set((state) => {
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = []
        }
        state.messages[conversationId].push(message)
      }),

    updateChatLastMessage: (conversationId, message) =>
      set((state) => {
        const chat = state.chats.find((c) => c.conversationId === conversationId)
        if (chat) {
          chat.lastMessage = message
        }
      }),

    incrementUnreadCount: (conversationId) =>
      set((state) => {
        const chat = state.chats.find((c) => c.conversationId === conversationId)
        if (chat) {
          chat.unreadCount += 1
        }
      }),

    resetUnreadCount: (conversationId) =>
      set((state) => {
        const chat = state.chats.find((c) => c.conversationId === conversationId)
        if (chat) {
          chat.unreadCount = 0
        }
      }),

    addTypingUser: (conversationId) =>
      set((state) => {
        state.typingUsers.add(conversationId)
      }),

    removeTypingUser: (conversationId) =>
      set((state) => {
        state.typingUsers.delete(conversationId)
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),

    reset: () =>
      set((state) => {
        state.chats = []
        state.currentChat = null
        state.messages = {}
        state.typingUsers = new Set()
        state.isLoading = false
      }),
  })),
)