import { axiosClient } from "../axios-client"
import type { ISignalResponse } from "@radar/types"

export interface SendSignalInput {
  note?: string
}

export const signalService = {
  async sendSignal(data: SendSignalInput): Promise<ISignalResponse> {
    const response = await axiosClient.post<ISignalResponse>("/signals/send", data)
    return response.data
  },
}
