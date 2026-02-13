import { Zap, MapPin, Radio, Check } from "lucide-react";

interface PlanCardTexts {
  title: string;
  radarRangeLabel: string;
  radarRangeValue: string;
  signalsLabel: string;
  signalsValue: string;
  visitors: string;
}

const defaultTexts: PlanCardTexts = {
  title: "Plan Free",
  radarRangeLabel: "Radio del radar:",
  radarRangeValue: "10 km",
  signalsLabel: "Senales:",
  signalsValue: "1 cada 24h",
  visitors: "Ver ultimos 3 visitantes",
};

export default function PlanCard({ texts }: { texts?: PlanCardTexts }) {
  const t = texts ?? defaultTexts;

  return (
    <div className="rounded-2xl p-5 bg-[#1A1A1A] border border-[#00FFB3]/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#00FFB3]" />
          <h3 className="text-white">{t.title}</h3>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-[#C5C5C5] mt-0.5" />
          <span className="text-[#C5C5C5] text-sm">
            {t.radarRangeLabel} <span className="text-white">{t.radarRangeValue}</span>
          </span>
        </div>

        <div className="flex items-start gap-2">
          <Radio className="w-4 h-4 text-[#C5C5C5] mt-0.5" />
          <span className="text-[#C5C5C5] text-sm">
            {t.signalsLabel} <span className="text-white">{t.signalsValue}</span>
          </span>
        </div>

        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-[#C5C5C5] mt-0.5" />
          <span className="text-[#C5C5C5] text-sm">{t.visitors}</span>
        </div>
      </div>
    </div>
  );
}
