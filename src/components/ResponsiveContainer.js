// src/components/ResponsiveContainer.js
import React, { useEffect, useRef } from 'react';
import _ from 'lodash';

const ResponsiveContainer = ({ children }) => {
  const lastHeight = useRef(0);
  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    const sendHeight = () => {
      const currentHeight = document.documentElement.scrollHeight;
      
      // Prevent excessive height growth and tiny changes
      if (
        currentHeight !== lastHeight.current && 
        currentHeight < 20000 && // Maximum reasonable height
        Math.abs(currentHeight - lastHeight.current) > 10 // Minimum change threshold
      ) {
        lastHeight.current = currentHeight;
        window.parent.postMessage({ type: 'resize', height: currentHeight }, '*');
      }
    };

    // Debounced resize handler
    const debouncedSendHeight = _.debounce(sendHeight, 250);

    // Set up resize observer with debouncing
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(debouncedSendHeight, 100);
    });

    // Observe the document body
    resizeObserver.observe(document.body);

    // Initial height calculation
    setTimeout(sendHeight, 100);

    // Clean up
    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full bg-cloud/80 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-8 relative">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveContainer;
