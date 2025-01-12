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
  // Core styles that all buttons share
  const baseStyles = "relative inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300";

  const sizeStyles = {
    default: "px-6 py-3",
    sm: "px-4 py-2 text-xs",
    lg: "px-8 py-4 text-lg",
  };

  // Glass effect base - used by ghost and sensation buttons
  const glassBase = `
    relative
    bg-white/[0.03]
    backdrop-filter backdrop-blur-[2px]
    shadow-[0_2px_5px_rgba(255,255,255,0.05)]
    transition-all duration-300
    hover:bg-white/[0.06]
    active:bg-white/[0.08]
  `;

  // Refined variant styles
  const variantStyles = {
    // Primary stays solid for CTAs
    primary: cn(
      "bg-cosmic text-white",
      "hover:bg-cosmic-light transform hover:scale-[1.02]",
      "active:scale-[0.98]",
      "border border-cosmic"
    ),
    
    // Ghost for navigation (like Back button)
    ghost: cn(
      glassBase,
      "border border-white/5",
      "hover:border-white/10",
      "active:border-white/20",
      "text-earth/90"
    ),
    
    // Special style for sensation buttons
    sensation: cn(
      glassBase,
      "border border-white/5",
      "hover:border-white/10",
      "active:border-white/20",
      "text-earth/90",
      "justify-start gap-2",
      "group"
    ),
    
    // Toggle buttons (like alignment section)
    toggle: cn(
      glassBase,
      "border border-white/10",
      "hover:bg-white/5",
      "data-[state=active]:bg-cosmic",
      "data-[state=active]:text-white",
      "data-[state=active]:border-cosmic",
      "text-earth"
    )
  };

  // Detect button type from props and className
  const isSensationButton = className?.includes("sensation-button");
  const buttonVariant = isSensationButton ? "sensation" : variant;

  // Handle active/selected states
  const isActive = props["data-state"] === "active" || props.selected;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[buttonVariant],
        isActive && "bg-cosmic text-white border-cosmic",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      style={{
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        backgroundColor: variant === 'primary' ? undefined : 'rgba(255, 255, 255, 0.03)'
      }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
    </button>
  );
};
