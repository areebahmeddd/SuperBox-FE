import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 will-change-[transform,background-color,border-color]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-red)] text-black hover:bg-[var(--brand-red)]/90 shadow-sm hover:shadow-md active:scale-[0.98]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm active:scale-[0.98]",
        outline:
          "border border-white/20 bg-transparent text-white hover:bg-white/5 hover:border-white/30 active:scale-[0.98]",
        secondary:
          "bg-white/10 text-white hover:bg-white/20 shadow-sm active:scale-[0.98]",
        ghost:
          "bg-transparent text-white border border-white/16 hover:bg-white/5 hover:border-white/28 active:scale-[0.98]",
        link: "text-[var(--brand-red)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
