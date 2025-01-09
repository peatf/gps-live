// src/components/Alert/Alert.js
import React from "react";
import { cn } from "../../utils/cn";

export const Alert = ({ children, variant = "default", className = "" }) => {
  const variantStyles = {
    default: "bg-stone/5 border-stone/20",
    cosmic: "bg-cosmic/5 border-cosmic/20",
    sage: "bg-sage/5 border-sage/20",
    burgundy: "bg-burgundy/5 border-burgundy/20"
  };

  return (
    <div className={cn(
      "relative w-full rounded-lg border p-4",
      "transition-all duration-300",
      variantStyles[variant],
      className
    )}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = "" }) => (
  <div className={cn("text-sm text-earth", className)}>{children}</div>
);

// src/components/Input/Input.js
import React from "react";
import { cn } from "../../utils/cn";

export const Input = ({ className, ...props }) => (
  <input
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
);
