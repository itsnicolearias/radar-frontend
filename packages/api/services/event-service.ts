import { axiosClient } from "../axios-client"
import type { IEventResponse, IEventCreatePayload, IEventsListResponse } from "@radar/types"

export const eventService = {
  async getAllEvents(): Promise<IEventsListResponse> {
    try {
      const response = await axiosClient.get<IEventsListResponse>("/events")
      return response.data
    } catch (error) {
      console.error("[v0] Error fetching events:", error)
      throw error
    }
  },

  async getEventById(eventId: string): Promise<IEventResponse> {
    try {
      const response = await axiosClient.get<IEventResponse>(`/events/${eventId}`)
      return response.data
    } catch (error) {
      console.error("[v0] Error fetching event:", error)
      throw error
    }
  },

  async createEvent(payload: IEventCreatePayload): Promise<IEventResponse> {
    try {
      const response = await axiosClient.post<IEventResponse>("/events", payload)
      return response.data
    } catch (error) {
      console.error("[v0] Error creating event:", error)
      throw error
    }
  },

  async updateEvent(eventId: string, payload: Partial<IEventCreatePayload>): Promise<IEventResponse> {
    try {
      const response = await axiosClient.patch<IEventResponse>(`/events/${eventId}`, payload)
      return response.data
    } catch (error) {
      console.error("[v0] Error updating event:", error)
      throw error
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await axiosClient.delete(`/events/${eventId}`)
    } catch (error) {
      console.error("[v0] Error deleting event:", error)
      throw error
    }
  },

  async markInterest(eventId: string): Promise<void> {
    try {
      await axiosClient.post(`/events/${eventId}/interest`)
    } catch (error) {
      console.error("[v0] Error marking interest:", error)
      throw error
    }
  },

  async unmarkInterest(eventId: string): Promise<void> {
    try {
      await axiosClient.delete(`/events/${eventId}/interest`)
    } catch (error) {
      console.error("[v0] Error unmarking interest:", error)
      throw error
    }
  },
}
