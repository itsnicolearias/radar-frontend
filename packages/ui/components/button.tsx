import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@radar/ui'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black hover:opacity-90 shadow-lg shadow-[#00FFB3]/30 active:scale-95',
        destructive:
          'bg-[#FF005C] text-white hover:opacity-90 focus-visible:ring-[#FF005C]/20 dark:focus-visible:ring-[#FF005C]/40 shadow-lg shadow-[#FF005C]/30',
        outline:
          'border border-[#1DE3F2]/30 bg-[#1A1A1A] text-white shadow-xs hover:bg-[#1A1A1A]/80 hover:border-[#00FFB3] dark:bg-[#1A1A1A] dark:border-[#1DE3F2]/30 dark:hover:bg-[#1A1A1A]/50',
        secondary:
          'bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 shadow-lg shadow-[#1DE3F2]/20',
        ghost:
          'hover:bg-[#1A1A1A]/50 hover:text-[#00FFB3] text-white dark:hover:bg-[#1A1A1A]/50',
        link: 'text-[#00FFB3] underline-offset-4 hover:text-[#1DE3F2] hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-2xl px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}


export { Button, buttonVariants }
