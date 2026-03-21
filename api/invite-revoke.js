import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { inviteId } = req.body;
  if (!inviteId) return res.status(400).json({ error: "inviteId is required" });

  const sb = getSupabaseClient(user._token);

  // Only the creator can revoke
  const { data: invite } = await sb
    .from("child_invite")
    .select("id, created_by, status")
    .eq("id", inviteId)
    .single();

  if (!invite) return res.status(404).json({ error: "Invite not found" });
  if (invite.created_by !== user.id) return res.status(403).json({ error: "Only the invite creator can revoke it" });
  if (invite.status !== "active") return res.status(400).json({ error: "Invite is no longer active" });

  const { error } = await sb
    .from("child_invite")
    .update({ status: "revoked" })
    .eq("id", inviteId);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}
