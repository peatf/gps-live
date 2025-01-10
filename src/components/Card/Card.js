import React from "react";
import { cn } from "../../utils/cn";

export const Card = ({ children, className }) => (
  <div
    className={cn(
      "rounded-lg border border-stone/20 shadow-sm transition-all duration-300 hover:shadow-md",
      className
    )}
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.01)", // Ensure translucency
      backdropFilter: "blur(8px)", // Add blur effect
      -webkitBackdropFilter: "blur(8px)", // Safari-specific
    }}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={cn("p-6 border-b border-stone/10", className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h2 className={cn("text-xl font-medium text-sage", className)}>
    {children}
  </h2>
);

export const CardContent = ({ children, className }) => (
  <div className={cn("p-6 space-y-6", className)}>
    {children}
  </div>
);
