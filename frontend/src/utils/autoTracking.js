export const setupAutoTracking = () => {
  if (localStorage.getItem('cookieConsent') !== 'true') return;

  // Track all external links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="http"]');
    if (link && !link.href.includes(window.location.host)) {
      trackEvent('external_link_click', {
        href: link.href,
        text: link.textContent?.trim()
      });
    }
  });

  // Track video interactions
  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => {
      trackEvent('video_play', {
        video_id: video.id || null,
        src: video.currentSrc
      });
    });
  });

  // Track tab changes
  document.querySelectorAll('[role="tab"]').forEach(tab => {
    tab.addEventListener('click', () => {
      trackEvent('tab_change', {
        tab_id: tab.id || null,
        tab_name: tab.textContent?.trim()
      });
    });
  });
};