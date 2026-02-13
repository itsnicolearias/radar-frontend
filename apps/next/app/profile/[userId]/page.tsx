"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { ProfileCard } from "@radar/ui";
import { useConnectionStore, useAuthStore, useRadarStore } from "@radar/features";
import { connectionService, profileViewService } from "@radar/api";
import type { IRadarUser } from "@radar/types";

export default function UserProfilePage() {
  const t = useTranslations("profilePage.userProfile");
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const { user } = useAuthStore();
  const { connections, getLocalConnectionState, myPendingRequests } = useConnectionStore();
  const { nearbyUsers } = useRadarStore();
  const [profileData, setProfileData] = useState<IRadarUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const localState = getLocalConnectionState(userId);

  useEffect(() => {
    const connected = connections.some((c) => c.receiverId === userId || c.senderId === userId);
    setIsConnected(connected);

    const pending = localState === "pending" || myPendingRequests.some((c) => c.receiverId === userId);
    setIsPending(pending);
  }, [connections, userId, localState, myPendingRequests]);

  useEffect(() => {
    const registerView = async () => {
      if (user && userId !== user.userId) {
        try {
          await profileViewService.registerProfileView(userId);
        } catch (error) {
          console.error("[profile-user] Error registering profile view:", error);
        }
      }
    };

    const findUser = () => {
      const targetUser = nearbyUsers.find((u) => u.userId === userId);
      if (targetUser) {
        setProfileData(targetUser);
      }
    };

    registerView();
    findUser();
  }, [userId, user, nearbyUsers]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connectionService.createConnection(userId);
    } catch (error) {
      console.error("[profile-user] Error sending connection request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConnection = async () => {
    setIsLoading(true);
    try {
      const connection = connections.find((c) => c.receiverId === userId || c.senderId === userId);
      if (!connection) return;
      await connectionService.deleteConnection(connection.connectionId);
    } catch (error) {
      console.error("[profile-user] Error deleting connection request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = () => {
    router.push(`/chats/${userId}`);
  };

  if (!profileData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="relative z-10 flex items-center gap-3 px-6 py-4 pt-12 border-b border-[#00FFB3]/20">
        <button onClick={() => router.back()} className="p-2 hover:bg-[#1A1A1A] rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">{t("title")}</h1>
      </header>

      <div className="px-6 py-8">
        <ProfileCard
          name={profileData.displayName!}
          age={profileData.Profile?.age!}
          location={`${profileData.Profile?.province}, ${profileData.Profile?.country}`}
          distance={profileData.distance}
          bio={profileData.Profile?.bio!}
          interests={profileData.Profile?.interests!}
          isConnected={isConnected}
          onConnect={handleConnect}
          onMessage={handleMessage}
          onDeleteConnection={handleDeleteConnection}
          showAge={profileData.Profile?.showAge}
          showLocation={profileData.Profile?.showLocation}
          isConnectionPending={isPending || isLoading}
          labels={{
            near: t("near"),
            interests: t("interests"),
            about: t("about"),
            connect: t("connect"),
            message: t("message"),
            remove: t("remove"),
          }}
        />
      </div>
    </div>
  );
}
