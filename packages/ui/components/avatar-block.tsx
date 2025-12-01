import { Settings, Crown } from "lucide-react";
import { SimpleAvatar } from "./prototype/SimpleAvatar";

export default function AvatarBlock({
  src,
  initials,
}: {
  src?: string;
  initials: string;
}) {
  return (
    <div className="flex flex-col items-center animate-scale-in">
      <div className="relative">
        <SimpleAvatar
          src={src}
          alt={initials}
          fallback={initials}
          className="w-24 h-24 border-4 border-[#00FFB3]/50"
        />

        <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#1A1A1A] border border-[#00FFB3]/30 rounded-full flex items-center justify-center shadow-lg">
          <Settings className="w-4 h-4 text-white" />
        </button>
      </div>

      <button className="mt-3 text-[#00FFB3]/70 text-sm hover:text-[#00FFB3] transition-colors">
        Cambiar foto de perfil
      </button>
    </div>
  );
}
