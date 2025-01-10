// src/components/Card/Card.js

import React from "react";
import { cn } from "../../utils/cn";

export const Card = ({ children, className }) => (
  <div
    className={cn(
      "relative rounded-3xl shadow-lg transition-all duration-300",
      "min-h-[85vh]", // Takes up more vertical space
      "hover:shadow-xl",
      "border border-cosmic/10 backdrop-blur-md",
      "bg-white/[0.65]", // Slightly more opaque background
      className
    )}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div
    className={cn(
      "px-8 py-6 rounded-t-3xl border-b border-cosmic/10", // Increased padding
      className
    )}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h2
    className={cn(
      "text-2xl font-semibold text-cosmic", // Increased size and using cosmic color
      className
    )}
  >
    {children}
  </h2>
);

export const CardContent = ({ children, className }) => (
  <div
    className={cn(
      "p-8 space-y-6", // Increased padding
      className
    )}
  >
    {children}
  </div>
);
