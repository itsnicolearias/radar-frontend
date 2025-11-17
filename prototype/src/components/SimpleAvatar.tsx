import { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

export function SimpleAvatar({ src, alt, fallback, className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="aspect-square w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex w-full h-full items-center justify-center bg-gray-200 text-gray-600">
          {fallback || alt?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
    </div>
  );
}
