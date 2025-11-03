import { axiosClient } from "../axios-client"
import type { NearbyUser, User } from "@radar/types"

export interface UpdateLocationInput {
  latitude: number
  longitude: number
}

export interface NearbyUsersResponse {
  users: NearbyUser[]
}

export const radarService = {
  async getNearbyUsers(latitude: number, longitude: number): Promise<NearbyUser[]> {
    const response = await axiosClient.get<NearbyUsersResponse>("/radar/nearby", {
      params: { latitude, longitude },
    })
    return response.data.users
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
