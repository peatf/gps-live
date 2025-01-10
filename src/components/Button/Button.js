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
  const baseStyles =
    "relative inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 overflow-hidden";

  const sizeStyles = {
    default: "h-12 px-6",
    sm: "h-10 px-4 text-xs",
    lg: "h-14 px-8 text-lg",
  };

  const variantStyles = {
    primary: "bg-cosmic text-white hover:bg-cosmic-light transform hover:scale-105",
    outline: "bg-gradient-to-r from-silver-300/30 to-silver-500/30 text-silver-600 hover:from-silver-300/40 hover:to-silver-500/40",
    ghost: "bg-gradient-to-r from-silver-300/20 to-silver-500/20 text-silver-600 hover:from-silver-300/30 hover:to-silver-500/30"
  };


  const interactionEffects = `
    hover:shadow-lg hover:-translate-y-0.5
    active:shadow-inner active:translate-y-0.5
    disabled:opacity-50 disabled:pointer-events-none
    transition-all duration-200
  `;

  const bubbleShadow = variant === 'primary' 
    ? "shadow-[0_4px_14px_0_rgba(62,84,184,0.2)]"
    : "shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        glossyEffect,
        interactionEffects,
        bubbleShadow,
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "whitespace-normal break-words min-h-[48px]",
        "backdrop-blur-sm",
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
