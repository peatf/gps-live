import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

const TypewriterText = ({ children }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // If children is a string, animate it
    if (typeof children === 'string') {
      const element = elementRef.current;
      element.textContent = '';
      
      let index = 0;
      const timer = setInterval(() => {
        if (index < children.length) {
          element.textContent += children[index];
          index++;
        } else {
          clearInterval(timer);
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [children]);

  // If children is a React element or array, render it directly
  if (React.isValidElement(children) || Array.isArray(children)) {
    return children;
  }

  // For strings, use the typewriter effect
  return <div ref={elementRef} className="typewriter-content" />;
};

export const Alert = ({ children, variant = "default", className = "" }) => {
  const variantStyles = {
    default: "bg-yellow-50/30 border-yellow-300/30 text-yellow-900 glowing-screen",
    info: "bg-blue-100/30 border-blue-300/30 text-blue-800",
    warning: "bg-yellow-100/30 border-yellow-300/30 text-yellow-800",
    error: "bg-red-100/30 border-red-300/30 text-red-800",
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

export const AlertDescription = ({ children, className = "" }) => (
  <div className={cn("text-sm text-earth", className)}>
    <TypewriterText>{children}</TypewriterText>
  </div>
);
