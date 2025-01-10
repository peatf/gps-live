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

  // Set up ResizeObserver to monitor content changes
  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(document.body);

  // Set up MutationObserver for DOM changes
  const mutationObserver = new MutationObserver(handleResize);
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  // Adjust height on window load
  window.addEventListener('load', handleResize);

  // Add scroll event to ensure iframe resizes dynamically
  window.addEventListener('scroll', handleResize);

  // Clean up observers and event listeners
  return () => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    window.removeEventListener('load', handleResize);
    window.removeEventListener('scroll', handleResize);
    if (timeoutId) clearTimeout(timeoutId);
  };
};

export const sendMessageToParent = (message) => {
  window.parent.postMessage(message, '*');
};

export const listenForParentMessages = (callback) => {
  const handler = (event) => {
    // Add origin check in production for security
    callback(event.data);
  };

  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
};
