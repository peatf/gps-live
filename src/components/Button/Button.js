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
    default: "h-12 px-6", // Increased height
    sm: "h-10 px-4 text-xs",
    lg: "h-14 px-8 text-lg",
  };

  const variantStyles = {
    primary: "bg-cosmic text-white hover:bg-cosmic-light transform hover:scale-105",
    outline: "border-2 border-cosmic/30 text-cosmic bg-white/80 hover:bg-cosmic/5",
    ghost: "text-cosmic hover:bg-cosmic/5",
  };

  // Enhanced glossy effect
  const glossyEffect = 
    before:content-[''] before:absolute before:inset-0 
    before:bg-gradient-to-b before:from-white/30 before:to-transparent 
    before:rounded-full before:opacity-50
    after:content-[''] after:absolute after:inset-0 
    after:bg-gradient-to-t after:from-black/10 after:to-transparent 
    after:rounded-full after:opacity-20
  ;

  // Enhanced hover and active states
  const interactionEffects = 
    hover:shadow-lg hover:-translate-y-0.5
    active:shadow-inner active:translate-y-0.5
    disabled:opacity-50 disabled:pointer-events-none
    transition-all duration-200
  ;

  // Bubble effect shadow
  const bubbleShadow = "shadow-[0_4px_14px_0_rgba(62,84,184,0.2)]";

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
        // Ensure text doesn't get cut off on mobile
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
