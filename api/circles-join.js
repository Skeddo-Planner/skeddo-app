import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { inviteCode } = req.body;
  if (!inviteCode) return res.status(400).json({ error: "inviteCode is required" });

  const sb = getSupabaseClient(user._token);

  // Find the circle by invite code
  const { data: circle, error: findErr } = await sb
    .from("circles")
    .select("id, name")
    .eq("invite_code", inviteCode)
    .single();

  if (findErr || !circle) return res.status(404).json({ error: "Circle not found" });

  // Check if already a member
  const { data: existing } = await sb
    .from("circle_memberships")
    .select("id, status")
    .eq("circle_id", circle.id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    if (existing.status === "approved") return res.status(400).json({ error: "Already a member" });
    if (existing.status === "pending") return res.status(400).json({ error: "Join request already pending" });
    // If removed, allow re-request
    await sb.from("circle_memberships").update({ status: "pending", joined_at: new Date().toISOString() }).eq("id", existing.id);
    return res.status(200).json({ success: true, circle, status: "pending" });
  }

  // Create pending membership
  const { error: joinErr } = await sb
    .from("circle_memberships")
    .insert({ circle_id: circle.id, user_id: user.id, role: "member", status: "pending" });

  if (joinErr) return res.status(500).json({ error: joinErr.message });

  return res.status(200).json({ success: true, circle, status: "pending" });
}
