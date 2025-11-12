import { axiosClient } from "../axios-client"
import type {
  IConversationsResponse,
  IMessageResponse,
  IMarkAsReadResponse,
  IUnreadMessagesResponse,
} from "@radar/types"

export interface SendMessageInput {
  receiverId: string
  content: string
}

export interface MarkAsReadInput {
  senderId: string
}

export const messageService = {
  async getConversations(
    page: number,
    limit: number,
    all: boolean,
  ): Promise<IConversationsResponse> {
    const response = await axiosClient.get<IConversationsResponse>("/messages", {
      params: { page, limit, all },
    })
    return response.data
  },

  async getMessages(userId: string): Promise<IMessageResponse[]> {
    const response = await axiosClient.get<IMessageResponse[]>(`/messages/${userId}`)
    return response.data
  },

  async sendMessage(data: SendMessageInput): Promise<IMessageResponse> {
    const response = await axiosClient.post<IMessageResponse>("/messages", data)
    return response.data
  },

  async markAsRead(data: MarkAsReadInput): Promise<IMarkAsReadResponse> {
    const response = await axiosClient.patch<IMarkAsReadResponse>("/messages/read", data)
    return response.data
  },

  async getUnreadCount(): Promise<IUnreadMessagesResponse> {
    const response = await axiosClient.get<IUnreadMessagesResponse>("/messages/unread/count")
    return response.data
  },
}
