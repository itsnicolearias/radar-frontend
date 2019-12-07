import axios from "axios"
import { emitLogout } from "../../packages/common/event-bus"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add JWT token
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("radar_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
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
        if (typeof window !== "undefined") {
          localStorage.removeItem("radar_token")
        }
      } catch (e) {
        // ignore
      }
      emitLogout()
    }
    return Promise.reject(error)
  },
)
