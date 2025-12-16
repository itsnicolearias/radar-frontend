import { axiosClient } from "../axios-client"
import type {
  IUpdateLocationResponse,
  IToggleVisibilityResponse,
  IUpdateUserResponse,
  IUser,
} from "@radar/types"

export interface UpdateLocationInput {
  latitude: number
  longitude: number
}

export interface ToggleVisibilityInput {
  isVisible: boolean
}

export const userService = {
  async updateUser(data: IUser): Promise<IUpdateUserResponse> {
    const response = await axiosClient.patch("/users", data)
    return response.data.data
  },

  async updateLocation(data: UpdateLocationInput): Promise<IUpdateLocationResponse> {
    const response = await axiosClient.patch("/users/location", data)
    return response.data.data
  },

  async toggleVisibility(data: ToggleVisibilityInput): Promise<IToggleVisibilityResponse> {
    const response = await axiosClient.patch("/users/visibility", data)
    return response.data.data
  },
}
