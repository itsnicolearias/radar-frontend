import axios from "axios"
import { API_BASE_URL } from "@radar/config"

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
      globalThis.localStorage?.removeItem("radar_token")
      // Navigation will be handled by features layer
    }
    return Promise.reject(error)
  },
)
