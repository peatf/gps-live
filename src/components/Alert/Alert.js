// src/components/Alert/Alert.js

import React from "react";

export const Alert = ({ children, variant = "info", className = "" }) => {
  const variantStyles = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning"
  };

  return (
    <div className={`alert ${variantStyles[variant]} fade-in ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = "" }) => (
  <div className={`text-sm ${className}`}>{children}</div>
);
