import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";
import { randomBytes } from "crypto";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { circleId } = req.body;

  const sb = getSupabaseClient(user._token);

  // Get user's display name for the referral code
  const { data: profile } = await sb
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const firstName = (profile?.display_name || "user").split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
  const code = `${firstName}-${randomBytes(3).toString("hex")}`;

  // 7-day reward window
  const rewardExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: referral, error } = await sb
    .from("referrals")
    .insert({
      referrer_id: user.id,
      referral_code: code,
      circle_id: circleId || null,
      status: "pending",
      reward_expires_at: rewardExpiresAt,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({
    referral,
    referralUrl: `https://skeddo.ca/invite/${code}`,
  });
}
