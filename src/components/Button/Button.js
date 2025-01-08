import React from "react";

export const Button = ({ children, onClick, disabled, variant = "default" }) => {
  const baseStyle =
    "px-4 py-2 rounded text-white font-medium transition focus:outline-none focus:ring";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300",
    outline: "bg-transparent border border-gray-300 text-gray-600 hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};
