import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";
import { randomBytes } from "crypto";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  // Support both single childId and array of childIds
  const { childId, childIds } = req.body || {};
  const ids = childIds || (childId ? [childId] : []);
  if (ids.length === 0) return res.status(400).json({ error: "childId or childIds required" });

  // Use service-role client to bypass RLS — we verify ownership manually below
  const sb = getSupabaseClient();

  // Verify user has access to ALL children
  for (const cid of ids) {
    const { data: ownedKid } = await sb
      .from("kids")
      .select("id")
      .eq("id", cid)
      .eq("user_id", user.id)
      .single();

    const { data: accessRow } = await sb
      .from("child_access")
      .select("role")
      .eq("child_id", cid)
      .eq("user_id", user.id)
      .single();

    if (!ownedKid && !accessRow) return res.status(403).json({ error: `No access to child ${cid}` });

    // Check max 2 adults per child
    const { count } = await sb
      .from("child_access")
      .select("*", { count: "exact", head: true })
      .eq("child_id", cid);

    if (count >= 2) {
      return res.status(400).json({ error: "Maximum 2 adults per child reached" });
    }
  }

  // Generate ONE invite code for all selected children
  const inviteCode = randomBytes(9).toString("base64url").slice(0, 12);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // Create one invite row per child, all sharing the same invite code
  const rows = ids.map((cid) => ({
    child_id: cid,
    created_by: user.id,
    invite_code: inviteCode,
    expires_at: expiresAt,
  }));

  const { data: invites, error } = await sb
    .from("child_invite")
    .insert(rows)
    .select();

  if (error) {
    console.error("invite-create insert error:", error);
    return res.status(500).json({ error: error.message });
  }
  if (!invites || invites.length === 0) {
    console.error("invite-create: insert returned no rows");
    return res.status(500).json({ error: "Failed to create invite" });
  }

  const inviteUrl = `https://skeddo.ca/invite/${inviteCode}`;

  return res.status(200).json({ invites, inviteUrl, code: inviteCode });
}
