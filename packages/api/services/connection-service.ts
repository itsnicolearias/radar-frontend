import { axiosClient } from "../axios-client"
import type { IConnectionResponse, IDeleteConnectionResponse } from "@radar/types"

export const connectionService = {
  async getAcceptedConnections(): Promise<IConnectionResponse[]> {
    const response = await axiosClient.get("/connections/accepted")
    return response.data.data;
  },

  async getPendingConnections(): Promise<IConnectionResponse[]> {
    const response = await axiosClient.get("/connections/pendings")
    return response.data.data
  },

  async createConnection(receiverId: string): Promise<IConnectionResponse> {
    const response = await axiosClient.post("/connections", {
      receiverId,
    })
    return response.data.data
  },

  async updateConnection(
    connectionId: string,
    status: "accepted" | "rejected" ,
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
