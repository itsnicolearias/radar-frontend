"use client"

import { Button } from "@radar/ui"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@radar/features"
import { cn } from "@radar/ui/lib/utils"

export function Header() {
  const router = useRouter()
  const { user } = useAuthStore()

  return (
    <header
      className={cn(
        "bg-background/80 backdrop-blur-lg p-6 border-b border-primary/20 flex items-center justify-between",
        "sticky top-0 z-50",
      )}
    >
      <h1 className="text-2xl font-bold text-primary">Radar</h1>
      <Button variant="icon" size="icon" onClick={() => router.push("/profile")}>
        <img
          src={`https://avatar.vercel.sh/${user?.email}.png`}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      </Button>
    </header>
  )
}
