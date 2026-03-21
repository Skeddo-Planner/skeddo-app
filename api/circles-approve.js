import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { membershipId, action } = req.body; // action: 'approve' or 'decline'
  if (!membershipId || !action) return res.status(400).json({ error: "membershipId and action required" });

  const sb = getSupabaseClient(user._token);

  // Verify the requester is the circle owner
  const { data: membership } = await sb
    .from("circle_memberships")
    .select("id, circle_id, user_id, status, circles(created_by)")
    .eq("id", membershipId)
    .single();

  if (!membership) return res.status(404).json({ error: "Membership not found" });
  if (membership.circles?.created_by !== user.id) return res.status(403).json({ error: "Only the circle owner can approve members" });
  if (membership.status !== "pending") return res.status(400).json({ error: "This request is no longer pending" });

  if (action === "approve") {
    const { error } = await sb
      .from("circle_memberships")
      .update({ status: "approved", joined_at: new Date().toISOString() })
      .eq("id", membershipId);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, status: "approved" });
  }

  if (action === "decline") {
    const { error } = await sb
      .from("circle_memberships")
      .delete()
      .eq("id", membershipId);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, status: "declined" });
  }

  return res.status(400).json({ error: "action must be 'approve' or 'decline'" });
}
