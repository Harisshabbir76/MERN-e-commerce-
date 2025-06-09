import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './components/CartContext';
import TrackingProvider from './components/TrackingProvider';
import CookieBanner from './components/CookieBanner';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TrackingProvider>
        <CookieBanner />
        <CartProvider>
          <App />
        </CartProvider>
      </TrackingProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Optional: Track web vitals
reportWebVitals((metric) => {
  if (localStorage.getItem('cookieConsent') === 'true') {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'web_vitals',
        metadata: {
          name: metric.name,
          value: metric.value,
          rating: metric.rating
        }
      })
    });
  }
});