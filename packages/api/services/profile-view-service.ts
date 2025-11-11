import { axiosClient } from "../axios-client"
import type { IProfileView, IProfileViewResponse } from "@radar/types"

export const profileViewService = {
  async getProfileViews(): Promise<IProfileView[]> {
    try {
      const response = await axiosClient.get("/profile/views")

      return response.data.data
    } catch (error) {
      console.error("[v0] Error fetching profile views:", error)
      throw error
    }
  },

  async registerProfileView(viewedId: string): Promise<IProfileView> {
    try {
      const response = await axiosClient.post("/profile/views", { viewedId })
      return response.data.data
    } catch (error) {
      console.error("[v0] Error registering profile view:", error)
      throw error
    }
  },
}
