// src/components/Card/Card.js

import React from "react";

export const Card = ({ children, className }) => (
  <div className={`card p-6 ${className || ""}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`border-b border-neutral-200 pb-4 mb-6 ${className || ""}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h2 className={`text-xl font-semibold text-neutral-800 ${className || ""}`}>
    {children}
  </h2>
);

export const CardContent = ({ children, className }) => (
  <div className={`space-y-6 ${className || ""}`}>{children}</div>
);
