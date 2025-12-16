"use client"

import { useAuthStore, useGeolocation } from "@radar/features"

export function GeolocationProvider() {
  const { isAuthenticated } = useAuthStore()
  useGeolocation(isAuthenticated)
  return null
}
