// src/utils/tracking.js

// Main tracking function
export const track = (eventName, metadata = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Tracking] ${eventName}`, metadata);
    return;
  }

  if (localStorage.getItem('cookieConsent') !== 'true') return;

  const payload = {
    eventName,
    metadata: {
      ...metadata,
      path: window.location.pathname,
      search: window.location.search,
      screen: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }
  };

  // Use sendBeacon for reliable delivery
  navigator.sendBeacon('/api/analytics/track', JSON.stringify(payload));
};

// Alias for track (for backward compatibility)
export const trackEvent = track;

// Specialized search tracking
export const trackSearch = {
  query: (query, source) => track('search_query', { query, source }),
  results: (query, results) => track('search_results', { 
    query,
    result_count: results.length,
    top_categories: [...new Set(results.map(p => p.category))].slice(0, 3)
  }),
  click: (query, product, position) => track('search_result_click', {
    query,
    product_id: product._id,
    product_name: product.name,
    position,
    price: product.price
  }),
  error: (query, error) => track('search_error', { query, error })
};

// Initialize automatic tracking
export const initTracking = () => {
  if (localStorage.getItem('cookieConsent') === 'true') {
    // Track time on page
    let pageEnterTime = Date.now();
    window.addEventListener('beforeunload', () => {
      track('page_time', {
        duration: (Date.now() - pageEnterTime) / 1000
      });
    });
  }
};

// Default export
export default {
  track,
  trackEvent,
  trackSearch,
  initTracking
};