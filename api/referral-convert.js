/**
 * POST /api/referral-convert
 *
 * Called when a new user signs up using a referral code (from /invite/:code URL).
 * Awards BOTH users a free month:
 *   - Referrer: +1 to reward_months_earned on their profile
 *   - New user: +1 to reward_months_earned on their profile + referred_by set
 *
 * When billing goes live, the subscription logic should check
 * profiles.reward_months_earned and deduct from it when applying free months.
 *
 * Body: { referralCode }
 */

import { verifyUser, getSupabaseClient, handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { referralCode } = req.body;
  if (!referralCode) return res.status(400).json({ error: "referralCode is required" });

  const sb = getSupabaseClient(user._token);

  // Find the referrer by their permanent referral code on profiles
  const { data: referrer } = await sb
    .from("profiles")
    .select("id, referral_code, reward_months_earned")
    .eq("referral_code", referralCode)
    .single();

  if (!referrer) return res.status(404).json({ error: "Invalid referral code" });
  if (referrer.id === user.id) return res.status(400).json({ error: "Cannot use your own referral code" });

  // Check if this user already used a referral code
  const { data: newUserProfile } = await sb
    .from("profiles")
    .select("id, referred_by, reward_months_earned")
    .eq("id", user.id)
    .single();

  if (newUserProfile?.referred_by) {
    return res.status(400).json({ error: "You've already used a referral code" });
  }

  // ─── Credit the REFERRER: +1 free month (atomic increment) ───
  const { error: referrerErr } = await sb.rpc("increment_reward_months", {
    target_user_id: referrer.id,
    amount: 1,
  });

  if (referrerErr) {
    console.error("Failed to credit referrer:", referrerErr);
    return res.status(500).json({ error: "Failed to credit referrer" });
  }

  // ─── Credit the NEW USER: +1 free month + record who referred them ───
  const { error: incrErr } = await sb.rpc("increment_reward_months", {
    target_user_id: user.id,
    amount: 1,
  });

  if (incrErr) {
    console.error("Failed to credit new user:", incrErr);
    return res.status(500).json({ error: "Failed to credit new user" });
  }

  // Set referred_by separately (can't do in the RPC)
  const { error: refByErr } = await sb
    .from("profiles")
    .update({ referred_by: referralCode })
    .eq("id", user.id);

  if (refByErr) {
    console.error("Failed to set referred_by:", refByErr);
  }

  // ─── Also record in referrals table for tracking/display ───
  try {
    await sb.from("referrals").insert({
      referrer_id: referrer.id,
      referred_id: user.id,
      referral_code: referralCode,
      status: "converted",
      reward_months: 1,
      converted_at: new Date().toISOString(),
      reward_expires_at: new Date().toISOString(), // already converted, no expiry needed
    });
  } catch {
    // Non-critical — the profile credits are what matter
  }

  return res.status(200).json({
    success: true,
    message: "Both you and the person who referred you have been awarded a free month!",
    referrerCredited: true,
    newUserCredited: true,
  });
}
