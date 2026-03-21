import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { sharedActivityId, reason } = req.body;
  if (!sharedActivityId) return res.status(400).json({ error: "sharedActivityId is required" });

  const sb = getSupabaseClient(user._token);

  const { error } = await sb
    .from("activity_flags")
    .insert({
      shared_activity_id: sharedActivityId,
      flagged_by: user.id,
      reason: reason || "Reported as outdated",
    });

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}
