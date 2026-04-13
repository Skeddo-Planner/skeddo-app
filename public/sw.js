/* Skeddo Service Worker — PWA install + Push Notifications + Program cache */

const PROGRAMS_CACHE = "skeddo-programs-v2";
const PROGRAMS_URL   = "/api/programs";
const PROGRAMS_TTL   = 4 * 60 * 60 * 1000; // 4 hours — was 24h, reduced so new data shows faster

/* Activate immediately — don't wait for old service worker to release */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  // Delete old program caches so stale data doesn't persist across versions
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n.startsWith("skeddo-programs-") && n !== PROGRAMS_CACHE)
          .map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

/* Fetch handler — uses network-first globally, stale-while-revalidate for programs */
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Programs API: serve from cache if fresh, always revalidate in background
  if (url.pathname === PROGRAMS_URL && event.request.method === "GET") {
    event.respondWith(staleWhileRevalidatePrograms(event.request));
    return;
  }

  // All other requests: network-first with offline fallback
  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.mode === "navigate") {
        return new Response(
          '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Skeddo — Offline</title></head>' +
          '<body style="font-family:Barlow,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#F8F9FA;margin:0;text-align:center;padding:24px">' +
          '<div><h1 style="font-size:22px;color:#1B2432;margin-bottom:8px">You\'re offline</h1>' +
          '<p style="color:#4A6FA5;font-size:15px;line-height:1.6">Skeddo needs an internet connection to load your data. Please check your connection and try again.</p>' +
          '<button onclick="location.reload()" style="margin-top:16px;background:#2D9F6F;color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:15px;font-weight:700;cursor:pointer">Retry</button>' +
          '</div></body></html>',
          { status: 503, headers: { "Content-Type": "text/html" } }
        );
      }
      return new Response("", { status: 503, statusText: "Offline" });
    })
  );
});

/**
 * Stale-while-revalidate for the programs catalog.
 * - Returns cached response immediately if it exists and is < 24h old.
 * - Always kicks off a background network fetch to refresh the cache.
 * - First-ever load falls back to network (no cache yet).
 */
async function staleWhileRevalidatePrograms(request) {
  const cache = await caches.open(PROGRAMS_CACHE);
  const cached = await cache.match(request);

  const now = Date.now();
  const cachedAt = cached
    ? Number(cached.headers.get("x-sw-cached-at") || 0)
    : 0;
  const isFresh = cached && (now - cachedAt) < PROGRAMS_TTL;

  // Background revalidation (always, regardless of freshness)
  const revalidate = fetch(request)
    .then(async (networkRes) => {
      if (networkRes.ok) {
        // Clone the response and stamp it with our cache time
        const body = await networkRes.clone().arrayBuffer();
        const headers = new Headers(networkRes.headers);
        headers.set("x-sw-cached-at", String(Date.now()));
        const stamped = new Response(body, { status: networkRes.status, headers });
        await cache.put(request, stamped);
      }
      return networkRes;
    })
    .catch(() => null);

  if (isFresh) {
    // Serve stale immediately, revalidate in background
    revalidate; // fire and forget
    return cached;
  }

  // No fresh cache — wait for network
  const networkRes = await revalidate;
  if (networkRes && networkRes.ok) {
    // Return a fresh clone from the cache (we already stored it above)
    const fresh = await cache.match(request);
    return fresh || networkRes;
  }

  // Network failed — return stale cache if we have anything
  if (cached) return cached;

  // Nothing — let it fail naturally
  return fetch(request);
}

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Skeddo", body: event.data.text() };
  }

  const options = {
    body: payload.body || "",
    icon: payload.icon || "/icon-192.png",
    badge: "/icon-192.png",
    data: payload.data || { url: "/" },
    vibrate: [100, 50, 100],
    tag: payload.data?.type || "skeddo-notification",
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || "Skeddo", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
