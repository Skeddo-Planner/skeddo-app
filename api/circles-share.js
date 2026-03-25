import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  /* ── DELETE: remove a shared activity (only by the person who shared it) ── */
  if (req.method === "DELETE") {
    try {
      const user = await verifyUser(req);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const { sharedActivityId } = req.body || {};
      if (!sharedActivityId) {
        return res.status(400).json({ error: "sharedActivityId is required" });
      }

      const sb = getSupabaseClient(user._token);

      // Fetch the shared activity to verify ownership
      const { data: activity, error: fetchErr } = await sb
        .from("shared_activities")
        .select("id, shared_by")
        .eq("id", sharedActivityId)
        .single();

      if (fetchErr || !activity) {
        return res.status(404).json({ error: "Shared activity not found" });
      }

      if (activity.shared_by !== user.id) {
        return res.status(403).json({ error: "You can only remove activities you shared" });
      }

      const { error: delErr } = await sb
        .from("shared_activities")
        .delete()
        .eq("id", sharedActivityId);

      if (delErr) return res.status(500).json({ error: delErr.message });

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("circles-share DELETE error:", err);
      return res.status(500).json({ error: err.message || "Failed to delete shared activity" });
    }
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { circleId, activities, displayName } = req.body || {};
  if (!circleId || !activities?.length) {
    return res.status(400).json({ error: "circleId and activities array required" });
  }

  const sb = getSupabaseClient(user._token);

  // Verify user is an approved member
  const { data: membership } = await sb
    .from("circle_memberships")
    .select("status")
    .eq("circle_id", circleId)
    .eq("user_id", user.id)
    .single();

  if (!membership || membership.status !== "approved") {
    return res.status(403).json({ error: "Not an approved member of this circle" });
  }

  // Get user's display name
  const { data: profile } = await sb
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  // Prefer client-provided displayName (always fresh from local state),
  // fall back to database profile, then generic label
  const sharerName = displayName || profile?.display_name || "A parent";

  // Check for already-shared activities by this user in this circle (dedup)
  const { data: existingShares } = await sb
    .from("shared_activities")
    .select("program_id")
    .eq("circle_id", circleId)
    .eq("shared_by", user.id);

  const alreadyShared = new Set((existingShares || []).map((s) => s.program_id).filter(Boolean));

  // Filter out already-shared activities
  const newActivities = activities.filter((a) => !a.programId || !alreadyShared.has(a.programId));

  if (newActivities.length === 0) {
    return res.status(400).json({ error: "These activities have already been shared to this circle" });
  }

  const rows = newActivities.map((a) => ({
    circle_id: circleId,
    shared_by: user.id,
    shared_by_name: sharerName,
    child_name: a.childName || "",
    activity_name: a.activityName,
    provider_name: a.providerName || "",
    program_id: a.programId || null,
    schedule_info: a.scheduleInfo || "",
    age_group: a.ageGroup || "",
    registration_url: a.registrationUrl || "",
    location: a.location || "",
    start_date: a.startDate || null,
    end_date: a.endDate || null,
  }));

  const { data: shared, error } = await sb
    .from("shared_activities")
    .insert(rows)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true, shared, skipped: activities.length - newActivities.length });
  } catch (err) {
    console.error("circles-share error:", err);
    return res.status(500).json({ error: err.message || "Failed to share activities" });
  }
}
