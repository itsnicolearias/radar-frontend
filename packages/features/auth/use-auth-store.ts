import { create } from "zustand"
import type { IUser, IProfile } from "@radar/types"
import { userService } from "@radar/api"

interface AuthState {
  user: Partial<IUser> | null
  profile: IProfile | null
  token: string | null
  isAuthenticated: boolean
  isVisible: boolean
  rehydrate: () => Promise<void>
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
  rehydrate: async () => {
    try {
      if (!globalThis.localStorage) return
      const token = globalThis.localStorage.getItem("radar_token")
      if (!token) {
        set({ user: null, profile: null, token: null, isAuthenticated: false })
        return
      }

      // Try to fetch profile which includes the User
      const { profileService } = await import("@radar/api")
      const response = await profileService.getMyProfile()

      // profileService.getMyProfile returns IProfileResponse which contains User
      // set auth with returned User and profile
      set({ user: response.User ?? null, profile: response, token, isAuthenticated: true })
    } catch (error) {
      try {
        if (globalThis.localStorage) globalThis.localStorage.removeItem("radar_token")
      } catch (e) {
        // ignore
      }
      set({ user: null, profile: null, token: null, isAuthenticated: false })
    }
  },
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

// Listen for global logout events (dispatched by axios interceptors)
import { onLogout } from "../../common/event-bus"

if (typeof globalThis !== "undefined") {
  // Register cross-platform logout listener
  onLogout(() => {
    try {
      if (globalThis.localStorage) globalThis.localStorage.removeItem("radar_token")
    } catch (e) {
      // ignore
    }
    const store = useAuthStore.getState()
    store.logout()
  })
}
