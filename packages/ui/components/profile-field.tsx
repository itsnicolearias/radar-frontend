import { Eye, EyeOff } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: "text" | "number";
  privacyLabels?: {
    visible: string;
    hidden: string;
  };
  privacy?: {
    visible: boolean;
    onToggle: () => void;
  };
}

export default function ProfileField({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  privacyLabels,
  privacy,
}: Props) {
  const labels = privacyLabels ?? { visible: "Visible", hidden: "Oculto" };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-white">{label}</label>

        {privacy && (
          <button
            onClick={privacy.onToggle}
            className="flex items-center gap-1 text-xs text-[#197387] hover:text-[#00FFB3] transition"
          >
            {privacy.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
            {privacy.visible ? labels.visible : labels.hidden}
          </button>
        )}
      </div>

      {multiline ? (
        <textarea
          className="w-full h-24 px-4 py-3 bg-[#0A0E12]/50 border border-[#197387]/30 rounded-xl text-white placeholder-[#C5C5C5] resize-none outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className="w-full h-10 px-4 bg-[#0A0E12]/50 border border-[#197387]/30 rounded-xl text-white placeholder-[#C5C5C5] outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
