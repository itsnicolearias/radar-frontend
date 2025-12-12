"use client"

import { useEffect, useRef } from "react"
import * as Notifications from "expo-notifications"
import { useNotificationStore } from "../notification/use-notification-store"
import { notificationService } from "@radar/api"
import { useSocketEvent } from "../socket/use-socket"
import type { INotificationResponse } from "@radar/types"
import { useAuthStore } from "../auth/use-auth-store"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,
    shouldShowBanner: false,
  }),
})

export const useNotifications = () => {
  const { notifications, unreadCount, setNotifications, setUnreadCount, addNotification } = useNotificationStore()
  const { isAuthenticated } = useAuthStore()

  const notificationListener = useRef<Notifications.Subscription>(null)
  const responseListener = useRef<Notifications.Subscription>(null)

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchNotifications = async () => {
      try {
        const [notifs, count] = await Promise.all([
          notificationService.getNotifications(),
          notificationService.getUnreadCount(),
        ])
        setNotifications(notifs)
        setUnreadCount(count.count ?? 0)
      } catch (error) {
        console.error("[v0] Error fetching notifications:", error)
      }
    }

    fetchNotifications()
  }, [isAuthenticated, setNotifications, setUnreadCount])

  useSocketEvent<INotificationResponse>(
    "new-notification",
    async (notification) => {
      addNotification(notification)

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Radar",
          body: notification.message,
          data: { notificationId: notification.notificationId },
        },
        trigger: null,
      })
    },
    [addNotification],
  )

  useEffect(() => {
    if (!isAuthenticated) return

    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== "granted") {
        console.warn("[v0] Notification permissions not granted")
      }
    }

    requestPermissions()

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("[v0] Notification received:", notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("[v0] Notification response:", response)
    })

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove()
      }
      if (responseListener.current) {
        responseListener.current.remove()
      }
    }
  }, [isAuthenticated])

  return {
    notifications,
    unreadCount,
  }
}
