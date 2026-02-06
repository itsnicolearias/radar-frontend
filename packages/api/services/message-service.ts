import { axiosRequestor } from "../../../lib/api/axios-client"
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
    const response = await axiosRequestor.get("/messages", {
      params: { page, limit, all },
    })

    return response.data.data.conversations;
  },

  async getMessages(userId: string): Promise<IMessageResponse[]> {
    const response = await axiosRequestor.get(`/messages/${userId}`)
    return response.data.data;
  },

  async sendMessage(data: SendMessageInput): Promise<IMessageResponse> {
    const response = await axiosRequestor.post<{ data: IMessageResponse }>("/messages", data)
    return response.data?.data
  },

  async markAsRead(messageIds: string[]): Promise<IMarkAsReadResponse> {
    const requestData = { messageIds: messageIds }
    const response = await axiosRequestor.post<IMarkAsReadResponse>("/messages/mark-as-read", requestData)
    return response.data
  },

  async getUnreadCount(): Promise<IUnreadMessagesResponse> {
    const response = await axiosRequestor.get<IUnreadMessagesResponse>("/messages/unread/count")
    return response.data
  },

  async deleteMessage(messageId: string): Promise<void> {
    await axiosRequestor.delete(`/messages/${messageId}`)
  },

  async deleteConversation(otherUserId: string): Promise<void> {
    await axiosRequestor.delete(`/conversations/${otherUserId}`)
  },
}
