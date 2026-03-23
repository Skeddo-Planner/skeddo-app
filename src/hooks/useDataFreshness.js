import { useState, useEffect, useCallback } from "react";

/* ─── REFRESH FREQUENCY RECOMMENDATIONS ─── */
export const REFRESH_INTERVALS = {
  programListings: 30 * 24 * 60 * 60 * 1000,   // Monthly — names, providers, descriptions rarely change
  datesAndTimes:    7 * 24 * 60 * 60 * 1000,   // Weekly  — schedules can shift
  costPricing:      7 * 24 * 60 * 60 * 1000,   // Weekly  — prices may change with early-bird deadlines
  enrollmentStatus: 1 * 24 * 60 * 60 * 1000,   // Daily   — spots fill fast during registration season
  registrationUrls: 30 * 24 * 60 * 60 * 1000,  // Monthly — URLs are stable
};

/* ─── CONSTANTS ─── */
const STORAGE_KEY = "skeddo-data-freshness";
const STALE_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 days — show "check for updates" nudge
const CHECK_THRESHOLD = 24 * 60 * 60 * 1000;     // 24 hours — auto-stale detection on load

/* ─── HOOK ─── */
export function useDataFreshness() {
  const dataVersion = "March 22, 2026";

  const [lastChecked, setLastChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? Number(saved) : null;
    } catch {
      return null;
    }
  });
  const [isChecking, setIsChecking] = useState(false);

  /* Determine staleness */
  const isStale = lastChecked
    ? Date.now() - lastChecked > STALE_THRESHOLD
    : true; // never checked = treat as stale

  const isAutoStale = lastChecked
    ? Date.now() - lastChecked > CHECK_THRESHOLD
    : true;

  /* Persist lastChecked to localStorage */
  useEffect(() => {
    if (lastChecked != null) {
      try {
        localStorage.setItem(STORAGE_KEY, String(lastChecked));
      } catch {
        /* storage full — silently fail */
      }
    }
  }, [lastChecked]);

  /* Set initial timestamp if first time */
  useEffect(() => {
    if (lastChecked == null) {
      const now = Date.now();
      setLastChecked(now);
    }
  }, [lastChecked]);

  /* Check for updates (simulated — no API call from browser yet) */
  const checkForUpdates = useCallback(() => {
    setIsChecking(true);

    // Simulate a brief network check (will be replaced with real API call in v2)
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = Date.now();
        setLastChecked(now);
        setIsChecking(false);
        resolve({
          lastChecked: now,
          isStale: false,
          dataVersion,
        });
      }, 1200);
    });
  }, [dataVersion]);

  /* Human-readable "last checked" string */
  const lastCheckedLabel = lastChecked
    ? formatRelativeTime(lastChecked)
    : "Never";

  return {
    lastChecked,
    lastCheckedLabel,
    isStale,
    isAutoStale,
    isChecking,
    checkForUpdates,
    dataVersion,
  };
}

/* ─── HELPER: relative time formatting ─── */
function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  // Fall back to a readable date
  return new Date(timestamp).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
