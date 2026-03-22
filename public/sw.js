/* Skeddo Service Worker — PWA install + Push Notifications */

/* Activate immediately — don't wait for old service worker to release */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* Fetch handler (required by Chrome for PWA install eligibility).
   Uses network-first strategy with offline fallback. */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // If network fails and this is a navigation request, show a basic offline page
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
      // For non-navigation requests (images, API calls), just let them fail
      return new Response("", { status: 503, statusText: "Offline" });
    })
  );
});

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
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Otherwise open a new window
      return clients.openWindow(url);
    })
  );
});
