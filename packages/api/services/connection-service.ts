import { axiosClient } from "../axios-client"
import type { Connection } from "@radar/types"

export interface ConnectionsResponse {
  data: Connection[]
}

export const connectionService = {
  async getConnections(status?: "pendings" | "accepted" | "rejected"): Promise<Connection[]> {
    const response = await axiosClient.get<ConnectionsResponse>(`/connections/${status}`, {
      //params: status ? { status } : undefined,
    })

    return response.data.data;
  },

  async sendConnectionRequest(receiverId: string): Promise<Connection> {
    const response = await axiosClient.post<Connection>("/connections", {
      receiver_id: receiverId,
    })
    return response.data
  },

  async updateConnectionStatus(connectionId: string, status: "accepted" | "rejected"): Promise<Connection> {
    const response = await axiosClient.patch<Connection>(`/connections/${connectionId}`, {
      status,
    })
    return response.data
  },

  async deleteConnection(connectionId: string): Promise<void> {
    await axiosClient.delete(`/connections/${connectionId}`)
  },
}
