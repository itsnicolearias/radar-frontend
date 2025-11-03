import type React from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuthStore, useGeolocationNative, useNotificationsNative, useSocket } from "@radar/features"

function AppProviders({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  // Initialize socket connection
  useSocket()

  // Enable geolocation tracking when authenticated
  useGeolocationNative(isAuthenticated)

  // Setup notifications
  useNotificationsNative()

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
