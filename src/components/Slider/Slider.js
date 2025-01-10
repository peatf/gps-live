import React from "react";
import { cn } from "../../utils/cn";

export const Slider = ({ value, min, max, step, onValueChange, className }) => (
  <div className={cn("relative flex w-full items-center", className)}>
    {/* Track */}
    <div className="relative w-full h-3 rounded-full bg-gray-200 shadow-inner">
      <div
        className="absolute h-full bg-gradient-to-r from-blue-300 to-blue-500 rounded-full"
        style={{
          width: `${((value[0] - min) / (max - min)) * 100}%`,
        }}
      />
    </div>

    {/* Thumb */}
    <input
      type="range"
      value={value[0]}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
      className={cn(
        "absolute w-full h-3 opacity-0", // Invisible input for interaction
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6",
        "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br",
        "[&::-webkit-slider-thumb]:from-silver-300 [&::-webkit-slider-thumb]:to-silver-500",
        "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:shadow-lg",
        "[&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-300",
        "[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white",
        "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6",
        "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-br",
        "[&::-moz-range-thumb]:from-silver-300 [&::-moz-range-thumb]:to-silver-500",
        "[&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:shadow-lg",
        "[&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-300",
        "[&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white"
      )}
    />
  </div>
);

