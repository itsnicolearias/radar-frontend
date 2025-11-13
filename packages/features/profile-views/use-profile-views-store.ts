import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { IProfileView } from "@radar/types"

interface ProfileViewsState {
  profileViews: IProfileView[]
  isLoading: boolean
  error: string | null
  setProfileViews: (views: IProfileView[]) => void
  addProfileView: (view: IProfileView) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  profileViews: [],
  isLoading: false,
  error: null,
}

export const useProfileViewsStore = create<ProfileViewsState>()(
  immer((set) => ({
    ...initialState,

    setProfileViews: (views) =>
      set((state) => {
        state.profileViews = views
      }),

    addProfileView: (view) =>
      set((state) => {
        const exists = state.profileViews.some((v) => v.profileViewId === view.profileViewId)
        if (!exists) {
          state.profileViews.unshift(view)
        }
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),

    setError: (error) =>
      set((state) => {
        state.error = error
      }),

    reset: () => set(initialState),
  })),
)
