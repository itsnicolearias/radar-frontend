import { axiosClient } from "../axios-client"
import type { ISignalResponse } from "@radar/types"

export const signalService = {
  async sendSignal(note: string | null) {
    const response = await axiosClient.post<ISignalResponse>("/signals/send", {
      note,
    })
    return response.data.data
  },
}
