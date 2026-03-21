import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";
import { randomBytes } from "crypto";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { name, emoji } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "Circle name is required" });

  const sb = getSupabaseClient(user._token);
  const inviteCode = randomBytes(6).toString("base64url");

  // Create the circle
  const { data: circle, error: circleErr } = await sb
    .from("circles")
    .insert({ name: name.trim(), emoji: emoji || "👨‍👩‍👧‍👦", created_by: user.id, invite_code: inviteCode })
    .select()
    .single();

  if (circleErr) return res.status(500).json({ error: circleErr.message });

  // Add creator as owner (approved)
  const { error: memberErr } = await sb
    .from("circle_memberships")
    .insert({ circle_id: circle.id, user_id: user.id, role: "owner", status: "approved" });

  if (memberErr) return res.status(500).json({ error: memberErr.message });

  return res.status(200).json({ circle });
}
