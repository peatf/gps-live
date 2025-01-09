// src/pages/_app.js
import '../styles/globals.css';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { useEffect } from 'react';
import { setupIframeResizing } from '../utils/iframeUtils';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Set up iframe resizing
    const cleanup = setupIframeResizing();
    return cleanup;
  }, []);

  return (
    <ResponsiveContainer>
      <Component {...pageProps} />
    </ResponsiveContainer>
  );
}

export default MyApp;
