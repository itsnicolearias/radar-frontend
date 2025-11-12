import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { IEventResponse } from "@radar/types"

interface EventsState {
  events: IEventResponse[]
  isLoading: boolean
  error: string | null
  setEvents: (events: IEventResponse[]) => void
  addEvent: (event: IEventResponse) => void
  updateEvent: (event: IEventResponse) => void
  removeEvent: (eventId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useEventsStore = create<EventsState>()(
  immer((set) => ({
    events: [],
    isLoading: false,
    error: null,
    setEvents: (events) =>
      set((state) => {
        state.events = events
      }),
    addEvent: (event) =>
      set((state) => {
        state.events.push(event)
      }),
    updateEvent: (event) =>
      set((state) => {
        const index = state.events.findIndex((e) => e.eventId === event.eventId)
        if (index !== -1) {
          state.events[index] = event
        }
      }),
    removeEvent: (eventId) =>
      set((state) => {
        state.events = state.events.filter((e) => e.eventId !== eventId)
      }),
    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),
    setError: (error) =>
      set((state) => {
        state.error = error
      }),
  })),
)
