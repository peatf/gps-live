import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

// Helper to safely convert content to string
const getTextContent = (content) => {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.join(' ');
  if (content?.props?.children) {
    if (typeof content.props.children === 'string') return content.props.children;
    if (Array.isArray(content.props.children)) {
      return content.props.children
        .map(child => typeof child === 'string' ? child : '')
        .join(' ');
    }
  }
  return '';
};

// Helper to check if content should have typewriter effect
const shouldAnimate = (content) => {
  if (typeof content === 'string') return true;
  if (content?.props?.children && typeof content.props.children === 'string') return true;
  return false;
};

const TypewriterText = ({ children }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current || !shouldAnimate(children)) return;

    const text = getTextContent(children);
    const element = elementRef.current;
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
  }, [children]);

  // If content isn't suitable for animation, render it directly
  if (!shouldAnimate(children)) {
    return children;
  }

  // For animatable content, use the typewriter effect
  return <div ref={elementRef} />;
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
