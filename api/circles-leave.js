import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { circleId, newOwnerId } = req.body;
  if (!circleId) return res.status(400).json({ error: "circleId is required" });

  const sb = getSupabaseClient(user._token);

  // Check if user is the owner
  const { data: circle } = await sb
    .from("circles")
    .select("id, created_by")
    .eq("id", circleId)
    .single();

  if (!circle) return res.status(404).json({ error: "Circle not found" });

  if (circle.created_by === user.id) {
    // Owner must transfer ownership first
    if (!newOwnerId) {
      return res.status(400).json({ error: "As the circle owner, you must transfer ownership before leaving. Provide newOwnerId." });
    }

    // Transfer ownership
    await sb.from("circles").update({ created_by: newOwnerId }).eq("id", circleId);
    await sb.from("circle_memberships").update({ role: "owner" }).eq("circle_id", circleId).eq("user_id", newOwnerId);
  }

  // Anonymize shares from this user
  await sb
    .from("shared_activities")
    .update({ shared_by: null, shared_by_name: "A parent" })
    .eq("circle_id", circleId)
    .eq("shared_by", user.id);

  // Remove membership
  const { error } = await sb
    .from("circle_memberships")
    .update({ status: "removed" })
    .eq("circle_id", circleId)
    .eq("user_id", user.id);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}
