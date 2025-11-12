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
    const response = await axiosClient.patch<IUpdateUserResponse>("/users", data)
    return response.data
  },

  async updateLocation(data: UpdateLocationInput): Promise<IUpdateLocationResponse> {
    const response = await axiosClient.patch<IUpdateLocationResponse>("/users/location", data)
    return response.data
  },

  async toggleVisibility(data: ToggleVisibilityInput): Promise<IToggleVisibilityResponse> {
    const response = await axiosClient.patch<IToggleVisibilityResponse>("/users/visibility", data)
    return response.data
  },
}
