import React from "react";

interface SimpleBadgeProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SimpleBadge({ children, className = "", onClick }: SimpleBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1
        rounded-full text-sm font-medium
        bg-[#0A0E12] text-white/80
        border border-[#197387]/40
        backdrop-blur-md 
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
