import { axiosRequestor } from "../../../lib/api/axios-client"
import type { IProfile, IProfileResponse, IDeleteProfileResponse, IUser, UpdateProfileApi, UpdateProfileResponse } from "@radar/types"

export const profileService = {
  async getMyProfile(): Promise<IProfileResponse> {
    const response = await axiosRequestor.get("/profile")
    return response.data.data
  },

  async createMyProfile(data: IProfile): Promise<IProfileResponse> {
    const response = await axiosRequestor.post<IProfileResponse>("/profile", data)
    return response.data
  },

  async updateMyProfile(data: Partial<UpdateProfileApi>) {
    const response = await axiosRequestor.patch<UpdateProfileResponse>("/profile", data)
    return response.data
  },

  async deleteMyProfile(): Promise<IDeleteProfileResponse> {
    const response = await axiosRequestor.delete<IDeleteProfileResponse>("/profile")
    return response.data
  },
}
