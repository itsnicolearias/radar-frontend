import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { NearbyUser, Event } from "@radar/types"

interface RadarState {
  nearbyUsers: NearbyUser[]
  nearbyEvents: Event[]
  currentLocation: { latitude: number; longitude: number } | null
  isLoading: boolean
  error: string | null
  setNearbyUsers: (users: NearbyUser[]) => void
  setNearbyEvents: (events: Event[]) => void
  setCurrentLocation: (location: { latitude: number; longitude: number }) => void
  addNearbyUser: (user: NearbyUser) => void
  removeNearbyUser: (userId: string) => void
  updateUserLocation: (userId: string, latitude: number, longitude: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useRadarStore = create<RadarState>()(
  immer((set) => ({
    nearbyUsers: [],
    nearbyEvents: [],
    currentLocation: null,
    isLoading: false,
    error: null,
    setNearbyUsers: (users) =>
      set((state) => {
        state.nearbyUsers = users
      }),
    setNearbyEvents: (events) =>
      set((state) => {
        state.nearbyEvents = events
      }),
    setCurrentLocation: (location) =>
      set((state) => {
        state.currentLocation = location
      }),
    addNearbyUser: (user) =>
      set((state) => {
        const exists = state.nearbyUsers.find((u) => u.user.userId === user.user.userId)
        if (!exists) {
          state.nearbyUsers.push(user)
        }
      }),
    removeNearbyUser: (userId) =>
      set((state) => {
        state.nearbyUsers = state.nearbyUsers.filter((u) => u.user.userId !== userId)
      }),
    updateUserLocation: (userId, latitude, longitude) =>
      set((state) => {
        const user = state.nearbyUsers.find((u) => u.user.userId === userId)
        if (user) {
          user.user.lastLatitude = latitude
          user.user.lastLongitude = longitude
        }
      }),
    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),
    setError: (error) =>
      set((state) => {
        state.error = error
      }),
    reset: () =>
      set((state) => {
        state.nearbyUsers = []
        state.nearbyEvents = []
        state.currentLocation = null
        state.isLoading = false
        state.error = null
      }),
  })),
)
