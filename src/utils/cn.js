import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Keep any existing utility functions you have in this file
// For example, your alignmentPrompts.js content can stay if it's here
