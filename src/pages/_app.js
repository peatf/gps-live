import '../styles/globals.css';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { useEffect } from 'react';
import { setupIframeResizing } from '../utils/iframeUtils';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const cleanup = setupIframeResizing();
    return cleanup;
  }, []);

  return (
    <div className="app-container">
      <ResponsiveContainer>
        <Component {...pageProps} />
      </ResponsiveContainer>
    </div>
  );
}

export default MyApp;
