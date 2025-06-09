// src/components/TrackingProvider.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '../utils/tracking';

export default function TrackingProvider({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    track('page_view', {
      path: location.pathname,
      search: location.search
    });

    // Auto-track scroll depth
    let maxScroll = 0;
    const scrollHandler = () => {
      const currentScroll = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (currentScroll > maxScroll) {
        maxScroll = currentScroll;
        track('scroll_depth', { percent: Math.round(maxScroll * 100) });
      }
    };
    window.addEventListener('scroll', scrollHandler);

    // Auto-track important elements
    const clickHandler = (e) => {
      const el = e.target.closest('[data-track]');
      if (el) {
        track(el.dataset.track, {
          ...JSON.parse(el.dataset.trackMeta || '{}'),
          text: el.textContent?.trim()
        });
      }
    };
    document.addEventListener('click', clickHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      document.removeEventListener('click', clickHandler);
    };
  }, [location]);

  return children;
}