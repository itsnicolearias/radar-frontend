import { axiosClient } from "../axios-client"
import type { Notification } from "@radar/types"

export interface NotificationsResponse {
  notifications: Notification[]
}

export interface UnreadCountResponse {
  count: number
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await axiosClient.get<NotificationsResponse>("/notifications")
    return response.data.notifications
  },

  async getUnreadCount(): Promise<number> {
    const response = await axiosClient.get<UnreadCountResponse>("/notifications/unread/count")
    return response.data.count
  },

  async markAsRead(notificationId?: string): Promise<void> {
    if (notificationId) {
      await axiosClient.patch(`/notifications/${notificationId}/read`)
    } else {
      await axiosClient.patch("/notifications/read")
    }
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await axiosClient.delete(`/notifications/${notificationId}`)
  },
}
