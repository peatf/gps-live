// src/components/ResponsiveContainer.js
import React from 'react';

const ResponsiveContainer = ({ children }) => {
  return (
    <div className="w-full">
      <div className="w-full px-4 py-8">{children}</div>
    </div>
  );
};

export default ResponsiveContainer;
