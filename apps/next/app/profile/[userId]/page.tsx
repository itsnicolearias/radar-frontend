"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ProfileCard } from "@radar/ui"
import { useConnectionStore, useAuthStore } from "@radar/features"
import { connectionService } from "@radar/api"
import type { NearbyUser } from "@radar/types"

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string

  const { user } = useAuthStore()
  const { connections } = useConnectionStore()
  const [profileData, setProfileData] = useState<NearbyUser | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const connected = connections.some((c) => c.receiverId === userId || c.senderId === userId)
    setIsConnected(connected)
  }, [connections, userId])

  useEffect(() => {
    // TODO: Fetch user profile from API
    setProfileData({
      user: {
        userId,
        firstName: "Ana",
        lastName: "García",
        email: "ana@example.com",
        isVerified: true,
        invisibleMode: false,
        lastLatitude: -34.6037,
        lastLongitude: -58.3816,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      profile: {
        profileId: "1",
        userId,
        bio: "Me encanta explorar cafés nuevos, descubrir música indie y correr por los parques de la ciudad.",
        age: 26,
        country: "Argentina",
        province: "Buenos Aires, Palermo",
        interests: ["Música", "Café", "Arte", "Running", "Fotografía", "Viajes"],
        showAge: true,
        showLocation: true,
        distanceRadius: 1000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      distance: 120,
    })
  }, [userId])

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await connectionService.sendConnectionRequest(userId)
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
      <div className="min-h-screen bg-[#0E2A3E] flex items-center justify-center">
        <p className="text-white">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0E2A3E] pb-20">
      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 px-6 py-4 pt-12">
        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">Perfil</h1>
      </header>

      {/* Profile Card */}
      <div className="px-6 py-8">
        <ProfileCard
          name={`${profileData.user.firstName} ${profileData.user.lastName}`}
          age={profileData.profile.age}
          location={profileData.profile.province}
          distance={profileData.distance}
          bio={profileData.profile.bio}
          interests={profileData.profile.interests}
          isConnected={isConnected}
          onConnect={handleConnect}
          onMessage={handleMessage}
        />
      </div>
    </div>
  )
}
