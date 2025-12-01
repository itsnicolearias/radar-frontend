import { Zap, MapPin, Radio, Check } from "lucide-react";

export default function PlanCard() {
  return (
    <div className="rounded-2xl p-5 bg-[#1A1A1A] border border-[#00FFB3]/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#00FFB3]" />
          <h3 className="text-white">Plan Free</h3>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-[#C5C5C5] mt-0.5" />
          <span className="text-[#C5C5C5] text-sm">
            Radio del radar: <span className="text-white">10 km</span>
          </span>
        </div>

        <div className="flex items-start gap-2">
          <Radio className="w-4 h-4 text-[#C5C5C5] mt-0.5" />
          <span className="text-[#C5C5C5] text-sm">
            Señales: <span className="text-white">1 cada 24h</span>
          </span>
        </div>

        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-[#C5C5C5] mt-0.5" />
          <span className="text-[#C5C5C5] text-sm">Ver últimos 3 visitantes</span>
        </div>
      </div>
    </div>
  );
}
