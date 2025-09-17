import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold tracking-wide ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary-500 to-primary-900 text-white shadow-[0_8px_20px_-6px_rgba(0,163,255,0.55)] hover:shadow-[0_10px_24px_-6px_rgba(0,163,255,0.75)] hover:brightness-110",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-[0_8px_20px_-6px_rgba(239,68,68,0.55)] hover:brightness-110",
        outline:
          "border-2 border-transparent text-primary-400 hover:text-white [background:linear-gradient(#0A0F23,#0A0F23)_padding-box,linear-gradient(90deg,#0033AD,#00A3FF)_border-box] hover:[background:linear-gradient(#0E132A,#0E132A)_padding-box,linear-gradient(90deg,#00A3FF,#0033AD)_border-box]",
        secondary:
          "bg-dark-800/70 text-white hover:bg-dark-700/80 border border-dark-700 backdrop-blur-xs",
        ghost: "text-white/80 hover:text-white hover:bg-white/5",
        link: "text-primary-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
