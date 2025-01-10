import React from "react";
import { cn } from "../../utils/cn";

export const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary", // Default to primary for navigation buttons
  size = "default",
  className,
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center rounded-full text-sm font-medium overflow-hidden transition-all duration-300 backdrop-blur-sm";

  const sizeStyles = {
    default: "h-12 px-6",
    sm: "h-10 px-4 text-xs",
    lg: "h-14 px-8 text-lg",
  };

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-500/60 to-blue-700/60 text-white
      hover:from-blue-500/80 hover:to-blue-700/80
      border border-blue-500/40 hover:border-blue-500
      shadow-md hover:shadow-lg
    `,
    outline: `
      border border-white/30 text-earth
      hover:border-white/50 hover:bg-white/10
    `,
    ghost: `
      text-earth border border-white/20
      hover:bg-white/10 hover:border-white/30
    `,
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
