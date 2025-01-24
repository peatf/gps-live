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
  const baseStyles = "relative inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300";

  const sizeStyles = {
    default: "px-6 py-3",
    sm: "px-4 py-2 text-xs",
    lg: "px-8 py-4 text-lg",
  };

  const glassBase = `
    relative
    bg-white/[0.02]
    before:absolute before:inset-0 before:rounded-full before:-z-10
    before:bg-white/[0.02]
    hover:bg-white/[0.04]
    active:bg-white/[0.06]
    transition-all duration-300
  `;

  const variantStyles = {
    primary: cn(
      "bg-cosmic text-white",
      "hover:bg-cosmic-light transform hover:scale-[1.02]",
      "active:scale-[0.98]",
      "border border-cosmic"
    ),
    
    ghost: cn(
      glassBase,
      "border border-white/5",
      "text-earth/90",
      "hover:border-white/10",
      "active:border-white/20",
      "data-[state=active]:bg-white/[0.04]",
      "data-[state=active]:border-white/10"
    ),
    
    sensation: cn(
      glassBase,
      "border border-white/5",
      "text-earth/90",
      "hover:border-white/10",
      "active:border-white/20",
      "justify-start gap-2",
      "group",
      "data-[state=active]:bg-white/[0.04]",
      "data-[state=active]:border-white/10"
    ),
    
    toggle: cn(
      glassBase,
      "border border-white/10",
      "text-earth",
     "data-[state=active]:bg-cosmic/10", // A faint cosmic tint for active state
"data-[state=active]:border-cosmic/30", // Highlight border on active
"data-[state=active]:text-earth" // Maintain consistent text color
    )
  };

  const buttonVariant = className?.includes("sensation-button") ? "sensation" : variant;
  const isActive = props["data-state"] === "active" || props.selected;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-state={isActive ? "active" : undefined}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[buttonVariant],
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      style={{
        backdropFilter: variant === 'primary' ? undefined : 'blur(8px)',
        WebkitBackdropFilter: variant === 'primary' ? undefined : 'blur(8px)',
        background: variant === 'primary' ? undefined : 'rgba(255, 255, 255, 0.02)'
      }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
    </button>
  );
};
