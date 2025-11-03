"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import type { Socket } from "socket.io-client"
import { initializeSocket, disconnectSocket } from "@radar/api"
import { useAuthStore } from "../auth/use-auth-store"

export const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (isAuthenticated && token) {
      socketRef.current = initializeSocket(token)
    }

    return () => {
      if (!isAuthenticated) {
        disconnectSocket()
        socketRef.current = null
      }
    }
  }, [isAuthenticated, token])

  return socketRef.current
}

export const useSocketEvent = <T,>(event: string, callback: (data: T) => void, deps: React.DependencyList = []) => {
  const socket = useSocket()

  useEffect(() => {
    if (!socket) return

    socket.on(event, callback)

    return () => {
      socket.off(event, callback)
    }
  }, [socket, event, ...deps])
}
