import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

const TypewriterText = ({ children, onComplete }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const text = typeof children === 'string' 
      ? children 
      : children?.props?.children || '';
    
    if (!text) return;
    
    container.textContent = '';
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        container.textContent += text[index];
        index++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, [children, onComplete]);
  
  return <div ref={containerRef} className="typewriter-content" />;
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

export const AlertDescription = ({ children, className = "", onComplete }) => {
  const content = React.isValidElement(children) 
    ? children.props.children 
    : children;
    
  return (
    <div className={cn("text-sm text-earth", className)}>
      <TypewriterText onComplete={onComplete}>
        {content}
      </TypewriterText>
    </div>
  );
};
