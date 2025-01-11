import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

const TypewriterText = ({ children }) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const texts = elementRef.current.querySelectorAll('.typewriter-text');
    
    texts.forEach((text, index) => {
      setTimeout(() => {
        text.classList.add('typing');
      }, index * 2000); // Start next line after previous finishes
    });
  }, []);
  
  if (typeof children === 'string') {
    return (
      <span className="typewriter-text" ref={elementRef}>
        {children}
      </span>
    );
  }
  
  // Handle nested text (like lists)
  return (
    <div ref={elementRef}>
      {React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <span className="typewriter-text">{child}</span>;
        }
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            children: <TypewriterText>{child.props.children}</TypewriterText>
          });
        }
        return child;
      })}
    </div>
  );
};

export const Alert = ({ children, variant = "default", className = "" }) => {
  const variantStyles = {
    default:
      "bg-yellow-50 border-yellow-300 text-yellow-900 glowing-screen",
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

export const AlertDescription = ({ children, className = "" }) => (
  <div className={cn("text-sm", className)}>
    <TypewriterText>{children}</TypewriterText>
  </div>
);
