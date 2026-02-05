import { IConversation, IMessageResponse, IRadarSignal } from "@radar/types"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

interface ChatState {
  chats: IConversation[]
  currentChat: IConversation | null
  replyingToSignal: IRadarSignal | null
  // Clave por conversationId
  messages: Record<string, IMessageResponse[]>
  // Maneja conversationIds que están tecleando
  typingUsers: Set<string>
  isLoading: boolean

  setChats: (chats: IConversation[]) => void
  setCurrentChat: (chat: IConversation | null) => void
  setReplyingToSignal: (signal: IRadarSignal | null) => void

  // Acciones por conversationId
  setMessages: (conversationId: string, messages: IMessageResponse[]) => void
  addMessage: (conversationId: string, message: IMessageResponse) => void
  updateChatLastMessage: (conversationId: string, message: IMessageResponse) => void
  incrementUnreadCount: (conversationId: string) => void
  resetUnreadCount: (conversationId: string) => void
  removeMessage: (conversationId: string, messageId: string) => void
  removeConversation: (conversationId: string) => void

  addTypingUser: (conversationId: string) => void
  removeTypingUser: (conversationId: string) => void

  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useChatStore = create<ChatState>()(
  immer((set) => ({
    chats: [],
    currentChat: null,
    replyingToSignal: null,
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

    setReplyingToSignal: (signal) =>
      set((state) => {
        state.replyingToSignal = signal
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

    removeMessage: (conversationId, messageId) =>
      set((state) => {
        if (state.messages[conversationId]) {
          state.messages[conversationId] = state.messages[conversationId].filter(
            (m) => m.messageId !== messageId
          )
        }
      }),

    removeConversation: (conversationId) =>
      set((state) => {
        state.chats = state.chats.filter((c) => c.conversationId !== conversationId)
        delete state.messages[conversationId]
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
