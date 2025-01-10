import '../styles/globals.css';
import { useEffect } from 'react';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { setupIframeResizing } from '../utils/iframeUtils';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const cleanup = setupIframeResizing();
    return cleanup;
  }, []);

  return (
    <div className="app-container fade-up">
      <ResponsiveContainer>
        <Component {...pageProps} />
      </ResponsiveContainer>
    </div>
  );
}

export default MyApp;
