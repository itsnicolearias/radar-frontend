import { axiosRequestor } from "../../../lib/api/axios-client"
import type { IEventResponse, IEventCreatePayload, IEventsListResponse } from "@radar/types"

export const eventService = {
  async getAllEvents(): Promise<IEventsListResponse> {
    try {
      const response = await axiosRequestor.get<IEventsListResponse>("/events")
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getEventById(eventId: string): Promise<IEventResponse> {
    try {
      const response = await axiosRequestor.get<IEventResponse>(`/events/${eventId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createEvent(payload: IEventCreatePayload): Promise<IEventResponse> {
    try {
      const response = await axiosRequestor.post<IEventResponse>("/events", payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateEvent(eventId: string, payload: Partial<IEventCreatePayload>): Promise<IEventResponse> {
    try {
      const response = await axiosRequestor.patch<IEventResponse>(`/events/${eventId}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await axiosRequestor.delete(`/events/${eventId}`)
    } catch (error) {
      throw error
    }
  },

  async markInterest(eventId: string): Promise<void> {
    try {
      await axiosRequestor.post(`/events/${eventId}/interest`)
    } catch (error) {
      throw error
    }
  },

  async unmarkInterest(eventId: string): Promise<void> {
    try {
      await axiosRequestor.delete(`/events/${eventId}/interest`)
    } catch (error) {
      throw error
    }
  },
}
