import { create } from "zustand"
import type { IUser, IProfile } from "@radar/types"
import { userService } from "@radar/api"

interface AuthState {
  user: Partial<IUser> | null
  profile: IProfile | null
  token: string | null
  isAuthenticated: boolean
  isVisible: boolean
  setAuth: (user: Partial<IUser>, profile: IProfile | null, token: string) => void
  setProfile: (profile: IProfile) => void
  setUser: (user: IUser) => void
  toggleVisibility: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  token: null,
  isAuthenticated: false,
  isVisible: true,
  setAuth: (user, profile, token) => {
    if (globalThis.localStorage) {
      globalThis.localStorage.setItem("radar_token", token)
    }
    set({ user, profile, token, isAuthenticated: true, isVisible: user.isVisible ?? true })
  },
  setProfile: (profile) => set({ profile }),
  setUser: (user) => set({ user }),
  toggleVisibility: async () => {
    const currentVisibility = get().isVisible
    const newVisibility = !currentVisibility

    set({ isVisible: newVisibility })

    try {
      await userService.toggleVisibility({ isVisible: newVisibility })
      set((state) => ({
        user: state.user ? { ...state.user, isVisible: newVisibility } : null,
      }))
    } catch (error) {
      console.error("Error toggling visibility:", error)
      set({ isVisible: currentVisibility })
    }
  },
  logout: () => {
    if (globalThis.localStorage) {
      globalThis.localStorage.removeItem("radar_token")
    }
    set({ user: null, profile: null, token: null, isAuthenticated: false })
  },
}))
