import * as React from 'react'

import { cn } from '@radar/ui'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full h-14 px-6 bg-input border border-border rounded-full text-foreground placeholder-muted-foreground',
        'focus:ring-2 focus:ring-ring focus:outline-none transition-all duration-300',
        'selection:bg-primary selection:text-primary-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
