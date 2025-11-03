"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuthStore, useGeolocation, useNotifications, useSocket } from "@radar/features"

export function Providers({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const { requestPermission } = useNotifications()

  // Initialize socket connection
  useSocket()

  // Enable geolocation tracking when authenticated
  useGeolocation(isAuthenticated)

  // Request notification permission on mount
  useEffect(() => {
    if (isAuthenticated) {
      requestPermission()
    }
  }, [isAuthenticated, requestPermission])

  return <>{children}</>
}
