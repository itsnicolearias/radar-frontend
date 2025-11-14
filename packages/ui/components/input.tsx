import * as React from 'react'

import { cn } from '@radar/ui'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full h-14 px-6 bg-[#1A1A1A] border border-[#00FFB3]/30 rounded-full text-white placeholder-white/50',
        'focus:ring-2 focus:ring-[#00FFB3]/50 focus:outline-none transition-all duration-300',
        'selection:bg-[#00FFB3] selection:text-black',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
