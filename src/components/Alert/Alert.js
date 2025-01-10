import React from "react";
import { cn } from "../../utils/cn";

export const Alert = ({ children, variant = "default", className = "" }) => {
  const variantStyles = {
    default:
      "bg-yellow-50 border-yellow-300 text-yellow-900 glowing-screen", // Pale yellow glowing effect
    info: "bg-blue-100 border-blue-300 text-blue-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    error: "bg-red-100 border-red-300 text-red-800",
  };

  return (
    <div
      className={cn(
        "relative p-6 rounded-3xl shadow-md transition-all duration-300", // Shared styles
        variantStyles[variant], // Dynamic variant styles
        className
      )}
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = "" }) => (
  <div className={cn("text-sm", className)}>{children}</div>
);
