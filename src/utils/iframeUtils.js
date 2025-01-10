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

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(document.body);

  const mutationObserver = new MutationObserver(handleResize);
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  window.addEventListener('load', handleResize);

  return () => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    window.removeEventListener('load', handleResize);
    if (timeoutId) clearTimeout(timeoutId);
  };
};
