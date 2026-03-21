import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { circleId, activities } = req.body;
  // activities: [{ activityName, providerName, childName, scheduleInfo, ageGroup, registrationUrl, programId }]
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

  const sharerName = profile?.display_name || "A parent";

  // Insert shared activities
  const rows = activities.map((a) => ({
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
  }));

  const { data: shared, error } = await sb
    .from("shared_activities")
    .insert(rows)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true, shared });
}
