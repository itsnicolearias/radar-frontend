// src/lib/axiosClient.ts
import axios from "axios"
import { emitLogout } from "../../packages/common/event-bus"

// Storage helpers
let SecureStore: any = null

try {
  SecureStore = require("expo-secure-store")
} catch (e) {
  SecureStore = null
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const axiosRequestor = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    'ngrok-skip-browser-warning': 'true'
  },
})

// helper: get token from the best available storage
async function getToken(): Promise<string | null> {
  // 1) if running on web and localStorage is available — use it
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage.getItem("radar_token")
  }

  // 2) if SecureStore is available (expo) prefer it
  if (SecureStore && SecureStore.getItemAsync) {
    try {
      const t = await SecureStore.getItemAsync("radar_token")
      return t
    } catch (e) {
      // fallback
    }
  }

  return null
}

async function removeToken(): Promise<void> {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("radar_token")
      return
    }
    if (SecureStore && SecureStore.deleteItemAsync) {
      await SecureStore.deleteItemAsync("radar_token")
      return
    }
  } catch (e) {
    // ignore
  }
}

// Request interceptor - supports async token retrieval
axiosRequestor.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      // ignore token retrieval errors
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
axiosRequestor.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      try {
        await removeToken()
      } catch (e) {
        // ignore
      }
      emitLogout()
    }
    return Promise.reject(error)
  },
)

export default axiosRequestor
