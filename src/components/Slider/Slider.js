// src/components/Slider/Slider.js
import React from "react";
import { cn } from "../../utils/cn";  // Fixed import path

export const Slider = ({ value, min, max, step, onValueChange, className }) => {
  return (
    <div className="relative flex w-full touch-none select-none items-center">
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute h-full bg-primary-600 transition-all"
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
          "[&::-webkit-slider-thumb]:bg-primary-600",
          "[&::-webkit-slider-thumb]:border-2",
          "[&::-webkit-slider-thumb]:border-white",
          "[&::-webkit-slider-thumb]:transition-colors",
          "[&::-webkit-slider-thumb]:hover:bg-primary-700",
          "[&::-moz-range-thumb]:h-4",
          "[&::-moz-range-thumb]:w-4",
          "[&::-moz-range-thumb]:appearance-none",
          "[&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:bg-primary-600",
          "[&::-moz-range-thumb]:border-2",
          "[&::-moz-range-thumb]:border-white",
          "[&::-moz-range-thumb]:transition-colors",
          "[&::-moz-range-thumb]:hover:bg-primary-700",
          className
        )}
      />
    </div>
  );
};
