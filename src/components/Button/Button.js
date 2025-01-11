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
    "relative inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300";

  const sizeStyles = {
    default: "px-6 py-3",
    sm: "px-4 py-2 text-xs",
    lg: "px-8 py-4 text-lg",
  };

  const variantStyles = {
    primary: "bg-cosmic text-white hover:bg-cosmic-light",
    outline: "border border-silver-600/50 text-silver-600 hover:bg-silver-100/10 bg-transparent",
    ghost: "text-silver-600 hover:bg-silver-100/10 bg-transparent shadow-sm shadow-white/10 hover:shadow-white/20"
  };

  // Updated mobile styles
  const mobileStyles = `
    @media (max-width: 640px) {
      font-size: 14px;
      padding: 0.75rem 1rem;
      min-width: ${variant === 'primary' ? '120px' : 'auto'};
    }
  `;

  // Special treatment for sensation buttons
  const isSensationButton = className?.includes('sensation-button');
  const sensationStyles = isSensationButton ? `
    flex items-center justify-start gap-2
    shadow-[0_2px_4px_rgba(0,0,0,0.05)]
    border border-white/20
    backdrop-filter backdrop-blur-sm
    hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)]
    transition-all duration-300
    overflow-hidden
    whitespace-normal
    text-left
    w-full
  ` : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sensationStyles,
        mobileStyles,
        className
      )}
      {...props}
    >
      <span className={cn(
        "relative z-10 flex items-center justify-center gap-2",
        isSensationButton ? "w-full" : "px-1"
      )}>
        {children}
      </span>
    </button>
  );
};
