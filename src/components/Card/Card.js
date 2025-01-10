// src/components/Card/Card.js
import React from "react";
import { cn } from "../../utils/cn";

export const Card = ({ children, className }) => (
  <div
    className={cn(
      "relative rounded-3xl shadow-lg transition-all duration-300",
      "min-h-[85vh]",
      "hover:shadow-xl",
      "border border-cosmic/5",
      "bg-white/[0.25]", // Reduced opacity for more transparency
      "backdrop-blur-xl", // Increased blur for better glass effect
      className
    )}
    style={{
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))'
    }}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div
    className={cn(
      "px-8 py-6 rounded-t-3xl",
      "border-b border-cosmic/10",
      "bg-white/[0.15]", // Subtle contrast for header
      "backdrop-blur-md",
      className
    )}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h2
    className={cn(
      "text-2xl font-semibold text-cosmic",
      className
    )}
  >
    {children}
  </h2>
);

export const CardContent = ({ children, className }) => (
  <div
    className={cn(
      "p-8 space-y-6",
      "bg-white/[0.05]", // Very subtle background
      className
    )}
  >
    {children}
  </div>
);
