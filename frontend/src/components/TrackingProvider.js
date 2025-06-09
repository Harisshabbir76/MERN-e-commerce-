import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent as track } from '../utils/tracking';



export default function TrackingProvider({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Track initial page view
    track('page_view', {
      path: location.pathname,
      search: location.search,
      referrer: document.referrer
    });

    // Track scroll depth
    let maxScroll = 0;
    const scrollHandler = () => {
      const currentScroll = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (currentScroll > maxScroll) {
        maxScroll = currentScroll;
        if (maxScroll > 0.25 && maxScroll % 0.25 < 0.05) { // Report every 25%
          track('scroll_depth', { percent: Math.round(maxScroll * 100) });
        }
      }
    };
    window.addEventListener('scroll', scrollHandler);

    // Track important element clicks
    const clickHandler = (e) => {
      const trackedElement = e.target.closest('[data-track]');
      if (trackedElement) {
        track(trackedElement.dataset.track, {
          ...(trackedElement.dataset.trackMeta ? JSON.parse(trackedElement.dataset.trackMeta) : {}),
          text: trackedElement.textContent?.trim(),
          id: trackedElement.id || null
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