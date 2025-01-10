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
  // Base styles
  const baseStyles =
    "relative inline-flex items-center justify-center text-sm font-medium transition-all duration-300";

  // Size styles
  const sizeStyles = {
    default: "h-10 px-6",
    sm: "h-8 px-4 text-xs",
    lg: "h-12 px-8 text-lg",
  };

  // Variant styles for navigation buttons
  const navVariantStyles = {
    primary: "bg-cosmic text-white hover:bg-cosmic-light transform hover:scale-105",
    outline: "border-2 border-cosmic/30 text-cosmic bg-white/80 hover:bg-cosmic/5",
    ghost: "text-cosmic hover:bg-cosmic/5",
  };

  // Variant styles for standard buttons
  const standardVariantStyles = {
    primary: "bg-gradient-to-r from-silver-300 to-silver-500 text-white shadow-md hover:shadow-lg",
    outline: "border border-silver-300 text-silver-600 bg-transparent hover:bg-silver-100",
    ghost: "bg-transparent text-silver-600 hover:bg-silver-100",
  };

  // Determine if the button is likely navigation-related
  const isNavigation =
    props["aria-label"]?.toLowerCase().includes("navigate") ||
    props["data-role"] === "navigation" ||
    ["onBack", "onComplete"].some((key) => props[key]);

  // Apply the appropriate variant styles
  const variantStyles = isNavigation ? navVariantStyles : standardVariantStyles;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
