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

  // Updated variants to use glass effect by default except for primary buttons
  const variantStyles = {
    primary: "bg-cosmic text-white hover:bg-cosmic-light",
    outline: `
      bg-transparent
      backdrop-filter backdrop-blur-sm
      border border-silver-600/20
      hover:border-silver-600/30
      text-silver-600
      hover:bg-silver-100/5
    `,
    ghost: `
      bg-transparent
      backdrop-filter backdrop-blur-sm
      text-silver-600
      hover:bg-silver-100/5
      border border-transparent
    `
  };

  // Detect button type from className to apply appropriate glass effects
  const isNavButton = className?.includes('outline') || className?.includes('ghost');
  const isSensationButton = className?.includes('sensation-button');
  const isSelected = props.selected || className?.includes('selected');

  // Special glass effects based on button type
  const glassStyles = cn(
    !isNavButton && !variant.includes('primary') && `
      shadow-[0_2px_8px_rgba(0,0,0,0.02)]
      hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]
      active:shadow-[0_2px_4px_rgba(0,0,0,0.02)]
    `,
    isSensationButton && `
      backdrop-filter backdrop-blur-sm
      active:transform active:scale-[0.98]
      transition-all duration-200
    `,
    isSelected && "bg-cosmic text-white"
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        glassStyles,
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
