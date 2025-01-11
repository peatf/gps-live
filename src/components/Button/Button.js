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

  const variantStyles = {
    primary: "bg-cosmic text-white hover:bg-cosmic-light",
    outline: "border border-silver-600/50 text-silver-600 hover:bg-silver-100/10 bg-transparent",
    ghost: "text-silver-600 hover:bg-silver-100/10 bg-transparent"
  };

  const mobileStyles = `
    @media (max-width: 640px) {
      font-size: 14px;
      padding-left: 1rem;
      padding-right: 1rem;
      max-width: 100%;
      white-space: normal;
    }
  `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "min-h-[44px]",
        mobileStyles,
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 px-1">
        {children}
      </span>
    </button>
  );
};
