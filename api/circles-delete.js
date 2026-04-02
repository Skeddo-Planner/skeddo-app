import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { circleId } = req.body;
  if (!circleId) return res.status(400).json({ error: "circleId is required" });

  const sb = getSupabaseClient(user._token);

  // Verify user is the owner
  const { data: circle } = await sb
    .from("circles")
    .select("id, created_by")
    .eq("id", circleId)
    .single();

  if (!circle) return res.status(404).json({ error: "Circle not found" });
  if (circle.created_by !== user.id) {
    return res.status(403).json({ error: "Only the circle owner can delete a circle" });
  }

  // Delete all shared activities in the circle
  await sb.from("shared_activities").delete().eq("circle_id", circleId);

  // Delete all memberships
  await sb.from("circle_memberships").delete().eq("circle_id", circleId);

  // Delete the circle
  const { error } = await sb.from("circles").delete().eq("id", circleId);
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}
