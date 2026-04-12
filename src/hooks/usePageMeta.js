import { useEffect } from "react";

/**
 * Sets document.title, meta description, canonical URL, and OG tags for the current page.
 * Cleans up on unmount by restoring defaults.
 *
 * @param {{ title?: string, description?: string, canonical?: string, ogImage?: string }} opts
 */
export default function usePageMeta({ title, description, canonical, ogImage } = {}) {
  useEffect(() => {
    const prevTitle = document.title;

    if (title) {
      document.title = title;
    }

    const setMeta = (selector, attr, value) => {
      if (!value) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        // Determine if we set "name" or "property"
        if (selector.startsWith('meta[property')) {
          el.setAttribute("property", selector.match(/property="([^"]+)"/)[1]);
        } else {
          el.setAttribute("name", selector.match(/name="([^"]+)"/)[1]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }

    if (title) {
      setMeta('meta[property="og:title"]', "content", title);
      setMeta('meta[name="twitter:title"]', "content", title);
    }

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);

      setMeta('meta[property="og:url"]', "content", canonical);
    }

    if (ogImage) {
      setMeta('meta[property="og:image"]', "content", ogImage);
      setMeta('meta[name="twitter:image"]', "content", ogImage);
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, canonical, ogImage]);
}
