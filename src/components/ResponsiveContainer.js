import React from 'react';

const ResponsiveContainer = ({ children }) => {
  return (
    <div className="w-full h-full overflow-x-hidden overscroll-none">
      <div className="w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveContainer;
