import type React from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuthStore, useGeolocation, useNotifications, useSocket } from "@radar/features"

function AppProviders({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  // Initialize socket connection
  useSocket()

  // Enable geolocation tracking when authenticated
  useGeolocation(isAuthenticated)

  // Setup notifications
  useNotifications()

  return <>{children}</>
}

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0A1628" },
        }}
      />
    </AppProviders>
  )
}
