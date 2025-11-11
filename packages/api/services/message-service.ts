import { axiosClient } from "../axios-client"
import type { Message, RecentChats } from "@radar/types"

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
    conversations: RecentChats[]
  }
}

export const messageService = {
  async getChats(): Promise<RecentChats[]> {
    const response = await axiosClient.get<ChatsResponse>("/messages")

    return response.data.data.conversations;
  },

  async getMessages(userId: string): Promise<Message[]> {
    const response = await axiosClient.get(`/messages/${userId}`)

    return response.data.data
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
