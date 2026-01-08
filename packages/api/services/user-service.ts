import { axiosRequestor } from "../../../lib/api/axios-client"
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
    const response = await axiosRequestor.patch("/users", data)
    return response.data.data
  },

  async updateLocation(data: UpdateLocationInput): Promise<IUpdateLocationResponse> {
    const response = await axiosRequestor.patch("/users/location", data)
    return response.data.data
  },

  async toggleVisibility(data: ToggleVisibilityInput): Promise<IToggleVisibilityResponse> {
    const response = await axiosRequestor.patch("/users/visibility", data)
    return response.data.data
  },
}
