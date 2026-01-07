import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { IConnectionResponse } from "@radar/types"

interface ConnectionState {
  connections: IConnectionResponse[]
  pendingRequests: IConnectionResponse[]
  isLoading: boolean
  localConnectionStates: Record<string, "pending" | "connected" | null>
  setConnections: (connections: IConnectionResponse[]) => void
  setPendingRequests: (requests: IConnectionResponse[]) => void
  addConnection: (connection: IConnectionResponse) => void
  updateConnection: (connectionId: string, status: "accepted" | "rejected") => void
  removeConnection: (connectionId: string) => void
  setLoading: (loading: boolean) => void
  setLocalConnectionState: (userId: string, state: "pending" | "connected" | null) => void
  getLocalConnectionState: (userId: string) => "pending" | "connected" | null
  reset: () => void
}

export const useConnectionStore = create<ConnectionState>()(
  immer((set, get) => ({
    connections: [],
    pendingRequests: [],
    isLoading: false,
    localConnectionStates: {},
    setConnections: (connections) =>
      set((state) => {
        state.connections = connections
      }),
    setPendingRequests: (requests) =>
      set((state) => {
        state.pendingRequests = requests
      }),
    addConnection: (connection) =>
      set((state) => {
        if (connection.status === "pending") {
          state.pendingRequests.push(connection)
        } else if (connection.status === "accepted") {
          state.connections.push(connection)
        }
      }),
    updateConnection: (connectionId, status) =>
      set((state) => {
        const request = state.pendingRequests.find((r) => r.connectionId === connectionId)
        if (request) {
          request.status = status
          if (status === "accepted") {
            state.connections.push(request)
            state.pendingRequests = state.pendingRequests.filter((r) => r.connectionId !== connectionId)
          } else if (status === "rejected") {
            state.pendingRequests = state.pendingRequests.filter((r) => r.connectionId !== connectionId)
          }
        }
      }),
    removeConnection: (connectionId) =>
      set((state) => {
        state.connections = state.connections.filter((c) => c.connectionId !== connectionId)
        state.pendingRequests = state.pendingRequests.filter((r) => r.connectionId !== connectionId)
      }),
    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),
    setLocalConnectionState: (userId, state) =>
      set((draft) => {
        if (state === null) {
          delete draft.localConnectionStates[userId]
        } else {
          draft.localConnectionStates[userId] = state
        }
      }),
    getLocalConnectionState: (userId) => {
      return get().localConnectionStates[userId] || null
    },
    reset: () =>
      set((state) => {
        state.connections = []
        state.pendingRequests = []
        state.isLoading = false
        state.localConnectionStates = {}
      }),
  })),
)
