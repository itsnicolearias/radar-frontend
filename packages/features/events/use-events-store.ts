import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { IEventResponse } from "@radar/types"

interface EventsState {
  events: IEventResponse[]
  myEvents: IEventResponse[]
  isLoading: boolean
  error: string | null
  selectedCategory: string | null
  setEvents: (events: IEventResponse[]) => void
  setMyEvents: (events: IEventResponse[]) => void
  addEvent: (event: IEventResponse) => void
  updateEvent: (eventId: string, event: Partial<IEventResponse>) => void
  removeEvent: (eventId: string) => void
  toggleInterest: (eventId: string, isInterested: boolean) => void
  setSelectedCategory: (category: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  events: [],
  myEvents: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
}

export const useEventsStore = create<EventsState>()(
  immer((set) => ({
    ...initialState,

    setEvents: (events) =>
      set((state) => {
        state.events = events
      }),

    setMyEvents: (events) =>
      set((state) => {
        state.myEvents = events
      }),

    addEvent: (event) =>
      set((state) => {
        state.events.unshift(event)
        state.myEvents.unshift(event)
      }),

    updateEvent: (eventId, updatedEvent) =>
      set((state) => {
        const index = state.events.findIndex((e) => e.eventId === eventId)
        if (index !== -1) {
          state.events[index] = { ...state.events[index], ...updatedEvent }
        }
        const myIndex = state.myEvents.findIndex((e) => e.eventId === eventId)
        if (myIndex !== -1) {
          state.myEvents[myIndex] = { ...state.myEvents[myIndex], ...updatedEvent }
        }
      }),

    removeEvent: (eventId) =>
      set((state) => {
        state.events = state.events.filter((e) => e.eventId !== eventId)
        state.myEvents = state.myEvents.filter((e) => e.eventId !== eventId)
      }),

    toggleInterest: (eventId, isInterested) =>
      set((state) => {
        const event = state.events.find((e) => e.eventId === eventId)
        if (event) {
          isInterested = !isInterested
        }
      }),

    setSelectedCategory: (category) =>
      set((state) => {
        state.selectedCategory = category
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),

    setError: (error) =>
      set((state) => {
        state.error = error
      }),

    reset: () => set(initialState),
  })),
)
