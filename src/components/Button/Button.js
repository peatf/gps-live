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
    "relative inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 overflow-hidden";

  const sizeStyles = {
    default: "h-10 px-6",
    sm: "h-8 px-4 text-xs",
    lg: "h-12 px-8 text-lg",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-silver-300 to-silver-500 text-white shadow-md hover:shadow-lg",
    outline:
      "border border-silver-300 text-silver-600 bg-transparent hover:bg-silver-100",
    ghost: "bg-transparent text-silver-600 hover:bg-silver-100",
  };

  const glossyEffect =
    "before:content-[''] before:absolute before:inset-0 before:rounded-full " +
    "before:bg-gradient-to-t before:from-white/40 before:to-transparent " +
    "before:opacity-50 before:blur-sm";

  const hoverEffect =
    "hover:before:opacity-80 hover:scale-105 active:scale-95";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        glossyEffect,
        hoverEffect,
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
