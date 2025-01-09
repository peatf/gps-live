// src/components/Card/Card.js
import React from "react";
import { cn } from "../../utils/cn";

export const Card = ({ children, className }) => (
  <div className={cn("card", className)}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={cn("pb-4 mb-4", className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h2 className={cn("text-xl font-semibold text-gray-900", className)}>
    {children}
  </h2>
);

export const CardContent = ({ children, className }) => (
  <div className={cn("space-y-6", className)}>
    {children}
  </div>
);
