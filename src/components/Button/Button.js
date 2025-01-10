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
      "bg-gradient-to-r from-silver-200 to-silver-400 text-white shadow-md hover:shadow-lg",
    outline:
      "border border-silver-300 text-silver-600 bg-transparent hover:bg-silver-100",
    ghost: "bg-transparent text-silver-600 hover:bg-silver-100",
  };

  const bubbleEffect =
    "before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        bubbleEffect,
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
