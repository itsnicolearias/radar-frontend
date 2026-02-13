"use client";

import type { IRadarUser } from "@radar/types";
import { motion } from "framer-motion";
import { X, MapPin, MessageCircle, Heart, HeartOff, Clock } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useConnectionStore, useUIStore } from "@radar/features";

export function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const modalRoot = typeof document !== "undefined" ? document.getElementById("modal-root") : null;
  if (!modalRoot) return null;

  return createPortal(children, modalRoot);
}

interface UserProfileModalProps {
  user: IRadarUser;
  onClose: () => void;
  onMessage: () => void;
  isUserConnected: () => boolean;
  sendConnection: () => void;
  deleteConnection: () => void;
  isConnectionPending: () => boolean;
  labels?: {
    near: string;
    distanceMeters?: (count: number) => string;
    distanceKm?: (count: string) => string;
    distanceLabel?: (distance?: number) => string;
    interests: string;
    about: string;
    message: string;
    removeFriend: string;
    pending: string;
    sendRequest: string;
  };
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  onMessage,
  isUserConnected,
  sendConnection,
  deleteConnection,
  isConnectionPending,
  labels,
}) => {
  const { getLocalConnectionState, setLocalConnectionState } = useConnectionStore();
  const { openModal, closeModal } = useUIStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const t = labels ?? {
    near: "Cerca",
    distanceMeters: (count: number) => `A ${count}m de distancia`,
    distanceKm: (count: string) => `A ${count}km de distancia`,
    interests: "Intereses",
    about: "Sobre mi",
    message: "Enviar mensaje",
    removeFriend: "Eliminar amigo",
    pending: "Pendiente",
    sendRequest: "Enviar solicitud",
  };
  const distanceText = (() => {
    if (t.distanceLabel) return t.distanceLabel(user.distance);
    if (user.distance == null) return t.near;
    const displayDistance = user.distance < 50 ? 50 : user.distance;
    if (displayDistance < 1000) return (t.distanceMeters ?? ((count) => `${count}m`))(Math.round(displayDistance));
    return (t.distanceKm ?? ((count) => `${count}km`))((displayDistance / 1000).toFixed(1));
  })();

  const localState = getLocalConnectionState(user.userId);
  const connectionMade = localState === "connected" || isUserConnected();
  const isPending = localState === "pending" || isConnectionPending();

  const handleSendConnection = () => {
    setIsAnimating(true);
    sendConnection();
    setLocalConnectionState(user.userId, "pending");
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleDeleteConnection = () => {
    setLocalConnectionState(user.userId, null);
    deleteConnection();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    openModal();
    return () => {
      document.body.style.overflow = "";
      closeModal();
    };
  }, [openModal, closeModal]);

  return (
    <ModalPortal>
      <motion.div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ transform: "none", willChange: "auto", position: "fixed", pointerEvents: "auto" }}
      >
        <motion.div
          className="bg-[#0A0E12] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-linear-to-b from-[#197387] to-[#0F2B33] p-8 pb-16">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-black font-bold text-4xl mb-4 border-2 border-[#00FFB3] overflow-hidden">
                {user.Profile?.photoUrl ? (
                  <img src={user.Profile.photoUrl || "/placeholder.svg"} alt={user.displayName || "U"} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.displayName?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-4 h-4 text-[#1DE3F2]" />
                <span>{distanceText}</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-white font-bold text-2xl">
                {user.Profile.showAge && user.Profile.age ? `${user.displayName}, ${user.Profile.age}` : user.displayName}
              </h2>
              {user.Profile.showLocation && (
                <p className="text-[#1DE3F2] flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {user.Profile.province || t.near}
                </p>
              )}
            </div>

            {user.Profile.interests && user.Profile.interests.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">{t.interests}</h3>
                <div className="flex flex-wrap gap-2">
                  {user.Profile.interests.map((interest) => (
                    <span key={interest} className="px-4 py-2 bg-white rounded-full text-black text-sm font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.Profile.bio && (
              <div>
                <h3 className="text-white font-semibold mb-2">{t.about}</h3>
                <p className="text-[#C5C5C5] leading-relaxed">{user.Profile.bio}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {connectionMade ? (
                <>
                  <button
                    onClick={onMessage}
                    className="flex-1 h-14 rounded-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-semibold hover:shadow-lg transition-all duration-300 shadow-[#00FFB3]/30 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {t.message}
                  </button>
                  <button
                    className="h-14 px-6 rounded-full border border-[#FF005C]/30 flex items-center justify-center gap-2 hover:bg-[#FF005C]/10 transition-colors bg-[#1A1A1A] text-[#FF005C] font-medium"
                    onClick={handleDeleteConnection}
                  >
                    <HeartOff className="w-5 h-5" />
                    {t.removeFriend}
                  </button>
                </>
              ) : isPending ? (
                <button
                  className="flex-1 h-14 rounded-full border border-yellow-500/30 flex items-center justify-center gap-2 bg-yellow-500/10 text-yellow-500 font-medium cursor-not-allowed"
                  disabled
                >
                  <Clock className="w-5 h-5" />
                  {t.pending}
                </button>
              ) : (
                <motion.button
                  className="flex-1 h-14 rounded-full border border-[#FF005C]/30 flex items-center justify-center gap-2 hover:bg-[#FF005C]/10 transition-colors bg-[#1A1A1A] text-[#FF005C] font-medium"
                  onClick={handleSendConnection}
                  animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className="w-5 h-5" />
                  {t.sendRequest}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ModalPortal>
  );
};
