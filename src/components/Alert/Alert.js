import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

const TypewriterText = ({ children }) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const text = typeof children === 'string' 
      ? children 
      : (children?.props?.children || '');
      
    if (!text || typeof text !== 'string') {
      textRef.current.textContent = children;
      return;
    }

    textRef.current.textContent = '';
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        textRef.current.textContent += text[index];
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [children]);

  if (React.isValidElement(children)) {
    return children;
  }

  return <span ref={textRef} />;
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
