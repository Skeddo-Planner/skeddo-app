import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { sharedActivityId, reason } = req.body;
  if (!sharedActivityId) return res.status(400).json({ error: "sharedActivityId is required" });

  const sb = getSupabaseClient(user._token);

  // Verify user is a member of the circle containing this activity
  const { data: activity } = await sb
    .from("shared_activities")
    .select("circle_id")
    .eq("id", sharedActivityId)
    .single();

  if (!activity) return res.status(404).json({ error: "Activity not found" });

  const { data: membership } = await sb
    .from("circle_memberships")
    .select("status")
    .eq("circle_id", activity.circle_id)
    .eq("user_id", user.id)
    .single();

  if (!membership || membership.status !== "approved") {
    return res.status(403).json({ error: "Not a member of this circle" });
  }

  // Check for duplicate flag by same user
  const { data: existing } = await sb
    .from("activity_flags")
    .select("id")
    .eq("shared_activity_id", sharedActivityId)
    .eq("flagged_by", user.id)
    .single();

  if (existing) return res.status(400).json({ error: "Already flagged" });

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
