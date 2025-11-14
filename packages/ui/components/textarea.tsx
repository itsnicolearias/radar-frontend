import * as React from 'react'

import { cn } from '@radar/ui'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'w-full h-24 px-4 py-3 bg-[#1A1A1A] border border-[#00FFB3]/30 rounded-xl text-white placeholder-white/40 resize-none',
        'focus:outline-none focus:border-[#00FFB3] focus:ring-2 focus:ring-[#00FFB3]/50 transition-all duration-300',
        'selection:bg-[#00FFB3] selection:text-black',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
