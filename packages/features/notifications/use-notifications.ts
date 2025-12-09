"use client"

import { useEffect } from "react"
import { useNotificationStore } from "../notification/use-notification-store"
import { notificationService } from "@radar/api"
import { useSocketEvent } from "../socket/use-socket"
import type { INotificationResponse } from "@radar/types"

export const useNotifications = () => {
  const { notifications, unreadCount, setNotifications, setUnreadCount, addNotification } = useNotificationStore()

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notifs, count] = await Promise.all([
          notificationService.getNotifications(),
          notificationService.getUnreadCount(),
        ])
        setNotifications(notifs)
        setUnreadCount(count.count)
      } catch (error) {
        console.error("[v0] Error fetching notifications:", error)
      }
    }

    fetchNotifications()
  }, [setNotifications, setUnreadCount])

  // Listen for new notifications via Socket.io
  useSocketEvent<INotificationResponse>(
    "new-notification",
    (notification) => {
      addNotification(notification)

      // Show browser notification if supported
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Radar", {
          body: notification.message,
          icon: "/icon.png",
        })
      }
    },
    [addNotification],
  )

  const requestPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }
  }

  return {
    notifications,
    unreadCount,
    requestPermission,
  }
}
