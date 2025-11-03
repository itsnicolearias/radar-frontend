"use client"

import { useState, useEffect } from "react"
import * as Location from "expo-location"
import { radarService, emitSocketEvent } from "@radar/api"
import { useRadarStore } from "../radar/use-radar-store"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  isLoading: boolean
}

export const useGeolocationNative = (enableTracking = true) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true,
  })

  const { setCurrentLocation } = useRadarStore()

  useEffect(() => {
    if (!enableTracking) return

    let subscription: Location.LocationSubscription | null = null

    const startTracking = async () => {
      try {
        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          setState((prev) => ({
            ...prev,
            error: "Permiso de ubicación denegado",
            isLoading: false,
          }))
          return
        }

        // Get initial position
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        })

        const { latitude, longitude } = location.coords
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

        // Watch position changes
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 30000, // Update every 30 seconds
            distanceInterval: 50, // Or when moved 50 meters
          },
          async (location) => {
            const { latitude, longitude } = location.coords
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
              console.error("[v0] Error updating location:", error)
            }
          },
        )
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Error desconocido",
          isLoading: false,
        }))
      }
    }

    startTracking()

    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [enableTracking, setCurrentLocation])

  return state
}
