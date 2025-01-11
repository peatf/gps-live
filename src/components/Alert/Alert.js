import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

// Clean utility to extract text content
const getTextContent = (node) => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join(' ');
  if (React.isValidElement(node)) return getTextContent(node.props.children);
  return '';
};

// Specialized TypewriterText component
const TypewriterText = ({ children }) => {
  const elementRef = useRef(null);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Clear previous content and timeouts
    element.textContent = '';
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Get text to type
    const text = getTextContent(children);
    if (!text) {
      element.textContent = children;
      return;
    }

    // Type each character
    let currentIndex = 0;
    const type = () => {
      if (currentIndex < text.length) {
        element.textContent += text[currentIndex];
        currentIndex++;
        const timeout = setTimeout(type, 30);
        timeoutsRef.current.push(timeout);
      }
    };

    type();

    // Cleanup function
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [children]);

  // Handle different content types
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: elementRef,
      className: cn(children.props.className, "whitespace-pre-wrap")
    });
  }

  return <div ref={elementRef} className="whitespace-pre-wrap" />;
};

// Main Alert components
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

export const AlertDescription = ({ children, className = "" }) => {
  if (!children) return null;

  return (
    <div className={cn("text-sm text-earth", className)}>
      {typeof children === 'object' && children.props?.children ? (
        React.cloneElement(children, {
          children: <TypewriterText>{children.props.children}</TypewriterText>
        })
      ) : (
        <TypewriterText>{children}</TypewriterText>
      )}
    </div>
  );
};
