import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";
import { randomBytes } from "crypto";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { childId } = req.body;
  if (!childId) return res.status(400).json({ error: "childId is required" });

  const sb = getSupabaseClient(user._token);

  // Verify user has access to this child
  const { data: access } = await sb
    .from("child_access")
    .select("role")
    .eq("child_id", childId)
    .eq("user_id", user.id)
    .single();

  if (!access) return res.status(403).json({ error: "No access to this child" });

  // Check max 2 adults per child
  const { count } = await sb
    .from("child_access")
    .select("*", { count: "exact", head: true })
    .eq("child_id", childId);

  if (count >= 2) {
    return res.status(400).json({ error: "Maximum 2 adults per child reached" });
  }

  // Generate unique invite code (URL-safe, 12 chars)
  const inviteCode = randomBytes(9).toString("base64url").slice(0, 12);

  // Create invite with 7-day expiry
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: invite, error } = await sb
    .from("child_invite")
    .insert({
      child_id: childId,
      created_by: user.id,
      invite_code: inviteCode,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const inviteUrl = `https://skeddo.ca/invite/${inviteCode}`;

  return res.status(200).json({ invite, inviteUrl });
}
