import { lazy } from "react";

/**
 * Wraps React.lazy() to handle stale chunk errors after deployments.
 *
 * When a new build is deployed, old cached HTML may reference chunk filenames
 * that no longer exist. This wrapper catches ANY import failure and reloads
 * the page once so the browser fetches the new HTML + correct chunks.
 *
 * A sessionStorage flag prevents infinite reload loops.
 */
export default function lazyWithReload(importFn) {
  return lazy(() =>
    importFn().catch((error) => {
      const key = "skeddo-chunk-reload";
      const hasReloaded = sessionStorage.getItem(key);

      if (!hasReloaded) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
        // Return a never-resolving promise so React doesn't render an error
        // while the page is reloading.
        return new Promise(() => {});
      }

      // Already reloaded once and it still fails — re-throw.
      throw error;
    })
  );
}
