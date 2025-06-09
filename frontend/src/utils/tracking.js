// src/utils/tracking.js

export function getSessionId() {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = "sess-" + Math.random().toString(36).substring(2);
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}

export function trackEvent(eventType, metadata = {}) {
  const sessionId = getSessionId();
  const pageUrl = window.location.href;

  fetch("https://sublime-magic-production.up.railway.app/api/analytics/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventType,
      sessionId,
      pageUrl,
      userAgent: navigator.userAgent,
      metadata,
    }),
  }).catch((err) => {
    console.warn("Analytics tracking failed", err);
  });
}

export function trackPageView() {
  trackEvent("page_view");
}
