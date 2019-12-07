import * as React from "react"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { useAuthStore, useGeolocation, useNotifications, useSocket } from "@radar/features"

function AppProviders({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const rehydrate = useAuthStore((s) => s.rehydrate)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  useEffect(() => {
    // Attempt rehydration on mount
    rehydrate()

    let off: (() => void) | undefined

    // Dynamically import the event-bus to avoid static resolution issues with Metro
    ;(async () => {
      try {
        const mod = await import("../../../packages/common/event-bus")
        off = mod.onLogout(() => {
          logout()
          router.push("/login")
        })
      } catch (e) {
        // fail silently — if import fails, logout events won't be listened here
      }
    })()

    return () => {
      if (typeof off === "function") off()
    }
  }, [rehydrate, logout, router])

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
