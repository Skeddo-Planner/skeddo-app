import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  // GET = look up invite details (inviter name, children names) without accepting
  if (req.method === "GET") {
    const inviteCode = req.query.code;
    if (!inviteCode) return res.status(400).json({ error: "code query param is required" });

    const sb = getSupabaseClient();

    // Find ALL invites with this code (could be multiple children)
    const { data: invites, error: invErr } = await sb
      .from("child_invite")
      .select("*, kids(id, name, age)")
      .eq("invite_code", inviteCode);

    if (invErr || !invites || invites.length === 0) {
      return res.status(404).json({ error: "Invite not found" });
    }

    // Get the inviter's display name (same creator for all)
    const { data: creator } = await sb
      .from("profiles")
      .select("display_name")
      .eq("id", invites[0].created_by)
      .single();

    const expired = new Date(invites[0].expires_at) < new Date();
    const childNames = invites.map((inv) => inv.kids?.name).filter(Boolean);

    return res.status(200).json({
      inviterName: creator?.display_name || null,
      childName: childNames.length === 1 ? childNames[0] : null,
      childNames,
      status: expired ? "expired" : invites[0].status,
    });
  }

  // POST = accept the invite (grants access to ALL children on this code)
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { inviteCode } = req.body;
  if (!inviteCode) return res.status(400).json({ error: "inviteCode is required" });

  const sb = getSupabaseClient();

  // Find ALL invites with this code
  const { data: invites, error: invErr } = await sb
    .from("child_invite")
    .select("*, kids(id, name, age)")
    .eq("invite_code", inviteCode);

  if (invErr || !invites || invites.length === 0) {
    return res.status(404).json({ error: "Invite not found" });
  }

  // Check first invite is still valid (all share same status/expiry)
  const first = invites[0];
  if (first.status !== "active") {
    return res.status(400).json({ error: "This invite has already been used", status: first.status });
  }

  if (new Date(first.expires_at) < new Date()) {
    await sb.from("child_invite").update({ status: "expired" }).eq("invite_code", inviteCode);
    const { data: creator } = await sb
      .from("profiles")
      .select("display_name")
      .eq("id", first.created_by)
      .single();
    return res.status(400).json({
      error: "This invite link has expired",
      creatorName: creator?.display_name || "the person who invited you",
    });
  }

  // Grant access to ALL children on this invite
  const grantedChildren = [];
  const { data: userProfile } = await sb
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  for (const invite of invites) {
    // Check if user already has access
    const { data: existing } = await sb
      .from("child_access")
      .select("user_id")
      .eq("child_id", invite.child_id)
      .eq("user_id", user.id)
      .single();

    if (existing) continue; // skip, already has access

    // Check max 2 adults
    const { count } = await sb
      .from("child_access")
      .select("*", { count: "exact", head: true })
      .eq("child_id", invite.child_id);

    if (count >= 2) continue; // skip, max reached

    // Grant access
    const { error: accessErr } = await sb
      .from("child_access")
      .insert({
        child_id: invite.child_id,
        user_id: user.id,
        role: "member",
        invited_by: invite.created_by,
      });

    if (!accessErr) {
      grantedChildren.push(invite.kids);

      // Log the join
      await sb.from("activity_log").insert({
        child_id: invite.child_id,
        user_id: user.id,
        user_name: userProfile?.display_name || "Someone",
        action: "added",
        details: { type: "access_granted", message: "joined via invite link" },
      });
    }
  }

  // Mark ALL invites with this code as used
  await sb
    .from("child_invite")
    .update({ status: "used", used_by: user.id, used_at: new Date().toISOString() })
    .eq("invite_code", inviteCode);

  // Auto-add co-parent to ALL circles that the inviter belongs to
  const inviterId = first.created_by;
  try {
    const { data: inviterCircles } = await sb
      .from("circle_memberships")
      .select("circle_id")
      .eq("user_id", inviterId)
      .eq("status", "approved");

    if (inviterCircles && inviterCircles.length > 0) {
      for (const cm of inviterCircles) {
        // Check if co-parent is already a member
        const { data: existingRows } = await sb
          .from("circle_memberships")
          .select("id")
          .eq("circle_id", cm.circle_id)
          .eq("user_id", user.id);

        if (!existingRows || existingRows.length === 0) {
          await sb.from("circle_memberships").insert({
            circle_id: cm.circle_id,
            user_id: user.id,
            role: "member",
            status: "approved", // auto-approved since they're a co-parent
          });
        }
      }
    }
  } catch (e) {
    // Circle auto-add is best-effort — don't fail the invite acceptance
    console.error("Circle auto-add error:", e.message);
  }

  return res.status(200).json({
    success: true,
    children: grantedChildren,
    child: grantedChildren[0] || null, // backwards compatibility
  });
}
