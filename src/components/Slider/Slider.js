import React, { useRef, useCallback, useEffect } from "react";
import { cn } from "../../utils/cn";

export const Slider = ({ value, min, max, step, onValueChange, className }) => {
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const calculateValue = useCallback((clientX) => {
    if (!sliderRef.current) return value[0];

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = percentage * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(max, Math.max(min, steppedValue));
  }, [min, max, step, value]);

  const handleMove = useCallback((clientX) => {
    if (isDragging.current) {
      const newValue = calculateValue(clientX);
      onValueChange([newValue]);
    }
  }, [calculateValue, onValueChange]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    handleMove(e.clientX);

    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMove]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    handleMove(e.touches[0].clientX);

    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);
    const handleTouchEnd = () => {
      isDragging.current = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [handleMove]);

  return (
    <div 
      ref={sliderRef}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
    >
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-stone/30 glass-effect">
        <div
          className="absolute h-full bg-cosmic/80 transition-all duration-200"
          style={{
            width: `${((value[0] - min) / (max - min)) * 100}%`
          }}
        />
      </div>
      <input
        type="range"
        value={value[0]}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onValueChange([parseInt(e.target.value)])}
        className={cn(
          "absolute h-2 w-full cursor-pointer appearance-none bg-transparent",
          "[&::-webkit-slider-thumb]:h-4",
          "[&::-webkit-slider-thumb]:w-4",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-cosmic",
          "[&::-webkit-slider-thumb]:border-2",
          "[&::-webkit-slider-thumb]:border-white",
          "[&::-webkit-slider-thumb]:transition-all",
          "[&::-webkit-slider-thumb]:duration-200",
          "[&::-webkit-slider-thumb]:hover:bg-cosmic-light",
          "[&::-webkit-slider-thumb]:hover:scale-110",
          "[&::-webkit-slider-thumb]:glass-effect",
          "[&::-moz-range-thumb]:h-4",
          "[&::-moz-range-thumb]:w-4",
          "[&::-moz-range-thumb]:appearance-none",
          "[&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:bg-cosmic",
          "[&::-moz-range-thumb]:border-2",
          "[&::-moz-range-thumb]:border-white",
          "[&::-moz-range-thumb]:transition-all",
          "[&::-moz-range-thumb]:duration-200",
          "[&::-moz-range-thumb]:hover:bg-cosmic-light",
          "[&::-moz-range-thumb]:hover:scale-110",
          "[&::-moz-range-thumb]:glass-effect"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
    </div>
  );
};
