import { axiosClient } from "../axios-client"
import type { IProfileViewResponse } from "@radar/types"

export const profileViewService = {
  async getProfileViews(): Promise<IProfileViewResponse[]> {
    const response = await axiosClient.get("/profile/views")
    return response.data.data
  },

  async registerProfileView(viewedId: string): Promise<IProfileViewResponse> {
    const response = await axiosClient.post("/profile/views", {
      viewedId,
    })
    return response.data.data
  },
}
