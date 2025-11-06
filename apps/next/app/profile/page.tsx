"use client"

import { useState } from "react"
import { Button, GradientBackground, Input, Label, Textarea } from "@radar/ui"
import { useAuthStore } from "@radar/features"
import { ArrowLeft, Camera } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, profile } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <GradientBackground>
      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/radar"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>

          <Button
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className="text-primary hover:text-primary/80"
          >
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile photo */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center">
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
                <Button size="icon" className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90">
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Profile form */}
          <div className="space-y-6 bg-card/50 backdrop-blur-lg rounded-lg p-6 border border-border">
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                placeholder="Contanos sobre vos..."
                value={profile?.bio || ""}
                disabled={!isEditing}
                className="min-h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input id="age" type="number" placeholder="25" value={profile?.age || ""} disabled={!isEditing} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input id="country" placeholder="Argentina" value={profile?.country || ""} disabled={!isEditing} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Provincia</Label>
              <Input id="province" placeholder="Buenos Aires" value={profile?.province || ""} disabled={!isEditing} />
            </div>

            {isEditing && (
              <Button className="w-full h-12 bg-linear-to-r from-primary to-accent hover:opacity-90">
                Guardar cambios
              </Button>
            )}
          </div>
        </div>
      </div>
    </GradientBackground>
  )
}
