interface PlaceholderImageProps {
  className?: string;
  alt: string;
  color?: string;
  text?: string;
}

export function PlaceholderImage({ className = '', alt, color = '#3EC8A7', text }: PlaceholderImageProps) {
  const initial = text ? text.charAt(0).toUpperCase() : alt.charAt(0).toUpperCase();

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ backgroundColor: color }}
    >
      <span className="text-white text-4xl font-bold opacity-50">{initial}</span>
    </div>
  );
}
