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
  const baseStyles =
    "relative inline-flex items-center justify-center rounded-full text-sm font-medium overflow-hidden transition-all duration-300";

  const sizeStyles = {
    default: "h-12 px-6", // Default button size
    sm: "h-10 px-4 text-xs",
    lg: "h-14 px-8 text-lg",
  };

  const variantStyles = {
    primary: "bg-white/10 backdrop-blur-sm text-earth hover:text-cosmic hover:bg-white/20 border border-white/20 hover:border-white/40 shadow-md hover:shadow-lg",
    outline: "border border-white/20 text-earth hover:text-cosmic hover:bg-white/10 hover:border-white/30",
    ghost: "text-earth hover:bg-white/10",
  };

  const interactionEffects = `
    hover:-translate-y-0.5 active:translate-y-0.5
    disabled:pointer-events-none disabled:opacity-50
  `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        interactionEffects,
        "whitespace-normal break-words min-h-[48px]",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center px-2">
        {children}
      </span>
    </button>
  );
};
