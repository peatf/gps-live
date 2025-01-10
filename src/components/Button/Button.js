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
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200";
  
  const sizeStyles = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  };
  
  const variantStyles = {
    primary: "bg-sage/90 text-white hover:bg-sage shadow-sm glass-effect",
    cosmic: "bg-cosmic/90 text-white hover:bg-cosmic shadow-cosmic glass-effect",
    outline: "border border-stone/20 hover:border-cosmic/20 bg-transparent hover:bg-stone/5 glass-effect",
    ghost: "hover:bg-stone/5 hover:text-cosmic glass-effect",
    link: "text-cosmic underline-offset-4 hover:underline",
  };

  const bubbleEffect = "before:content-[''] before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity";

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        bubbleEffect,
        "relative overflow-hidden",
        "hover:scale-[1.02] active:scale-[0.98]",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <div className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </div>
    </button>
  );
};
