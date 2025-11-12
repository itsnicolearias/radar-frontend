import { axiosClient } from "../axios-client"
import type { IProfileViewResponse } from "@radar/types"

export const profileViewService = {
  async getProfileViews(): Promise<IProfileViewResponse[]> {
    const response = await axiosClient.get<IProfileViewResponse[]>("/profiles/views")
    return response.data
  },

  async registerProfileView(viewedId: string): Promise<IProfileViewResponse> {
    const response = await axiosClient.post<IProfileViewResponse>("/profiles/view", {
      viewedId,
    })
    return response.data
  },
}
