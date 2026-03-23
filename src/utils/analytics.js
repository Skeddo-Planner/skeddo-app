/**
 * GA4 Custom Event Tracking
 * Uses the global gtag function loaded via index.html (G-DECM7CCHLC).
 */
export function trackEvent(eventName, params = {}) {
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }
}
