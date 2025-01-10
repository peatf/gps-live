import React from 'react';
import { cn } from '../../utils/cn';

// Typography component with all-caps Helvetica styling
export const Title = ({ children, className }) => (
  <h2 
    className={cn(
      "font-['Helvetica Neue', Helvetica, Arial] tracking-wide uppercase",
      "text-xl font-medium text-earth/90",
      className
    )}
    style={{
      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
    }}
  >
    {children}
  </h2>
);

// Enhanced Button with metallic gradient and translucent effects
export const MetallicButton = React.forwardRef(({ 
  children, 
  variant = 'primary',
  size = 'default',
  className,
  ...props 
}, ref) => {
  const baseStyles = "relative group overflow-hidden rounded-md transition-all duration-300";
  const variantStyles = {
    primary: "bg-gradient-to-br from-cosmic/90 via-cosmic/80 to-cosmic/70 text-white shadow-cosmic/20",
    secondary: "bg-gradient-to-br from-sage/90 via-sage/80 to-sage/70 text-white shadow-sage/20",
    outline: "bg-gradient-to-br from-stone/30 via-stone/20 to-stone/10 border border-stone/20 text-earth shadow-stone/10",
    ghost: "hover:bg-stone/5 text-cosmic hover:text-cosmic-dark"
  };
  const sizeStyles = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        "shadow-lg hover:shadow-xl",
        "backdrop-blur-sm",
        "transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        className
      )}
      {...props}
    >
      {/* Radial gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)'
        }}
      />
      {/* Content container */}
      <div className="relative flex items-center justify-center gap-2">
        {children}
      </div>
    </button>
  );
});

// Card with chrome-like border effect
export const MetallicCard = ({ children, className }) => (
  <div
    className={cn(
      "rounded-lg backdrop-blur-md",
      "bg-gradient-to-br from-white/5 to-transparent",
      "shadow-lg",
      className
    )}
    style={{
      boxShadow: `
        0 0 0 1px rgba(255,255,255,0.1),
        0 4px 6px -1px rgba(0,0,0,0.1),
        0 2px 4px -1px rgba(0,0,0,0.06),
        inset 0 0 0 1px rgba(255,255,255,0.05)
      `
    }}
  >
    {children}
  </div>
);

// Enhanced Input with metallic styling
export const MetallicInput = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full px-4 py-2 rounded-md",
      "bg-gradient-to-br from-white/10 to-transparent",
      "border border-stone/20",
      "backdrop-blur-sm",
      "text-earth placeholder:text-dove/70",
      "focus:outline-none focus:ring-2 focus:ring-cosmic/30",
      "transition-all duration-200",
      className
    )}
    style={{
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
    }}
    {...props}
  />
));

// Enhanced Slider with metallic styling
export const MetallicSlider = ({ value, min, max, step, onChange, className }) => (
  <div className="relative w-full h-6 flex items-center">
    <div 
      className="absolute h-2 w-full rounded-full overflow-hidden"
      style={{
        background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
      }}
    >
      <div
        className="absolute h-full bg-gradient-to-r from-cosmic/80 to-cosmic/60"
        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
      />
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className={cn(
        "absolute w-full h-2 opacity-0 cursor-pointer",
        className
      )}
    />
    <div 
      className="absolute w-4 h-4 rounded-full bg-white shadow-lg transform -translate-y-1/2 top-1/2"
      style={{ 
        left: `calc(${((value - min) / (max - min)) * 100}% - 8px)`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '2px solid rgba(255,255,255,0.9)'
      }}
    />
  </div>
);

// Typing animation container for AI responses
export const TypewriterText = ({ children, className }) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const text = React.useMemo(() => children?.toString() || '', [children]);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div className={cn(
      "font-mono text-earth/90",
      "border-l-2 border-cosmic/30 pl-4",
      className
    )}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse text-cosmic">|</span>
      )}
    </div>
  );
};

// Alert component with metallic styling
export const MetallicAlert = ({ children, variant = 'info', className }) => {
  const variantStyles = {
    info: "from-cosmic/20 to-cosmic/10 border-cosmic/30",
    success: "from-sage/20 to-sage/10 border-sage/30",
    warning: "from-yellow-500/20 to-yellow-500/10 border-yellow-500/30",
    error: "from-burgundy/20 to-burgundy/10 border-burgundy/30"
  };

  return (
    <div className={cn(
      "rounded-lg p-4",
      "bg-gradient-to-br",
      "border backdrop-blur-sm",
      variantStyles[variant],
      className
    )}>
      {children}
    </div>
  );
};
