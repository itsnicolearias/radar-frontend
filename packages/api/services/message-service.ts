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
  messageIds: string[]
}

export const messageService = {
  async getConversations(
    page?: number,
    limit?: number,
    all?: boolean,
  ) {
    const response = await axiosClient.get("/messages", {
      params: { page, limit, all },
    })

    return response.data.data.conversations;
  },

  async getMessages(userId: string): Promise<IMessageResponse[]> {
    const response = await axiosClient.get(`/messages/${userId}`)
    return response.data.data;
  },

  async sendMessage(data: SendMessageInput): Promise<IMessageResponse> {
    const response = await axiosClient.post<{ data: IMessageResponse }>("/messages", data)
    return response.data?.data
  },

  async markAsRead(messageIds: string[]): Promise<IMarkAsReadResponse> {
    const requestData = { messageIds: messageIds }
    const response = await axiosClient.patch<IMarkAsReadResponse>("/messages/read", requestData)
    return response.data
  },

  async getUnreadCount(): Promise<IUnreadMessagesResponse> {
    const response = await axiosClient.get<IUnreadMessagesResponse>("/messages/unread/count")
    return response.data
  },
}
