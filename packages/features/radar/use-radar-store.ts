import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { NearbyUser, Event, ISignal } from "@radar/types"

interface RadarState {
  nearbyUsers: NearbyUser[]
  nearbyEvents: Event[]
  nearbySignals: ISignal[]
  currentLocation: { latitude: number; longitude: number } | null
  isLoading: boolean
  error: string | null
  setNearbyUsers: (users: NearbyUser[]) => void
  setNearbyEvents: (events: Event[]) => void
  setNearbySignals: (signals: ISignal[]) => void
  addNearbySignal: (signal: ISignal) => void
  removeNearbySignal: (signalId: string) => void
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
    nearbySignals: [],
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
    setNearbySignals: (signals) =>
      set((state) => {
        state.nearbySignals = signals
      }),
    addNearbySignal: (signal) =>
      set((state) => {
        const exists = state.nearbySignals.find((s) => s.signalId === signal.signalId)
        if (!exists) {
          state.nearbySignals.push(signal)
        }
      }),
    removeNearbySignal: (signalId) =>
      set((state) => {
        state.nearbySignals = state.nearbySignals.filter((s) => s.signalId !== signalId)
      }),
    setCurrentLocation: (location) =>
      set((state) => {
        state.currentLocation = location
      }),
    addNearbyUser: (user) =>
      set((state) => {
        const exists = state.nearbyUsers.find((u) => u.userId === user.userId)
        if (!exists) {
          state.nearbyUsers.push(user)
        }
      }),
    removeNearbyUser: (userId) =>
      set((state) => {
        state.nearbyUsers = state.nearbyUsers.filter((u) => u.userId !== userId)
      }),
    updateUserLocation: (userId, latitude, longitude) =>
      set((state) => {
        const user = state.nearbyUsers.find((u) => u.userId === userId)
        if (user) {
          user.lastLatitude = latitude
          user.lastLongitude = longitude
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
        state.nearbySignals = []
        state.currentLocation = null
        state.isLoading = false
        state.error = null
      }),
  })),
)
