/**
 * GA4 Custom Event Tracking
 * Uses the global gtag function loaded via index.html (G-ZNPPSC16XH).
 */
export function trackEvent(eventName, params = {}) {
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }
}

/**
 * Send a virtual page_view to GA4 for SPA navigation.
 * Call this on tab changes so GA4 "Pages and Screens" report shows activity.
 */
export function trackPageView(pagePath, pageTitle) {
  if (window.gtag) {
    window.gtag("config", "G-ZNPPSC16XH", {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
}
