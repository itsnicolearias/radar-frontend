import { axiosClient } from "../axios-client"
import type { IProfileViewResponse } from "@radar/types"

// NOTE: Rename this file to profile-view-service.ts (dot, not comma) for proper imports.
export const profileViewService = {
  async getProfileViews(): Promise<IProfileViewResponse[]> {
    try {
      const response = await axiosClient.get<IProfileViewResponse[]>("/profile-views")
      return response.data
    } catch (error) {
      console.error("[v0] Error fetching profile views:", error)
      throw error
    }
  },

  async registerProfileView(viewedId: string): Promise<IProfileViewResponse> {
    try {
      const response = await axiosClient.post<IProfileViewResponse>("/profile-views/view", { viewedId })
      return response.data
    } catch (error) {
      console.error("[v0] Error registering profile view:", error)
      throw error
    }
  },
}
