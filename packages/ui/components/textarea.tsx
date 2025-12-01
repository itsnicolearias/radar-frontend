import * as React from 'react'

import { cn } from '@radar/ui'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-[#1DE3F2]/30 placeholder:text-[#C5C5C5]/40 focus-visible:border-[#00FFB3] focus-visible:ring-[#00FFB3]/50 aria-invalid:ring-[#FF005C]/20 dark:aria-invalid:ring-[#FF005C]/40 aria-invalid:border-[#FF005C] dark:bg-[#1A1A1A] flex field-sizing-content min-h-16 w-full rounded-2xl border bg-[#1A1A1A] px-3 py-2 text-base text-white shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
