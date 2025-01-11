// src/components/Card/Card.js
import React from "react";
import { cn } from "../../utils/cn";

export const Card = ({ children, className }) => (
  <div
    className={cn(
      "relative rounded-3xl transition-all duration-300",
      "min-h-[90vh] w-[98vw] md:w-[95vw]", // Increased width to fill more space
      "hover:shadow-xl",
      "border border-cosmic/5",
      "bg-transparent backdrop-blur-xl",
      className
    )}
    style={{
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      backgroundColor: 'rgba(255, 255, 255, 0.02)', // Much more transparent
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
      "bg-transparent",
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
      "bg-transparent",
      className
    )}
    style={{
      maxHeight: 'calc(90vh - 120px)', // Account for header
      overflowY: 'auto',
      overflowX: 'hidden'
    }}
  >
    {children}
  </div>
);
