"use client"

import { useEffect, useRef } from "react"
import * as Notifications from "expo-notifications"
import { useNotificationStore } from "../notification/use-notification-store"
import { notificationService } from "@radar/api"
import { useSocketEvent } from "../socket/use-socket"
import type { Notification } from "@radar/types"

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,
    shouldShowBanner: false
  }),
})

export const useNotifications = () => {
  const { notifications, unreadCount, setNotifications, setUnreadCount, addNotification } = useNotificationStore()

  const notificationListener = useRef<Notifications.Subscription>(null)
  const responseListener = useRef<Notifications.Subscription>(null)

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notifs, count] = await Promise.all([
          notificationService.getNotifications(),
          notificationService.getUnreadCount(),
        ])
        setNotifications(notifs)
        setUnreadCount(count)
      } catch (error) {
        console.error("[v0] Error fetching notifications:", error)
      }
    }

    fetchNotifications()
  }, [setNotifications, setUnreadCount])

  // Listen for new notifications via Socket.io
  useSocketEvent<Notification>(
    "new-notification",
    async (notification) => {
      addNotification(notification)

      // Show local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Radar",
          body: notification.message,
          data: { notificationId: notification.notificationId },
        },
        trigger: null, // Show immediately
      })
    },
    [addNotification],
  )

  // Setup notification listeners
  useEffect(() => {
    // Request permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== "granted") {
        console.warn("[v0] Notification permissions not granted")
      }
    }

    requestPermissions()

    // Listen for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("[v0] Notification received:", notification)
    })

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("[v0] Notification response:", response)
      // Handle navigation based on notification data
    })

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove()
      }
      if (responseListener.current) {
        responseListener.current.remove()
      }
    }
  }, [])

  return {
    notifications,
    unreadCount,
  }
}
