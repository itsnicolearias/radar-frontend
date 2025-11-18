"use client"

import { useState } from "react"
import { Button, Input, Label, Textarea } from "@radar/ui"
import { useAuthStore } from "@radar/features"
import { ArrowLeft, Camera } from 'lucide-react'
import Link from "next/link"

export default function ProfilePage() {
  const { user, profile } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1DE3F2]/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/radar"
            className="inline-flex items-center gap-2 text-[#C5C5C5] hover:text-[#00FFB3] transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>

          <Button
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[#00FFB3] hover:text-[#1DE3F2] transition-colors"
          >
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile photo */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00FFB3] via-[#1DE3F2] to-[#197387] flex items-center justify-center shadow-lg shadow-[#00FFB3]/50 border-2 border-[#00FFB3]/30">
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                )}
              </div>
              {isEditing && (
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full bg-[#00FFB3] hover:bg-[#1DE3F2] transition-all shadow-lg shadow-[#00FFB3]/30 text-black"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-[#C5C5C5]">{user?.email}</p>
            </div>
          </div>

          {/* Profile form */}
          <div className="space-y-6 bg-[#0a0e27] backdrop-blur-lg rounded-2xl p-6 border border-[#1DE3F2]/20">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-white">Nombre visible</Label>
              <Textarea
                id="displayName"
                placeholder="Nombre visible para todos los usuarios en el radar"
                value={user.displayName|| ""}
                disabled={!isEditing}
                className="min-h-24 bg-[#1A1A1A] border border-[#1DE3F2]/30 rounded-2xl text-white placeholder-[#C5C5C5]/40 focus:border-[#00FFB3] focus:outline-none transition-all disabled:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">Nombre</Label>
              <Textarea
                id="firstName"
                placeholder="Tu nombre"
                value={user.firstName || ""}
                disabled={!isEditing}
                className="min-h-24 bg-[#1A1A1A] border border-[#1DE3F2]/30 rounded-2xl text-white placeholder-[#C5C5C5]/40 focus:border-[#00FFB3] focus:outline-none transition-all disabled:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">Apellido</Label>
              <Textarea
                id="bio"
                placeholder="Tu apellido"
                value={user.lastName || ""}
                disabled={!isEditing}
                className="min-h-24 bg-[#1A1A1A] border border-[#1DE3F2]/30 rounded-2xl text-white placeholder-[#C5C5C5]/40 focus:border-[#00FFB3] focus:outline-none transition-all disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Biografía</Label>
              <Textarea
                id="bio"
                placeholder="Contanos sobre vos..."
                value={profile?.bio || ""}
                disabled={!isEditing}
                className="min-h-24 bg-[#1A1A1A] border border-[#1DE3F2]/30 rounded-2xl text-white placeholder-[#C5C5C5]/40 focus:border-[#00FFB3] focus:outline-none transition-all disabled:opacity-60"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-white">Edad</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="25" 
                  value={profile?.age || ""} 
                  disabled={!isEditing}
                  className="bg-[#1A1A1A] border border-[#1DE3F2]/30 rounded-2xl text-white placeholder-[#C5C5C5]/40 focus:border-[#00FFB3] focus:outline-none transition-all disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-white">País</Label>
                <Input 
                  id="country" 
                  placeholder="Argentina" 
                  value={profile?.country || ""} 
                  disabled={!isEditing}
                  className="bg-[#1A1A1A] border border-[#1DE3F2]/30 rounded-2xl text-white placeholder-[#C5C5C5]/40 focus:border-[#00FFB3] focus:outline-none transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="province" className="text-white">Provincia</Label>
              <Input 
                id="province" 
                placeholder="Buenos Aires" 
                value={profile?.province || ""} 
                disabled={!isEditing}
                className="bg-[#1A1A1A] border border-[#1DE3F2]/30 rounded-2xl text-white placeholder-[#C5C5C5]/40 focus:border-[#00FFB3] focus:outline-none transition-all disabled:opacity-60"
              />
            </div>

            {isEditing && (
              <Button 
                className="w-full h-12 bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-semibold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-[#00FFB3]/50 active:scale-95"
              >
                Guardar cambios
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
