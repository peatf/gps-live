// src/components/Card/Card.js
import React from "react";
import { cn } from "../../utils/cn";

export const Card = ({ children, className }) => (
  <div
    className={cn(
      "relative rounded-3xl shadow-lg transition-all duration-300",
      "min-h-[90vh] w-[95vw]", // Increased height and width
      "hover:shadow-xl",
      "border border-cosmic/5",
      "bg-white/[0.08]", // Much more transparent
      "backdrop-blur-xl",
      className
    )}
  style={{
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  backgroundColor: 'rgba(255, 255, 255, 0.01)', // Semi-transparent solid background
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
      "bg-transparent", // Removed white background
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
      "bg-transparent", // Removed white background
      className
    )}
  >
    {children}
  </div>
);
