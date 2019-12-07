import axios from "axios"
import { API_BASE_URL } from "@radar/config"
import { emitLogout } from "../common/event-bus"

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add JWT token
axiosClient.interceptors.request.use(
  (config) => {
    // Platform-specific token retrieval will be handled by features
    const token = globalThis.localStorage?.getItem("radar_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        globalThis.localStorage?.removeItem("radar_token")
      } catch (e) {
        // ignore
      }
      // emit a cross-platform logout event
      emitLogout()
    }
    return Promise.reject(error)
  },
)
