import { axiosRequestor } from "../../../lib/api/axios-client"
import type { IConnectionResponse, IDeleteConnectionResponse } from "@radar/types"

export const connectionService = {
  async getAcceptedConnections(): Promise<IConnectionResponse[]> {
    const response = await axiosRequestor.get("/connections/accepted")
    return response.data.data;
  },

  async getPendingConnections(): Promise<IConnectionResponse[]> {
    const response = await axiosRequestor.get("/connections/pendings")
    return response.data.data
  },

  async createConnection(receiverId: string): Promise<IConnectionResponse> {
    const response = await axiosRequestor.post("/connections", {
      receiverId,
    })
    return response.data.data
  },

  async updateConnection(
    connectionId: string,
    status: "accepted" | "rejected" ,
  ): Promise<IConnectionResponse> {
    const response = await axiosRequestor.patch<IConnectionResponse>(`/connections/${connectionId}`, {
      status,
    })
    return response.data
  },

  async deleteConnection(connectionId: string): Promise<IDeleteConnectionResponse> {
    const response = await axiosRequestor.delete<IDeleteConnectionResponse>(
      `/connections/${connectionId}`,
    )
    return response.data
  },
}
