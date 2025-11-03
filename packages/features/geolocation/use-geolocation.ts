"use client"

import { useState, useEffect } from "react"
import { radarService, emitSocketEvent } from "@radar/api"
import { useRadarStore } from "../radar/use-radar-store"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  isLoading: boolean
}

export const useGeolocation = (enableTracking = true) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true,
  })

  const { setCurrentLocation } = useRadarStore()

  useEffect(() => {
    if (!enableTracking) return

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocalización no soportada",
        isLoading: false,
      }))
      return
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setState({
          latitude,
          longitude,
          error: null,
          isLoading: false,
        })
        setCurrentLocation({ latitude, longitude })

        // Update location on server
        try {
          await radarService.updateLocation({ latitude, longitude })
          emitSocketEvent("update-location", { latitude, longitude })
        } catch (error) {
          console.error("[v0] Error updating location:", error)
        }
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          error: error.message,
          isLoading: false,
        }))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )

    // Watch position changes
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setState((prev) => ({
          ...prev,
          latitude,
          longitude,
        }))
        setCurrentLocation({ latitude, longitude })

        // Update location on server
        try {
          await radarService.updateLocation({ latitude, longitude })
          emitSocketEvent("update-location", { latitude, longitude })
        } catch (error) {
          console.error("[v0] Geolocation watch error:", error)
        }
      },
      (error) => {
        console.error("[v0] Geolocation watch error:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000, // Update every 30 seconds
      },
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [enableTracking, setCurrentLocation])

  return state
}
