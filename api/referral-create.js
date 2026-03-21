import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";
import { randomBytes } from "crypto";

/**
 * GET /api/referral-create
 * Returns the user's permanent referral code (creates one if they don't have one yet).
 * Each user has exactly ONE referral code that never changes.
 */
export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const sb = getSupabaseClient(user._token);

  // Check if user already has a referral code
  const { data: profile } = await sb
    .from("profiles")
    .select("referral_code, display_name")
    .eq("id", user.id)
    .single();

  if (profile?.referral_code) {
    // Return existing code
    return res.status(200).json({
      referralCode: profile.referral_code,
      referralUrl: `https://skeddo.ca/invite/${profile.referral_code}`,
    });
  }

  // Generate a permanent code: first name + random suffix
  const firstName = (profile?.display_name || "user").split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
  const code = `${firstName}-${randomBytes(3).toString("hex")}`;

  // Save to profile
  const { error } = await sb
    .from("profiles")
    .update({ referral_code: code })
    .eq("id", user.id);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({
    referralCode: code,
    referralUrl: `https://skeddo.ca/invite/${code}`,
  });
}
