import React from "react";

export const Input = ({ type, value, onChange, className }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className={`border rounded px-3 py-2 w-full ${className || ""}`}
  />
);

