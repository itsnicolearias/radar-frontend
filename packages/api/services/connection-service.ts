import { axiosClient } from "../axios-client"
import type { IConnectionResponse, IDeleteConnectionResponse } from "@radar/types"

export const connectionService = {
  async getAcceptedConnections(): Promise<IConnectionResponse[]> {
    const response = await axiosClient.get<IConnectionResponse[]>("/connections/accepted")
    return response.data
  },

  async getPendingConnections(): Promise<IConnectionResponse[]> {
    const response = await axiosClient.get<IConnectionResponse[]>("/connections/pendings")
    return response.data
  },

  async createConnection(receiverId: string): Promise<IConnectionResponse> {
    const response = await axiosClient.post<IConnectionResponse>("/connections", {
      receiverId,
    })
    return response.data
  },

  async updateConnection(
    connectionId: string,
    status: "ACCEPTED" | "REJECTED",
  ): Promise<IConnectionResponse> {
    const response = await axiosClient.patch<IConnectionResponse>(`/connections/${connectionId}`, {
      status,
    })
    return response.data
  },

  async deleteConnection(connectionId: string): Promise<IDeleteConnectionResponse> {
    const response = await axiosClient.delete<IDeleteConnectionResponse>(
      `/connections/${connectionId}`,
    )
    return response.data
  },
}
