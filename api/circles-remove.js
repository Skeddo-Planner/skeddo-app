import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { circleId, targetUserId } = req.body;
  if (!circleId || !targetUserId) return res.status(400).json({ error: "circleId and targetUserId required" });

  const sb = getSupabaseClient(user._token);

  // Verify requester is the circle owner
  const { data: circle } = await sb
    .from("circles")
    .select("created_by")
    .eq("id", circleId)
    .single();

  if (!circle || circle.created_by !== user.id) {
    return res.status(403).json({ error: "Only the circle owner can remove members" });
  }

  // Can't remove yourself (use leave instead)
  if (targetUserId === user.id) {
    return res.status(400).json({ error: "Use leave to remove yourself" });
  }

  // Anonymize their shares
  await sb
    .from("shared_activities")
    .update({ shared_by: null, shared_by_name: "A parent" })
    .eq("circle_id", circleId)
    .eq("shared_by", targetUserId);

  // Remove membership
  const { error } = await sb
    .from("circle_memberships")
    .update({ status: "removed" })
    .eq("circle_id", circleId)
    .eq("user_id", targetUserId);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}
