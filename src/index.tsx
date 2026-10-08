import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import ConsentPage from './oauth/ConsentPage';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const isOAuthConsent = window.location.pathname === "/oauth/consent";

root.render(
  <React.StrictMode>
    <HelmetProvider>
      {isOAuthConsent ? <ConsentPage /> : <App />}
      <Analytics />
    </HelmetProvider>
  </React.StrictMode>,
);
