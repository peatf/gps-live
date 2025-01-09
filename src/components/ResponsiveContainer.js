// src/components/ResponsiveContainer.js
import React, { useEffect, useState } from 'react';

const ResponsiveContainer = ({ children }) => {
  const [height, setHeight] = useState('100vh');

  useEffect(() => {
    // Function to send height to parent
    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'resize', height }, '*');
    };

    // Initial height calculation
    sendHeight();

    // Set up mutation observer to watch for DOM changes
    const resizeObserver = new ResizeObserver(() => {
      sendHeight();
    });

    // Observe the document body
    resizeObserver.observe(document.body);

    // Clean up
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-cloud/80 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-8 relative">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveContainer;
