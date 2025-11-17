import * as React from 'react'

import { cn } from '@radar/ui'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-[#C5C5C5]/40 selection:bg-[#00FFB3] selection:text-black dark:bg-[#1A1A1A] border-[#1DE3F2]/30 h-9 w-full min-w-0 rounded-2xl border bg-[#1A1A1A] px-3 py-1 text-base text-white shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-[#00FFB3] focus-visible:ring-[#00FFB3]/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-[#FF005C]/20 dark:aria-invalid:ring-[#FF005C]/40 aria-invalid:border-[#FF005C]',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
