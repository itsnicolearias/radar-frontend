import { axiosRequestor } from "../../../lib/api/axios-client"
import type { IRadarNearbyResponse } from "@radar/types"

export const radarService = {
  async getNearby(latitude: number, longitude: number, radius = 1000): Promise<IRadarNearbyResponse> {
    const response = await axiosRequestor.get("/radar/nearby", {
      params: { latitude, longitude, radius },
    })
    return response.data.data;
  },
}
