import { axiosRequestor } from "../../../lib/api/axios-client"
import type { IProfile, IProfileResponse, IDeleteProfileResponse, IUser, UpdateProfileApi, UpdateProfileResponse } from "@radar/types"

function updateMyProfile(data: { Profile: { photoUrl: string | null }; User?: never }): Promise<void>
function updateMyProfile(data: Partial<UpdateProfileApi>): Promise<UpdateProfileResponse>
async function updateMyProfile(data: Partial<UpdateProfileApi>): Promise<UpdateProfileResponse | void> {
  if (
    data.Profile &&
    Object.keys(data).length === 1 &&
    Object.keys(data.Profile).length === 1 &&
    "photoUrl" in data.Profile
  ) {
    return
  }

  const response = await axiosRequestor.patch<UpdateProfileResponse>("/profile", data)
  return response.data
}

export const profileService = {
  async getMyProfile(): Promise<IProfileResponse> {
    const response = await axiosRequestor.get("/profile")
    return response.data.data
  },

  async createMyProfile(data: IProfile): Promise<IProfileResponse> {
    const response = await axiosRequestor.post<IProfileResponse>("/profile", data)
    return response.data
  },

  updateMyProfile,

  async deleteMyProfile(): Promise<IDeleteProfileResponse> {
    const response = await axiosRequestor.delete<IDeleteProfileResponse>("/profile")
    return response.data
  },
}
