export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.radarapp.com/api"

export const THEME = {
  colors: {
    primary: "#14B8A6",
    accent: "#06B6D4",
    background: "#0A1628",
    foreground: "#F8FAFC",
    muted: "#64748B",
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
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
} as const
