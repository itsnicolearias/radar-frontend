"use client"

import { useState } from "react"
import { Button, GradientBackground, Input, Label, Textarea } from "@radar/ui"
import { useAuthStore } from "@radar/features"
import { ArrowLeft, Camera } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const { user, profile } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <GradientBackground>
      <div className="relative z-10 min-h-screen px-6 py-8 text-white">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/radar"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al Radar</span>
          </Link>

          <Button
            variant="link"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[#00FFB3] hover:text-[#00FFB3]/80"
          >
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto space-y-8"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-2 border-[#00FFB3]/50 p-1">
                <img
                  src={profile?.photoUrl || `https://avatar.vercel.sh/${user?.email}.png`}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {isEditing && (
                <Button
                  variant="icon"
                  size="icon"
                  className="absolute bottom-0 right-0"
                >
                  <Camera className="w-5 h-5" />
                </Button>
              )}
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-white/50">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-6 bg-[#1A1A1A]/50 backdrop-blur-lg rounded-2xl p-6 border border-[#00FFB3]/20">
            <div className="space-y-2">
              <Label htmlFor="bio">Tu biografía</Label>
              <Textarea
                id="bio"
                placeholder="Ej: Buscando conectar con gente con buena energía."
                value={profile?.bio || ""}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input id="age" type="number" placeholder="28" value={profile?.age || ""} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input id="country" placeholder="Argentina" value={profile?.country || ""} disabled={!isEditing} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Ciudad</Label>
              <Input id="province" placeholder="Capital Federal" value={profile?.province || ""} disabled={!isEditing} />
            </div>

            {isEditing && (
              <Button className="w-full">
                Guardar Cambios
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </GradientBackground>
  )
}
