import { axiosClient } from "../axios-client"
import type { IRadarResponse, NearbyUser, User } from "@radar/types"

export interface UpdateLocationInput {
  latitude: number
  longitude: number
}

export interface NearbyUsersResponse {
  users: NearbyUser[]
}

export const radarService = {
  async getNearbyAll(latitude: number, longitude: number, radius: number = 1000) {
    const response = await axiosClient.get<IRadarResponse>("/radar/nearby", {
      params: { latitude, longitude, radius },
    })
    console.log({response})
    return response.data.data;
  },

  async updateLocation(data: UpdateLocationInput): Promise<void> {
    await axiosClient.patch("/users/location", data)
  },

  async toggleInvisibleMode(invisible: boolean): Promise<User> {
    const response = await axiosClient.patch<User>("/users/visibility", {
      invisible_mode: invisible,
    })
    return response.data
  },
}
