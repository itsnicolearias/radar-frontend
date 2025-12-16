"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuthStore, useNotifications, useSocket } from "@radar/features"
import { GeolocationProvider } from "./GeolocationProvider"
import AuthRehydrator from "./AuthRehydrator"

export function Providers({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const { requestPermission } = useNotifications()

  // Initialize socket connection
  useSocket()

  // Request notification permission on mount
  useEffect(() => {
    if (isAuthenticated) {
      requestPermission()
    }
  }, [isAuthenticated, requestPermission])

  return (
    <>
      <AuthRehydrator />
      <GeolocationProvider />
      {children}
    </>
  )
}
