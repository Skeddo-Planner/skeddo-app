/**
 * POST /api/push-subscribe — Save a push subscription for the authenticated user
 * DELETE /api/push-subscribe — Remove a push subscription
 */
import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const db = getSupabaseClient(user._token);

  if (req.method === "POST") {
    const { endpoint, p256dh, auth, userAgent } = req.body || {};
    if (!endpoint || !p256dh || !auth) {
      return res.status(400).json({ error: "Missing subscription fields" });
    }

    const { error } = await db
      .from("push_subscriptions")
      .upsert(
        {
          user_id: user.id,
          endpoint,
          p256dh,
          auth,
          user_agent: userAgent || null,
        },
        { onConflict: "user_id,endpoint" }
      );

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { endpoint } = req.body || {};
    if (!endpoint) return res.status(400).json({ error: "Missing endpoint" });

    const { error } = await db
      .from("push_subscriptions")
      .delete()
      .eq("user_id", user.id)
      .eq("endpoint", endpoint);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
