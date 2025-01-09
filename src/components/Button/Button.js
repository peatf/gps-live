// src/components/Button/Button.js
import React from "react";
import { cn } from "../../utils/cn";

export const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  size = "default",
  className,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200";
  const sizeStyles = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  };
  
  const variantStyles = {
    primary: "bg-sage text-white hover:bg-sage-light shadow-sm",
    cosmic: "bg-cosmic text-white hover:bg-cosmic-light shadow-cosmic",
    outline: "border border-stone hover:border-cosmic-light bg-transparent hover:bg-stone/5",
    ghost: "hover:bg-stone/5 hover:text-cosmic",
    link: "text-cosmic underline-offset-4 hover:underline",
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
