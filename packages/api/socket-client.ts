import { io, type Socket } from "socket.io-client"
import { API_BASE_URL } from "@radar/config"
import type { SocketEvents } from "@radar/types"

let socket: Socket | null = null

export const initializeSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket
  }

  socket = io(API_BASE_URL.replace("/api", ""), {
    auth: { token },
    transports: ["websocket"],
  })

  socket.on("connect", () => {
    console.log("[v0] Socket connected:", socket?.id)
  })

  socket.on("disconnect", () => {
    console.log("[v0] Socket disconnected")
  })

  socket.on("connect_error", (error) => {
    console.error("[v0] Socket connection error:", error)
  })

  return socket
}

export const getSocket = (): Socket | null => {
  return socket
}

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Type-safe socket event emitters
export const emitSocketEvent = <K extends keyof SocketEvents>(event: K, data: SocketEvents[K]): void => {
  if (socket?.connected) {
    socket.emit(event, data)
  } else {
    console.warn("[v0] Socket not connected, cannot emit event:", event)
  }
}

// Type-safe socket event listeners
export const onSocketEvent = <K extends keyof SocketEvents>(
  event: K,
  callback: (data: SocketEvents[K]) => void,
): void => {
  socket?.on(event as string, callback)
}

export const offSocketEvent = <K extends keyof SocketEvents>(
  event: K,
  callback?: (data: SocketEvents[K]) => void,
): void => {
  if (callback) {
    socket?.off(event as string, callback)
  } else {
    socket?.off(event as string)
  }
}
