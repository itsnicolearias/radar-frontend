import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { RecentChats, Message } from "@radar/types"

interface ChatState {
  chats: RecentChats[]
  currentChat: RecentChats | null
  messages: Record<string, Message[]>
  typingUsers: Set<string>
  isLoading: boolean
  setChats: (chats: RecentChats[]) => void
  setCurrentChat: (chat: RecentChats | null) => void
  setMessages: (userId: string, messages: Message[]) => void
  addMessage: (userId: string, message: Message) => void
  updateChatLastMessage: (userId: string, message: Message) => void
  incrementUnreadCount: (userId: string) => void
  resetUnreadCount: (userId: string) => void
  addTypingUser: (userId: string) => void
  removeTypingUser: (userId: string) => void
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
    setMessages: (userId, messages) =>
      set((state) => {
        state.messages[userId] = messages
      }),
    addMessage: (userId, message) =>
      set((state) => {
        if (!state.messages[userId]) {
          state.messages[userId] = []
        }
        state.messages[userId].push(message)
      }),
    updateChatLastMessage: (userId, message) =>
      set((state) => {
        const chat = state.chats.find((c) => c.userId === userId)
        if (chat) {
          chat.lastMessage = message
        }
      }),
    incrementUnreadCount: (userId) =>
      set((state) => {
        const chat = state.chats.find((c) => c.userId === userId)
        if (chat) {
          chat.unreadCount += 1
        }
      }),
    resetUnreadCount: (userId) =>
      set((state) => {
        const chat = state.chats.find((c) => c.userId === userId)
        if (chat) {
          chat.unreadCount = 0
        }
      }),
    addTypingUser: (userId) =>
      set((state) => {
        state.typingUsers.add(userId)
      }),
    removeTypingUser: (userId) =>
      set((state) => {
        state.typingUsers.delete(userId)
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
