import React from "react";
import { cn } from "../../utils/cn";

export const Slider = ({ value, min, max, step, onValueChange, className }) => (
  <div className={cn("relative flex w-full items-center", className)}>
    {/* Track */}
    <div className="relative w-full h-4 rounded-full bg-gray-200 shadow-inner">
      <div
        className="absolute h-full rounded-full bg-gradient-to-r from-blue-300 to-blue-500"
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
        "absolute w-full h-4 cursor-pointer",
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8",
        "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br",
        "[&::-webkit-slider-thumb]:from-white [&::-webkit-slider-thumb]:to-blue-400",
        "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:shadow-lg",
        "[&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-300",
        "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8",
        "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-br",
        "[&::-moz-range-thumb]:from-white [&::-moz-range-thumb]:to-blue-400",
        "[&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:shadow-lg",
        "[&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-300"
      )}
    />
  </div>
);
