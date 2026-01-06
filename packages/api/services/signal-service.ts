import { IRadarSignal } from "@radar/types";
import { axiosRequestor } from "../../../lib/api/axios-client"

export interface SendSignalInput {
  note?: string
}

export const signalService = {
  async sendSignal(note?: string): Promise<IRadarSignal> {
    const response = await axiosRequestor.post("/signals/send", { note })
    return response.data
  },
  async getSignalById(signalId: string): Promise<IRadarSignal> {
    const response = await axiosRequestor.get(`/signals/${signalId}`)
    return response.data.data
  },
}
