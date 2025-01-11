import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

export const Alert = ({ children, variant = "default", className = "" }) => {
  const variantStyles = {
    default: "bg-yellow-50 border-yellow-300 text-yellow-900 glowing-screen",
    info: "bg-blue-100 border-blue-300 text-blue-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    error: "bg-red-100 border-red-300 text-red-800",
  };

  return (
    <div
      className={cn(
        "relative p-6 rounded-3xl shadow-md transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = "" }) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current && typeof children === 'string') {
      const text = children;
      const element = textRef.current;
      element.textContent = '';
      
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          element.textContent += text[index];
          index++;
        } else {
          clearInterval(timer);
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [children]);

  if (typeof children === 'string') {
    return (
      <div className={cn("text-sm text-earth typewriter", className)}>
        <span ref={textRef} />
      </div>
    );
  }

  return (
    <div className={cn("text-sm text-earth", className)}>
      {children}
    </div>
  );
};
