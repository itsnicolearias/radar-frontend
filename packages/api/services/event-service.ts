import { axiosClient } from "../axios-client"
import type { Event } from "@radar/types"

export interface EventsResponse {
  events: Event[]
}

export const eventService = {
  async getNearbyEvents(latitude: number, longitude: number): Promise<Event[]> {
    const response = await axiosClient.get<EventsResponse>("/events", {
      params: { latitude, longitude },
    })
    return response.data.events
  },

  async getEventById(eventId: string): Promise<Event> {
    const response = await axiosClient.get<Event>(`/events/${eventId}`)
    return response.data
  },

  async toggleInterest(eventId: string, interested: boolean): Promise<void> {
    if (interested) {
      await axiosClient.post(`/events/${eventId}/interest`)
    } else {
      await axiosClient.delete(`/events/${eventId}/interest`)
    }
  },
}
