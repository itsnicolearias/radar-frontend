import { axiosClient } from "../axios-client"
import type { Message, Chat } from "@radar/types"

export interface SendMessageInput {
  receiverId: string
  content: string
}

export interface MessagesResponse {
  messages: Message[]
}

export interface ChatsResponse {
  success: boolean
  data: {
    conversations: Chat[]
  }
}

export const messageService = {
  async getChats(): Promise<Chat[]> {
    const response = await axiosClient.get<ChatsResponse>("/messages")
    return response.data.data.conversations;
  },

  async getMessages(userId: string): Promise<Message[]> {
    const response = await axiosClient.get<MessagesResponse>(`/messages/${userId}`)
    return response.data.messages
  },

  async sendMessage(data: SendMessageInput): Promise<Message> {
    const response = await axiosClient.post<Message>("/messages", {
      receiver_id: data.receiverId,
      content: data.content,
    })
    return response.data
  },

  async markAsRead(messageId: string): Promise<void> {
    await axiosClient.patch(`/messages/${messageId}/read`)
  },
}
