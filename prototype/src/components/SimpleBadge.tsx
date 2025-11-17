interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary';
}

export function SimpleBadge({ children, className = '', variant = 'default' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 transition-colors';
  const variantStyles = variant === 'secondary'
    ? 'bg-gray-100 text-gray-900'
    : 'bg-gray-900 text-white';

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </div>
  );
}
