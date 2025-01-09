// src/components/ResponsiveContainer.js
import React from 'react';

const ResponsiveContainer = ({ children }) => {
  return (
    <div className="w-full">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveContainer;
