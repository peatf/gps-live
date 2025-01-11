import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

// Helper to recursively extract text content from any structure
const extractTextContent = (node) => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  
  // Handle arrays
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join(' ');
  }
  
  // Handle React elements
  if (React.isValidElement(node)) {
    // Extract from children
    return extractTextContent(node.props.children);
  }
  
  // Handle plain objects with children
  if (node.children) {
    return extractTextContent(node.children);
  }
  
  return '';
};

const TypewriterText = ({ children, onComplete }) => {
  const elementRef = useRef(null);
  const [isTyping, setIsTyping] = useState(true);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!elementRef.current) return;

    // Reset state when children change
    setIsTyping(true);
    setContent('');

    // Extract text to type
    const textContent = extractTextContent(children);
    let timeouts = [];

    // Handle empty or invalid content
    if (!textContent) {
      setIsTyping(false);
      if (onComplete) onComplete();
      return;
    }

    // Type each character
    let currentIndex = 0;
    const typeChar = () => {
      if (currentIndex < textContent.length) {
        setContent(prev => prev + textContent[currentIndex]);
        currentIndex++;
        timeouts.push(setTimeout(typeChar, 30));
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };

    timeouts.push(setTimeout(typeChar, 0));

    // Cleanup timeouts
    return () => timeouts.forEach(clearTimeout);
  }, [children, onComplete]);

  // If content is a React element or component, handle specially
  if (React.isValidElement(children)) {
    if (isTyping) {
      // During typing, render the structure with our typed content
      return React.cloneElement(children, {
        ...children.props,
        children: content || '\u00A0' // Use non-breaking space if empty
      });
    }
    // After typing complete, render original element
    return children;
  }

  // For plain text or other content
  return (
    <div 
      ref={elementRef}
      className="whitespace-pre-wrap"
    >
      {isTyping ? content || '\u00A0' : children}
    </div>
  );
};

const ContentRenderer = ({ children }) => {
  if (!children) return null;

  // Handle arrays (like list items)
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <ContentRenderer key={index}>{child}</ContentRenderer>
    ));
  }

  // Handle React elements
  if (React.isValidElement(children)) {
    // If it's an element with children, process them
    if (children.props.children) {
      return React.cloneElement(children, {
        ...children.props,
        children: <ContentRenderer>{children.props.children}</ContentRenderer>
      });
    }
    return children;
  }

  // Handle plain text with typewriter
  if (typeof children === 'string' || typeof children === 'number') {
    return <TypewriterText>{children}</TypewriterText>;
  }

  return children;
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
    <ContentRenderer>{children}</ContentRenderer>
  </div>
);
