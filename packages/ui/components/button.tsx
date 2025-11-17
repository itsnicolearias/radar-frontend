import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@radar/ui'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105',
        secondary:
          'bg-secondary text-secondary-foreground border border-primary/30 hover:bg-secondary/80',
        destructive:
          'bg-destructive text-destructive-foreground border border-destructive/30 hover:bg-destructive/80',
        icon: 'bg-card text-foreground border border-border hover:scale-110 transition-transform',
        fab: 'bg-gradient-to-br from-primary to-secondary shadow-2xl shadow-primary/50',
        link: 'text-primary underline-offset-4 hover:underline',
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
