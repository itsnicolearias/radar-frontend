"use client"

import type React from "react"

import { Settings } from "lucide-react"
import { SimpleAvatar } from "./prototype/SimpleAvatar"
import { uploadService } from "@radar/api"
import { useState } from "react"

export default function AvatarBlock({
  src,
  initials,
  onUpload,
}: {
  src?: string
  initials: string
  onUpload?: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const fileName = `profile-${Date.now()}.${file.name.split(".").pop()}`
      const fileUrl = await uploadService.uploadImage(file, fileName)

      if (fileUrl) {
        onUpload?.(fileUrl)
      }
    } catch (error) {
      console.error("[v0] Error uploading image:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center animate-scale-in">
      <div className="relative">
        <SimpleAvatar src={src} alt={initials} fallback={initials} className="w-24 h-24 border-4 border-[#00FFB3]/50" />

        <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#1A1A1A] border border-[#00FFB3]/30 rounded-full flex items-center justify-center shadow-lg">
          <Settings className="w-4 h-4 text-white" />
        </button>
      </div>

      <label className="mt-3 text-[#00FFB3]/70 text-sm hover:text-[#00FFB3] transition-colors cursor-pointer">
        {uploading ? "Subiendo..." : "Cambiar foto de perfil"}
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
      </label>
    </div>
  )
}
