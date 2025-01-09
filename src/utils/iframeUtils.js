// src/utils/iframeUtils.js

export const setupIframeResizing = (callback) => {
  let timeoutId;

  const handleResize = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'resize', height }, '*');
      if (callback) callback(height);
    }, 100);
  };

  // Set up ResizeObserver
  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(document.body);

  // Set up mutation observer for DOM changes
  const mutationObserver = new MutationObserver(handleResize);
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });

  // Handle initial load
  window.addEventListener('load', handleResize);

  // Clean up function
  return () => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    window.removeEventListener('load', handleResize);
    if (timeoutId) clearTimeout(timeoutId);
  };
};

export const sendMessageToParent = (message) => {
  window.parent.postMessage(message, '*');
};

export const listenForParentMessages = (callback) => {
  const handler = (event) => {
    // Add origin check in production
    callback(event.data);
  };

  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
};
