import React from "react";
import Image from "next/image";

interface SimpleAvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string; // Iniciales
  className?: string;
}

export function SimpleAvatar({
  src,
  alt = "",
  fallback = "",
  className = "",
}: SimpleAvatarProps) {
  const initials = fallback?.slice(0, 2).toUpperCase();

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-[#0A0E12] border border-[#197387]/30 flex items-center justify-center text-white font-semibold ${className}`}
      style={{ aspectRatio: "1 / 1" }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="96px"
        />
      ) : (
        <span className="text-xl">{initials}</span>
      )}
    </div>
  );
}
