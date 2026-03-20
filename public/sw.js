/* Skeddo Service Worker — PWA install + Push Notifications */

/* Fetch handler (required by Chrome for PWA install eligibility).
   Uses network-first strategy — no offline caching, just passes through. */
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
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
