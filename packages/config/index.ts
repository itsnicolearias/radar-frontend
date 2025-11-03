export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.radarapp.com/api"

export const THEME = {
  colors: {
    primary: "#00FFB3", // Neon green
    secondary: "#FF4FD8", // Neon pink for events
    accent: "#14B8A6", // Teal
    background: "#0E2A3E", // Dark blue background
    backgroundDark: "#0A1628", // Darker blue
    foreground: "#F8FAFC", // White text
    muted: "#5A6E7A", // Muted blue-gray
    success: "#00FFB3",
    danger: "#FF4FD8",
    warning: "#FFA500",
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  },
  shadows: {
    neonGreen: "0 0 20px rgba(0, 255, 179, 0.5)",
    neonPink: "0 0 20px rgba(255, 79, 216, 0.5)",
  },
} as const

export const ROUTES = {
  welcome: "/",
  login: "/login",
  register: "/register",
  radar: "/radar",
  profile: "/profile",
  chats: "/chats",
  connections: "/connections",
  events: "/events",
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: "radar_auth_token",
  USER_DATA: "radar_user_data",
} as const
