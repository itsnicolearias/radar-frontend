"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@radar/features"
import { onLogout, offLogout } from "../../../packages/common/event-bus"

export default function AuthRehydrator() {
  const router = useRouter()
  const rehydrate = useAuthStore((s) => s.rehydrate)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    // Attempt rehydration on mount
    rehydrate()

    // Listen for global logout events and redirect to /login
    const handler = () => {
      logout()
      router.push("/login")
    }

    const off = onLogout(handler)

    return () => {
      // remove listener
      if (typeof off === "function") off()
      // also attempt to remove if offLogout is available
      try {
        offLogout(handler)
      } catch (e) {
        // ignore
      }
    }
  }, [rehydrate, logout, router])

  return null
}
