import { SimpleBadge } from "./prototype/SimpleBadge";

const ALL = [
  "Música",
  "Café",
  "Arte",
  "Running",
  "Fotografía",
  "Viajes",
  "Gaming",
  "Cine",
  "Lectura",
  "Deportes",
  "Cocina",
  "Tecnología",
];

export default function InterestsSelector({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (name: string) => void;
}) {
  return (
    <div className="animate-slide-up-delay-2">
      <label className="block text-white mb-3">Intereses</label>

      <div className="flex flex-wrap gap-2">
        {ALL.map((interest) => {
          const active = selected.includes(interest);
          return (
            <SimpleBadge
              key={interest}
              onClick={() => onToggle(interest)}
              className={`px-4 py-2 cursor-pointer transition-all ${
                active
                  ? "bg-[#197387] text-white hover:bg-[#15657a]"
                  : "bg-[#0A0E12]/50 border border-[#197387]/30 text-[#C5C5C5] hover:bg-[#0A0E12]/80"
              }`}
            >
              {interest}
            </SimpleBadge>
          );
        })}
      </div>
    </div>
  );
}
