import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { referralCode } = req.body;
  if (!referralCode) return res.status(400).json({ error: "referralCode is required" });

  const sb = getSupabaseClient(user._token);

  // Find the referral
  const { data: referral } = await sb
    .from("referrals")
    .select("*")
    .eq("referral_code", referralCode)
    .single();

  if (!referral) return res.status(404).json({ error: "Referral not found" });
  if (referral.status !== "pending") return res.status(400).json({ error: "Referral already used" });
  if (referral.referrer_id === user.id) return res.status(400).json({ error: "Cannot use your own referral" });

  // Check if within 7-day reward window
  const withinWindow = new Date(referral.reward_expires_at) >= new Date();

  // Convert the referral
  const { error } = await sb
    .from("referrals")
    .update({
      referred_id: user.id,
      status: "converted",
      converted_at: new Date().toISOString(),
      reward_months: withinWindow ? 1 : 0,
    })
    .eq("id", referral.id);

  if (error) return res.status(500).json({ error: error.message });

  // If there's a circle attached, auto-request to join
  if (referral.circle_id) {
    const { data: existing } = await sb
      .from("circle_memberships")
      .select("id")
      .eq("circle_id", referral.circle_id)
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      await sb.from("circle_memberships").insert({
        circle_id: referral.circle_id,
        user_id: user.id,
        role: "member",
        status: "pending",
      });
    }
  }

  return res.status(200).json({
    success: true,
    rewardApplied: withinWindow,
    circleId: referral.circle_id,
  });
}
