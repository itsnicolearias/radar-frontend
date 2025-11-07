import { create } from "zustand"
import type { User, Profile } from "@radar/types"

interface AuthState {
  user: Partial<User> | null
  profile: Profile | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: Partial<User>, profile: Profile | null, token: string) => void
  setProfile: (profile: Profile) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, profile, token) => {
    if (globalThis.localStorage) {
      globalThis.localStorage.setItem("radar_token", token)
    }
    set({ user, profile, token, isAuthenticated: true })
  },
  setProfile: (profile) => set({ profile }),
  logout: () => {
    if (globalThis.localStorage) {
      globalThis.localStorage.removeItem("radar_token")
    }
    set({ user: null, profile: null, token: null, isAuthenticated: false })
  },
}))
