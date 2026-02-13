"use client";

import type React from "react";
import { MapPin, Heart, MessageCircle, HeartOff } from "lucide-react";
import { cn } from "../lib/utils";
import { formatDistance } from "../../../lib/utils/format-distance";

interface ProfileCardLabels {
  near: string;
  interests: string;
  about: string;
  connect: string;
  message: string;
  remove: string;
}

interface ProfileCardProps {
  name: string;
  onDeleteConnection: () => void;
  age?: number;
  location?: string;
  distance?: number;
  bio?: string;
  interests?: string[];
  photoUrl?: string;
  isConnected?: boolean;
  onConnect?: () => void;
  onMessage?: () => void;
  className?: string;
  showAge?: boolean;
  showLocation?: boolean;
  isConnectionPending?: boolean;
  labels?: ProfileCardLabels;
}

const defaultLabels: ProfileCardLabels = {
  near: "Cerca",
  interests: "Intereses",
  about: "Sobre mi",
  connect: "Conectar",
  message: "Enviar mensaje",
  remove: "Eliminar",
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  age,
  location,
  distance,
  bio,
  interests = [],
  isConnected = false,
  onConnect,
  onMessage,
  className,
  onDeleteConnection,
  showAge,
  showLocation,
  labels,
}) => {
  const t = labels ?? defaultLabels;

  return (
    <div className={cn("bg-[#1A3A52] rounded-3xl p-6 text-white shadow-xl", className)}>
      {distance !== undefined && (
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-[#00FFB3]" />
          <span className="text-sm text-[#00FFB3]">{formatDistance(distance)}</span>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-1">
          {name}
          {showAge ? `, ${age}` : ""}
        </h2>
        {showLocation && location ? (
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <MapPin className="w-4 h-4" />
            <span>{t.near}</span>
          </div>
        )}
      </div>

      {interests.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">{t.interests}</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span key={index} className="px-3 py-1 bg-white text-[#1A3A52] rounded-full text-sm font-medium">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {bio && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">{t.about}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{bio}</p>
        </div>
      )}

      <div className="flex gap-3">
        {!isConnected && onConnect && (
          <button
            onClick={onConnect}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-[#00FFB3] text-[#00FFB3] rounded-full font-semibold hover:bg-[#00FFB3] hover:text-[#1A3A52] transition-colors"
          >
            <Heart className="w-5 h-5" />
            {t.connect}
          </button>
        )}
        {isConnected && onMessage && (
          <>
            <button
              onClick={onMessage}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#00FFB3] text-[#1A3A52] rounded-full font-semibold hover:bg-[#00E5A0] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              {t.message}
            </button>

            <button
              onClick={onDeleteConnection}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-[#00FFB3] text-[#00FFB3] rounded-full font-semibold hover:bg-[#00FFB3] hover:text-[#1A3A52] transition-colors"
            >
              <HeartOff className="w-5 h-5" />
              {t.remove}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
