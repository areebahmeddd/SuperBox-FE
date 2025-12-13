import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white shadow-sm transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-[var(--brand-red)]/50 focus-visible:bg-white/[0.07] focus-visible:ring-1 focus-visible:ring-[var(--brand-red)]/20 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
