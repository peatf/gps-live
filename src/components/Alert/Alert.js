import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

const TypewriterText = ({ children, onComplete }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const elements = container.querySelectorAll('.typewriter-content');
    let currentIndex = 0;
    
    const typeNextElement = () => {
      if (currentIndex >= elements.length) {
        if (onComplete) onComplete();
        return;
      }
      
      const element = elements[currentIndex];
      const text = element.getAttribute('data-text');
      element.textContent = '';
      
      let charIndex = 0;
      const typeChar = () => {
        if (charIndex < text.length) {
          element.textContent += text[charIndex];
          charIndex++;
          setTimeout(typeChar, 30); // 30ms per character
        } else {
          currentIndex++;
          setTimeout(typeNextElement, 500); // 500ms pause between elements
        }
      };
      
      typeChar();
    };
    
    typeNextElement();
  }, [onComplete]);
  
  const renderContent = (content) => {
    if (typeof content === 'string') {
      return <span className="typewriter-content" data-text={content}></span>;
    }
    
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <div key={index} className="typewriter-content" data-text={item}>
        </div>
      ));
    }
    
    if (React.isValidElement(content)) {
      return React.cloneElement(content, {
        className: cn('typewriter-content', content.props.className),
        'data-text': content.props.children
      });
    }
    
    return content;
  };
  
  return <div ref={containerRef}>{renderContent(children)}</div>;
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

export const AlertDescription = ({ children, className = "", onComplete }) => (
  <div className={cn("text-sm text-earth", className)}>
    <TypewriterText onComplete={onComplete}>{children}</TypewriterText>
  </div>
);
