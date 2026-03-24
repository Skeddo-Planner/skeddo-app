import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  // GET = look up invite details (inviter name, child name) without accepting
  if (req.method === "GET") {
    const inviteCode = req.query.code;
    if (!inviteCode) return res.status(400).json({ error: "code query param is required" });

    // Use service-role client to bypass RLS — the accepting user isn't the invite creator
    const sb = getSupabaseClient();

    const { data: invite, error: invErr } = await sb
      .from("child_invite")
      .select("*, kids(id, name, age)")
      .eq("invite_code", inviteCode)
      .single();

    if (invErr || !invite) {
      return res.status(404).json({ error: "Invite not found" });
    }

    // Get the inviter's display name
    const { data: creator } = await sb
      .from("profiles")
      .select("display_name")
      .eq("id", invite.created_by)
      .single();

    // Check if expired
    const expired = new Date(invite.expires_at) < new Date();

    return res.status(200).json({
      inviterName: creator?.display_name || null,
      childName: invite.kids?.name || null,
      status: expired ? "expired" : invite.status,
    });
  }

  // POST = accept the invite
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { inviteCode } = req.body;
  if (!inviteCode) return res.status(400).json({ error: "inviteCode is required" });

  // Use service-role client to bypass RLS — the accepting user can't see invites
  // they didn't create under user-scoped RLS
  const sb = getSupabaseClient();

  // Look up the invite
  const { data: invite, error: invErr } = await sb
    .from("child_invite")
    .select("*, kids(id, name, age)")
    .eq("invite_code", inviteCode)
    .single();

  if (invErr || !invite) {
    return res.status(404).json({ error: "Invite not found" });
  }

  // Check invite is still valid
  if (invite.status !== "active") {
    return res.status(400).json({ error: "This invite has already been used", status: invite.status });
  }

  if (new Date(invite.expires_at) < new Date()) {
    // Auto-expire
    await sb.from("child_invite").update({ status: "expired" }).eq("id", invite.id);
    // Get creator name for error message
    const { data: creator } = await sb
      .from("profiles")
      .select("display_name")
      .eq("id", invite.created_by)
      .single();
    return res.status(400).json({
      error: "This invite link has expired",
      creatorName: creator?.display_name || "the person who invited you",
    });
  }

  // Check if user already has access
  const { data: existing } = await sb
    .from("child_access")
    .select("user_id")
    .eq("child_id", invite.child_id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return res.status(400).json({ error: "You already have access to this child's schedule" });
  }

  // Check max 2 adults
  const { count } = await sb
    .from("child_access")
    .select("*", { count: "exact", head: true })
    .eq("child_id", invite.child_id);

  if (count >= 2) {
    return res.status(400).json({ error: "Maximum 2 adults per child reached" });
  }

  // Grant access
  const { error: accessErr } = await sb
    .from("child_access")
    .insert({
      child_id: invite.child_id,
      user_id: user.id,
      role: "member",
      invited_by: invite.created_by,
    });

  if (accessErr) return res.status(500).json({ error: accessErr.message });

  // Mark invite as used
  await sb
    .from("child_invite")
    .update({ status: "used", used_by: user.id, used_at: new Date().toISOString() })
    .eq("id", invite.id);

  // Log the join
  const { data: userProfile } = await sb
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  await sb.from("activity_log").insert({
    child_id: invite.child_id,
    user_id: user.id,
    user_name: userProfile?.display_name || "Someone",
    action: "added",
    details: { type: "access_granted", message: "joined via invite link" },
  });

  return res.status(200).json({
    success: true,
    child: invite.kids,
  });
}
