import React from 'react';

const ResponsiveContainer = ({ children }) => {
  return (
    <div className="responsive-wrapper">
      <div className="card-container">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveContainer;
