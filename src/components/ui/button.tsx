import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button shadcn/ui re-stylé aux tokens AMSANTÉ :
 * pill 999 px, semibold, ombre teal douce, micro-interaction active.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-teal-900 text-sand-50 shadow-soft hover:bg-teal-700 hover:shadow-lift",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-sand-300 bg-transparent text-ink shadow-xs hover:border-teal-500/60 hover:bg-teal-100/60 hover:text-teal-900",
        secondary:
          "bg-teal-100 text-teal-900 hover:bg-teal-500/20",
        ghost:
          "hover:bg-teal-100/70 hover:text-teal-900",
        "on-dark":
          "bg-teal-500 text-ink shadow-[0_8px_24px_-8px_rgb(23_163_152/0.7)] hover:bg-teal-300",
        "outline-light":
          "border border-white/25 bg-white/5 text-sand-50 backdrop-blur-sm hover:bg-white/15",
        link: "text-teal-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 has-[>svg]:px-4",
        sm: "h-9 gap-1.5 px-3.5 text-[13px] has-[>svg]:px-3",
        lg: "h-12 px-7 text-[15px] has-[>svg]:px-5",
        xl: "h-14 px-9 text-base has-[>svg]:px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
