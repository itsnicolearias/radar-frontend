import { axiosClient } from "./axios-client"
import type { IAuthResponse, IUserResponse } from "@radar/types"

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}

export const authService = {
  async register(data: RegisterInput): Promise<IAuthResponse> {
    const response = await axiosClient.post<IAuthResponse>("/auth/register", data)
    return response.data
  },

  async login(data: LoginInput): Promise<IAuthResponse> {
    const response = await axiosClient.post<IAuthResponse>("/auth/login", data)
    return response.data
  },

  async getCurrentUser(): Promise<IUserResponse> {
    const response = await axiosClient.get<IUserResponse>("/users")
    return response.data
  },
}
