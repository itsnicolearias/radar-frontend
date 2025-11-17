import * as React from 'react'

import { cn } from '@radar/ui'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'w-full h-24 px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground resize-none',
        'focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 transition-all duration-300',
        'selection:bg-primary selection:text-primary-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
