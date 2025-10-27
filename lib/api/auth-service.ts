import { axiosClient } from "./axios-client"
import type { AuthResponse, User, Profile } from "../types/user"
import type { LoginInput, RegisterInput } from "../validations/auth"

export const authService = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>("/auth/register", {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    })
    return response.data
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>("/auth/login", data)
    return response.data
  },

  async getCurrentUser(): Promise<{ user: User; profile?: Profile }> {
    const response = await axiosClient.get("/users/me")
    return response.data
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const response = await axiosClient.put("/users/update", data)
    return response.data
  },
}
