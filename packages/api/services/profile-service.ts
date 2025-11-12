import { axiosClient } from "../axios-client"
import type { IProfile, IProfileResponse, IDeleteProfileResponse } from "@radar/types"

export const profileService = {
  async getMyProfile(): Promise<IProfileResponse> {
    const response = await axiosClient.get<IProfileResponse>("/profiles")
    return response.data
  },

  async createMyProfile(data: IProfile): Promise<IProfileResponse> {
    const response = await axiosClient.post<IProfileResponse>("/profiles", data)
    return response.data
  },

  async updateMyProfile(data: IProfile): Promise<IProfileResponse> {
    const response = await axiosClient.patch<IProfileResponse>("/profiles", data)
    return response.data
  },

  async deleteMyProfile(): Promise<IDeleteProfileResponse> {
    const response = await axiosClient.delete<IDeleteProfileResponse>("/profiles")
    return response.data
  },
}
