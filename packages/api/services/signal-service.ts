import { IRadarSignal } from "@radar/types";
import { axiosClient } from "../axios-client"

export interface SendSignalInput {
  note?: string
}

export const signalService = {
  async sendSignal(note?: string): Promise<IRadarSignal> {
    const response = await axiosClient.post("/signals/send", { note })
    return response.data.data
  },
  async getSignalById(signalId: string): Promise<IRadarSignal> {
    const response = await axiosClient.get(`/signals/${signalId}`)
    return response.data.data
  },
}
