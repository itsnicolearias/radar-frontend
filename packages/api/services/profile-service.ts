import { axiosClient } from "../axios-client"
import type { IProfile, IProfileResponse, IDeleteProfileResponse, IUser, UpdateProfileApi, UpdateProfileResponse } from "@radar/types"

export const profileService = {
  async getMyProfile(): Promise<IProfileResponse> {
    const response = await axiosClient.get<IProfileResponse>("/profile")
    return response.data
  },

  async createMyProfile(data: IProfile): Promise<IProfileResponse> {
    const response = await axiosClient.post<IProfileResponse>("/profile", data)
    return response.data
  },

  async updateMyProfile(data: Partial<UpdateProfileApi>) {
    const response = await axiosClient.patch<UpdateProfileResponse>("/profile", data)
    return response.data
  },

  async deleteMyProfile(): Promise<IDeleteProfileResponse> {
    const response = await axiosClient.delete<IDeleteProfileResponse>("/profile")
    return response.data
  },
}
