interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'default' | 'icon';
}

export function SimpleButton({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none';

  const variantStyles = variant === 'outline'
    ? 'border-2 border-gray-200 bg-transparent hover:bg-gray-100'
    : 'bg-gray-900 text-white hover:bg-gray-800';

  const sizeStyles = size === 'icon'
    ? 'w-10 h-10'
    : 'px-4 py-2';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
