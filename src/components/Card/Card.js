import React from "react";
import { cn } from "../../utils/cn";

export const Card = ({ children, className }) => (
  <div
    className={cn(
      "relative rounded-3xl shadow-lg transition-all duration-300", // Increased border radius for bubbly effect
      "hover:shadow-xl hover:scale-105", // Hover interaction for depth and scale
      "border border-transparent backdrop-blur-md", // Glass-like effect
      className
    )}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div
    className={cn(
      "px-6 py-4 rounded-t-3xl border-b border-stone/10", // Rounded top corners
      className
    )}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h2
    className={cn(
      "text-xl font-semibold text-gray-800", // Consistent text styling
      className
    )}
  >
    {children}
  </h2>
);

export const CardContent = ({ children, className }) => (
  <div
    className={cn(
      "p-6 space-y-4", // Padding and spacing for content elements
      className
    )}
  >
    {children}
  </div>
);
