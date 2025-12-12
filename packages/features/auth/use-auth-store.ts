import { create } from "zustand"
import type { IUser, IProfile } from "@radar/types"
import { userService } from "@radar/api"

// helpers de storage (lazy require para no romper web bundle)
let SecureStore: any = null
try {
  SecureStore = require("expo-secure-store")
} catch (e) {
  SecureStore = null
}

const TOKEN_KEY = "radar_token"

async function saveToken(token: string | null) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      if (token === null) {
        window.localStorage.removeItem(TOKEN_KEY)
      } else {
        window.localStorage.setItem(TOKEN_KEY, token)
      }
      return
    }

    if (SecureStore && SecureStore.setItemAsync) {
      if (token === null) {
        await SecureStore.deleteItemAsync(TOKEN_KEY)
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token)
      }
      return
    }
  } catch (e) {
    // no queremos romper la app por un fallo de storage en dev
    // pero lo logeamos para debuggueo
    console.warn("saveToken error", e)
  }
}

async function getToken(): Promise<string | null> {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(TOKEN_KEY)
    }
    if (SecureStore && SecureStore.getItemAsync) {
      const t = await SecureStore.getItemAsync(TOKEN_KEY)
      return t
    }
  } catch (e) {
    // ignore
  }
  return null
}

async function removeToken() {
  await saveToken(null)
}

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
      const token = await getToken()
      if (!token) {
        set({ user: null, profile: null, token: null, isAuthenticated: false })
        return
      }

      const { profileService } = await import("@radar/api")
      const response = await profileService.getMyProfile()

      set({
        user: (response?.User as Partial<IUser>) ?? null,
        profile: (response as unknown as IProfile) ?? null,
        token,
        isAuthenticated: true,
        isVisible: (response?.User?.isVisible ?? true),
      })
    } catch (error) {
      try {
        await removeToken()
      } catch (e) {
        // ignore
      }
      set({ user: null, profile: null, token: null, isAuthenticated: false })
    }
  },
  setAuth: (user, profile, token) => {
    // guardamos token de forma asíncrona (fire-and-forget) para no romper callers
    saveToken(token).catch(() => {
      /* noop */
    })
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
    // limpieza local (fire-and-forget)
    removeToken().catch(() => {
      /* noop */
    })
    set({ user: null, profile: null, token: null, isAuthenticated: false })
  },
}))

// Listen for global logout events (dispatched por axios interceptors)
import { onLogout } from "../../common/event-bus"

if (typeof globalThis !== "undefined") {
  onLogout(() => {
    try {
      // quitamos token y limpiamos store
      removeToken().catch(() => {
        /* noop */
      })
    } catch (e) {
      // ignore
    }
    const store = useAuthStore.getState()
    store.logout()
  })
}
