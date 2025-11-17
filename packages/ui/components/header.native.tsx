"use client"

import { View, Text, Image } from "react-native"
import { Button } from "@radar/ui"
import { useRouter } from "expo-router"
import { useAuthStore } from "@radar/features"
import { cn } from "@radar/ui/lib/utils"

export function Header() {
  const router = useRouter()
  const { user } = useAuthStore()

  return (
    <View
      className={cn(
        "bg-background/80 p-6 border-b border-primary/20 flex flex-row items-center justify-between",
        "sticky top-0 z-50",
      )}
    >
      <Text className="text-2xl font-bold text-primary">Radar</Text>
      <Button variant="icon" size="icon" onPress={() => router.push("/profile")}>
        <Image
          source={{ uri: `https://avatar.vercel.sh/${user?.email}.png` }}
          className="w-full h-full rounded-full"
        />
      </Button>
    </View>
  )
}
