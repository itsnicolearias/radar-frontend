import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@radar/ui'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00FFB3] focus-visible:ring-offset-black',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black shadow-[#00FFB3]/30 hover:shadow-lg',
        secondary:
          'bg-[#1A1A1A] border border-[#00FFB3]/30 text-white hover:bg-[#1A1A1A]/80',
        destructive:
          'bg-[#1A1A1A] border border-[#FF005C]/30 text-[#FF005C] hover:bg-[#FF005C]/10',
        icon: 'bg-[#1A1A1A] border border-[#00FFB3]/30 text-white hover:scale-110 transition-transform',
        fab: 'bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] shadow-2xl shadow-[#00FFB3]/50',
        link: 'text-[#00FFB3] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-14 px-8 rounded-full text-base',
        sm: 'h-10 px-6 rounded-xl text-sm',
        lg: 'h-14 px-10 rounded-full text-lg',
        icon: 'size-10 rounded-full',
        fab: 'size-16 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
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
