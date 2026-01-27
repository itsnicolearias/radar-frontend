import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariantsNew = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#00FFB3]/50 active:scale-95",
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black shadow-lg shadow-[#00FFB3]/30 hover:opacity-90',
        destructive:
          'bg-[#FF005C] text-white hover:bg-[#FF005C]/90',
        outline:
          'border border-[#00FFB3]/30 bg-transparent text-white hover:bg-[#00FFB3]/10',
        secondary:
          'bg-[#1A1A1A] border border-[#00FFB3]/30 text-white hover:bg-[#1A1A1A]/80',
        ghost:
          'text-[#C5C5C5] hover:text-[#00FFB3] hover:bg-[#00FFB3]/10',
        link: 'text-[#00FFB3] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-lg',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function ButtonNew({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariantsNew> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariantsNew({ variant, size, className }))}
      {...props}
    />
  )
}

export { ButtonNew, buttonVariantsNew }
