import React from "react";
import { cn } from "../../utils/cn";

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-stone bg-cloud px-3 py-2",
      "text-sm text-earth placeholder:text-dove",
      "transition-all duration-200",
      "focus:outline-none focus:border-cosmic focus:ring-1 focus:ring-cosmic",
      "hover:border-cosmic-light",
      className
    )}
    {...props}
  />
));
