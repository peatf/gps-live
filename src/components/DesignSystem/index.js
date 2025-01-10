import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

// Y2K metal effect base styles
const y2kMetalGradient = "background: linear-gradient(145deg, #FFFFFF 0%, #E6E6E6 47%, #FFFFFF 53%, #E6E6E6 100%)";
const y2kInsetGradient = "background: linear-gradient(145deg, #D1D1D1 0%, #FFFFFF 47%, #E6E6E6 53%, #FFFFFF 100%)";

// Typography component with all-caps Helvetica styling
export const Title = ({ children, className }) => (
  <h2 
    className={cn(
      "font-['Helvetica Neue', Helvetica, Arial] tracking-wide uppercase",
      "text-xl font-medium text-earth/90",
      "transition-all duration-300",
      className
    )}
    style={{
      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
    }}
  >
    {children}
  </h2>
);

// Enhanced Button with Y2K metallic styling
export const MetallicButton = React.forwardRef(({ 
  children, 
  variant = 'primary',
  size = 'default',
  className,
  ...props 
}, ref) => {
  const baseStyles = "relative group overflow-hidden rounded-2xl transition-all duration-300";
  const variantStyles = {
    primary: "text-cosmic shadow-lg",
    secondary: "text-sage shadow-lg",
    outline: "text-earth shadow-md",
    ghost: "hover:bg-stone/5 text-cosmic"
  };
  const sizeStyles = {
    default: "px-6 py-3",
    sm: "px-4 py-2 text-sm",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        "transform hover:scale-[1.02] active:scale-[0.98]",
        "hover:shadow-xl active:shadow-inner",
        className
      )}
      style={{
        [y2kMetalGradient]: true,
        boxShadow: `
          0 2px 4px rgba(0,0,0,0.1),
          inset 0 1px 2px rgba(255,255,255,0.9),
          inset 0 -1px 1px rgba(0,0,0,0.1)
        `
      }}
      {...props}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 55%, transparent 100%)',
          transform: 'translateX(-100%)',
          animation: 'shine 2s infinite'
        }}
      />
      <div className="relative flex items-center justify-center gap-2">
        {children}
      </div>
    </button>
  );
});

MetallicButton.displayName = 'MetallicButton';

// Enhanced Card with Y2K styling
export const MetallicCard = ({ children, className }) => (
  <div
    className={cn(
      "rounded-3xl backdrop-blur-md",
      "shadow-xl",
      className
    )}
    style={{
      [y2kMetalGradient]: true,
      boxShadow: `
        0 4px 6px rgba(0,0,0,0.1),
        inset 0 1px 2px rgba(255,255,255,0.9),
        inset 0 -1px 1px rgba(0,0,0,0.1)
      `
    }}
  >
    {children}
  </div>
);

// Enhanced Input with Y2K styling
export const MetallicInput = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full px-6 py-3 rounded-2xl",
      "text-earth placeholder:text-dove/70",
      "focus:outline-none focus:ring-2 focus:ring-cosmic/30",
      "transition-all duration-200",
      className
    )}
    style={{
      [y2kInsetGradient]: true,
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), inset 0 -1px 1px rgba(255,255,255,0.7)'
    }}
    {...props}
  />
));

MetallicInput.displayName = 'MetallicInput';

// Enhanced Slider with Y2K styling
export const MetallicSlider = ({ value, min, max, step, onChange, className }) => {
  const handleRef = useRef(null);
  const trackRef = useRef(null);
  const isDragging = useRef(false);

  const updateSliderValue = useCallback((clientX) => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newValue = Math.round((percentage * (max - min) + min) / step) * step;
      onChange({ target: { value: newValue } });
    }
  }, [min, max, step, onChange]);

  const handleMouseDown = useCallback((e) => {
    isDragging.current = true;
    updateSliderValue(e.clientX);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [updateSliderValue]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging.current) {
      updateSliderValue(e.clientX);
    }
  }, [updateSliderValue]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="relative w-full h-12 flex items-center px-2">
      <div 
        ref={trackRef}
        className="absolute h-4 w-full rounded-full"
        style={{
          background: 'linear-gradient(to right, #D1D1D1, #E6E6E6)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        <div
          className="absolute h-full rounded-full"
          style={{
            width: `${((value - min) / (max - min)) * 100}%`,
            background: 'linear-gradient(to right, rgba(62,84,184,0.3), rgba(62,84,184,0.2))'
          }}
        />
      </div>

      <div 
        ref={handleRef}
        className="absolute w-8 h-8 rounded-full cursor-pointer transform -translate-y-1/2 top-1/2 hover:scale-110 transition-transform"
        style={{
          left: `calc(${((value - min) / (max - min)) * 100}% - 16px)`,
          [y2kMetalGradient]: true,
          boxShadow: `
            0 2px 4px rgba(0,0,0,0.2),
            inset 0 1px 2px rgba(255,255,255,0.9),
            inset 0 -1px 1px rgba(0,0,0,0.1)
          `
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

// Typing animation container with Y2K glow effect
export const TypewriterText = ({ children, className }) => {
  const [displayText, setDisplayText] = useState('');
  const textRef = useRef(children?.toString() || '');
  const indexRef = useRef(0);
  const isTypingRef = useRef(false);

  useEffect(() => {
    const newText = children?.toString() || '';
    
    // Only restart if content actually changes
    if (textRef.current !== newText) {
      textRef.current = newText;
      indexRef.current = 0;
      setDisplayText('');
      isTypingRef.current = true;
    }

    if (isTypingRef.current && indexRef.current < textRef.current.length) {
      const timeout = setTimeout(() => {
        indexRef.current++;
        setDisplayText(textRef.current.slice(0, indexRef.current));
      }, 30);

      return () => clearTimeout(timeout);
    } else {
      isTypingRef.current = false;
    }
  }, [children]);

  return (
    <div 
      className={cn(
        "font-mono text-earth/90 rounded-2xl p-6",
        "animate-pulse-subtle",
        className
      )}
      style={{
        background: '#FFF8CE',
        boxShadow: `
          0 0 10px rgba(255,248,206,0.3),
          inset 0 0 20px rgba(255,248,206,0.2)
        `,
        animation: 'glow 2s infinite ease-in-out'
      }}
    >
      {displayText}
      {isTypingRef.current && (
        <span className="animate-pulse text-cosmic">|</span>
      )}
    </div>
  );
};

// Alert component with Y2K styling
export const MetallicAlert = ({ children, variant = 'info', className }) => {
  const variantStyles = {
    info: "border-cosmic/30",
    success: "border-sage/30",
    warning: "border-yellow-500/30",
    error: "border-burgundy/30"
  };

  return (
    <div 
      className={cn(
        "rounded-2xl p-6",
        "border backdrop-blur-sm",
        variantStyles[variant],
        className
      )}
      style={{
        [y2kInsetGradient]: true,
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), inset 0 -1px 1px rgba(255,255,255,0.7)'
      }}
    >
      {children}
    </div>
  );
};

// Add keyframe animations to your globals.css
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes shine {
      0% {
        transform: translateX(-100%);
      }
      60% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 10px rgba(255,248,206,0.3), inset 0 0 20px rgba(255,248,206,0.2);
      }
      50% {
        box-shadow: 0 0 15px rgba(255,248,206,0.4), inset 0 0 25px rgba(255,248,206,0.3);
      }
    }

    .animate-pulse-subtle {
      animation: pulse 3s infinite ease-in-out;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.9;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
