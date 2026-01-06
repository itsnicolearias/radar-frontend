import { axiosRequestor } from "../../../lib/api/axios-client"
import type {
  INotificationResponse,
  IUnreadNotificationCountResponse,
  IMarkNotificationsAsReadResponse,
  IDeleteNotificationResponse,
} from "@radar/types"

export interface MarkNotificationsAsReadInput {
  notificationIds: string[]
}

export const notificationService = {
  async getNotifications(): Promise<INotificationResponse[]> {
    const response = await axiosRequestor.get<INotificationResponse[]>("/notifications")
    return response.data
  },

  async getUnreadCount(): Promise<IUnreadNotificationCountResponse> {
    const response = await axiosRequestor.get<IUnreadNotificationCountResponse>(
      "/notifications/unread/count",
    )
    return response.data
  },

  async markAsRead(
    data: MarkNotificationsAsReadInput,
  ): Promise<IMarkNotificationsAsReadResponse> {
    const response = await axiosRequestor.patch<IMarkNotificationsAsReadResponse>(
      "/notifications/read",
      data,
    )
    return response.data
  },

  async deleteNotification(notificationId: string): Promise<IDeleteNotificationResponse> {
    const response = await axiosRequestor.delete<IDeleteNotificationResponse>(
      `/notifications/${notificationId}`,
    )
    return response.data
  },
}
