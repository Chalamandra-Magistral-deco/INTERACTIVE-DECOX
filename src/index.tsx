import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import { Telemetry } from './core/Telemetry';
import './index.css';

// Boot telemetría ANTES de render
Telemetry.boot();

// Captura global de errores → telemetría
window.addEventListener('error', (e) => {
  Telemetry.event('client_error', {
    msg: e.message,
    src: e.filename,
    line: e.lineno,
  });
});
window.addEventListener('unhandledrejection', (e) => {
  Telemetry.event('client_rejection', { reason: String(e.reason) });
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
      <Analytics />
    </HelmetProvider>
  </React.StrictMode>
);
