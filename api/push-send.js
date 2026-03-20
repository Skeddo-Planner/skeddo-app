/**
 * POST /api/push-send — Send a push notification to a specific user
 * Internal endpoint — authenticated via PUSH_INTERNAL_SECRET header
 *
 * Body: { userId, title, body, url, type, referenceId }
 */
import webpush from "web-push";
import { getSupabaseClient, handleCors } from "./_helpers.js";

const VAPID_PUBLIC = process.env.VITE_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const PUSH_SECRET = process.env.PUSH_INTERNAL_SECRET;

webpush.setVapidDetails(
  "mailto:skeddo.planner@gmail.com",
  VAPID_PUBLIC,
  VAPID_PRIVATE
);

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Authenticate via internal secret
  const secret = req.headers["x-push-secret"];
  if (secret !== PUSH_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { userId, title, body, url, type, referenceId } = req.body || {};
  if (!userId || !title) {
    return res.status(400).json({ error: "Missing userId or title" });
  }

  const db = getSupabaseClient(); // admin client

  // Check if already sent (prevent duplicates)
  if (referenceId && type) {
    const { data: existing } = await db
      .from("notification_log")
      .select("id")
      .eq("user_id", userId)
      .eq("type", type)
      .eq("reference_id", referenceId)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(200).json({ ok: true, skipped: true, reason: "already_sent" });
    }
  }

  // Get all push subscriptions for this user
  const { data: subscriptions, error: subError } = await db
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (subError) return res.status(500).json({ error: subError.message });
  if (!subscriptions || subscriptions.length === 0) {
    return res.status(200).json({ ok: true, sent: 0, reason: "no_subscriptions" });
  }

  const payload = JSON.stringify({
    title,
    body: body || "",
    icon: "/icon-192.png",
    data: { url: url || "/", type: type || "general" },
  });

  let sent = 0;
  const stale = [];

  for (const sub of subscriptions) {
    const pushSub = {
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth },
    };

    try {
      await webpush.sendNotification(pushSub, payload);
      sent++;
    } catch (err) {
      // 410 Gone or 404 = subscription expired, clean it up
      if (err.statusCode === 410 || err.statusCode === 404) {
        stale.push(sub.id);
      }
    }
  }

  // Clean up stale subscriptions
  if (stale.length > 0) {
    await db.from("push_subscriptions").delete().in("id", stale);
  }

  // Log the notification
  if (sent > 0) {
    await db.from("notification_log").insert({
      user_id: userId,
      type: type || "general",
      reference_id: referenceId || null,
    });
  }

  return res.status(200).json({ ok: true, sent, staleRemoved: stale.length });
}
