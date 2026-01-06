import { axiosRequestor } from "../../../lib/api/axios-client"
import type { IProfileViewResponse } from "@radar/types"

export const profileViewService = {
  async getProfileViews(): Promise<IProfileViewResponse[]> {
    const response = await axiosRequestor.get("/profile/views")
    return response.data.data
  },

  async registerProfileView(viewedId: string): Promise<IProfileViewResponse> {
    const response = await axiosRequestor.post("/profile/views", {
      viewedId,
    })
    return response.data.data
  },
}
