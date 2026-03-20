import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "../lib/supabase";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

/* Convert base64 VAPID key to Uint8Array for PushManager */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const isSupported = "serviceWorker" in navigator && "PushManager" in window;

  const [permission, setPermission] = useState(
    isSupported ? Notification.permission : "denied"
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registration, setRegistration] = useState(null);

  /* Register service worker on mount */
  useEffect(() => {
    if (!isSupported) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        setRegistration(reg);
        // Check if already subscribed
        return reg.pushManager.getSubscription();
      })
      .then((sub) => {
        setIsSubscribed(!!sub);
      })
      .catch(() => {
        // Service worker registration failed — not critical
      });
  }, [isSupported]);

  /* Subscribe to push notifications */
  const subscribe = useCallback(async () => {
    if (!isSupported || !registration || !user) return false;

    setLoading(true);
    try {
      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setLoading(false);
        return false;
      }

      // Subscribe via Push API
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subJson = subscription.toJSON();

      // Save to backend
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      await fetch("/api/push-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          p256dh: subJson.keys.p256dh,
          auth: subJson.keys.auth,
          userAgent: navigator.userAgent,
        }),
      });

      setIsSubscribed(true);
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      return false;
    }
  }, [isSupported, registration, user]);

  /* Unsubscribe from push notifications */
  const unsubscribe = useCallback(async () => {
    if (!registration || !user) return false;

    setLoading(true);
    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();

        // Remove from backend
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        await fetch("/api/push-subscribe", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ endpoint }),
        });
      }

      setIsSubscribed(false);
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      return false;
    }
  }, [registration, user]);

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    subscribe,
    unsubscribe,
  };
}
