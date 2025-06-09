// Generate a session ID if none exists
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Main tracking function
export const track = (eventName, metadata = {}) => {
  // Always log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Tracking] ${eventName}`, metadata);
  }

  // Check if tracking is enabled (cookie consent or essential tracking allowed)
  const trackingConsent = localStorage.getItem('cookieConsent');
  if (trackingConsent !== 'true' && trackingConsent !== 'partial') {
    return;
  }

  const payload = {
    eventName,
    metadata: {
      ...metadata,
      path: window.location.pathname,
      search: window.location.search,
      screen: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      // Add any user ID if available
      userId: localStorage.getItem('userId') || metadata.userId
    }
  };

  // Use sendBeacon if available, otherwise use fetch with keepalive
  const url = 'https://sublime-magic-production.up.railway.app/api/analytics/track';
  const data = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, data);
    } else {
      fetch(url, {
        method: 'POST',
        body: data,
        keepalive: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(e => console.error('Tracking error:', e));
    }
  } catch (e) {
    console.error('Tracking failed:', e);
  }
};

// Initialize automatic tracking
export const initTracking = () => {
  const sessionId = getSessionId();
  
  // Track initial page view
  track('page_view', {
    referrer: document.referrer,
    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
  });

  // Track time on page
  let pageEnterTime = Date.now();
  window.addEventListener('beforeunload', () => {
    track('page_time', {
      duration: (Date.now() - pageEnterTime) / 1000,
      sessionDuration: (Date.now() - parseInt(localStorage.getItem('sessionStart') || Date.now())) / 1000
    });
  });

  // Store session start time
  if (!localStorage.getItem('sessionStart')) {
    localStorage.setItem('sessionStart', Date.now());
  }
};

// Backward compatibility
export const trackEvent = track;

// Export all tracking functions
export default {
  track,
  trackEvent,
  initTracking
};