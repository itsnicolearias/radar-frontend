interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function SimpleInput({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
