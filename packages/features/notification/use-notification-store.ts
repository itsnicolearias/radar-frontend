import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { Notification } from "@radar/types"

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  setNotifications: (notifications: Notification[]) => void
  setUnreadCount: (count: number) => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  removeNotification: (notificationId: string) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useNotificationStore = create<NotificationState>()(
  immer((set) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    setNotifications: (notifications) =>
      set((state) => {
        state.notifications = notifications
      }),
    setUnreadCount: (count) =>
      set((state) => {
        state.unreadCount = count
      }),
    addNotification: (notification) =>
      set((state) => {
        state.notifications.unshift(notification)
        if (!notification.isRead) {
          state.unreadCount += 1
        }
      }),
    markAsRead: (notificationId) =>
      set((state) => {
        const notification = state.notifications.find((n) => n.notificationId === notificationId)
        if (notification && !notification.isRead) {
          notification.isRead = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      }),
    markAllAsRead: () =>
      set((state) => {
        state.notifications.forEach((n) => {
          n.isRead = true
        })
        state.unreadCount = 0
      }),
    removeNotification: (notificationId) =>
      set((state) => {
        const notification = state.notifications.find((n) => n.notificationId === notificationId)
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        state.notifications = state.notifications.filter((n) => n.notificationId !== notificationId)
      }),
    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),
    reset: () =>
      set((state) => {
        state.notifications = []
        state.unreadCount = 0
        state.isLoading = false
      }),
  })),
)
