"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ProfileCard } from "@radar/ui"
import { useConnectionStore, useAuthStore, useRadarStore } from "@radar/features"
import { connectionService, profileViewService } from "@radar/api"
import type { IRadarUser } from "@radar/types"

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string

  const { user } = useAuthStore()
  const { connections } = useConnectionStore()
  const { nearbyUsers } = useRadarStore()
  const [profileData, setProfileData] = useState<IRadarUser | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const connected = connections.some((c) => c.receiverId === userId || c.senderId === userId)
    setIsConnected(connected)
  }, [connections, userId])

  useEffect(() => {
    const registerView = async () => {
      if (user && userId !== user.userId) {
        try {
          await profileViewService.registerProfileView(userId)
        } catch (error) {
          console.error("[v0] Error registering profile view:", error)
        }
      }
    }

    const findUser = () => {
      const user = nearbyUsers.find((u) => u.userId === userId)
      if (user) {
        setProfileData(user)
      }
    }

    registerView()
    findUser()
  }, [userId, user, nearbyUsers])

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await connectionService.createConnection(userId)
      alert("Solicitud de conexión enviada")
    } catch (error) {
      console.error("[v0] Error sending connection request:", error)
      alert("Error al enviar solicitud")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMessage = () => {
    router.push(`/chats/${userId}`)
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="relative z-10 flex items-center gap-3 px-6 py-4 pt-12 border-b border-[#00FFB3]/20">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-[#1A1A1A] rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">Perfil</h1>
      </header>

      {/* Profile Card */}
      <div className="px-6 py-8">
        <ProfileCard
          name={profileData.displayName!}
          age={profileData.Profile?.age!}
          distance={profileData.distance}
          bio={profileData.Profile?.bio!}
          interests={profileData.Profile?.interests!}
          isConnected={isConnected}
          onConnect={handleConnect}
          onMessage={handleMessage}
        />
      </div>
    </div>
  )
}
