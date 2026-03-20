/**
 * GET /api/push-cron — Daily cron job for scheduled push notifications
 * Runs at 6 AM Pacific (14:00 UTC) via Vercel Cron
 *
 * Checks for:
 * 1. Upcoming enrolled programs (1, 3, 7 days out)
 * 2. Budget milestones (50%, 75%, 90%)
 * 3. Registration reminders for saved programs
 */
import webpush from "web-push";
import { getSupabaseClient } from "./_helpers.js";

const VAPID_PUBLIC = process.env.VITE_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

webpush.setVapidDetails(
  "mailto:skeddo.planner@gmail.com",
  VAPID_PUBLIC,
  VAPID_PRIVATE
);

async function sendToUser(db, userId, payload, type, referenceId) {
  // Check if already sent
  if (referenceId) {
    const { data: existing } = await db
      .from("notification_log")
      .select("id")
      .eq("user_id", userId)
      .eq("type", type)
      .eq("reference_id", referenceId)
      .limit(1);

    if (existing && existing.length > 0) return 0;
  }

  const { data: subs } = await db
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (!subs || subs.length === 0) return 0;

  const body = JSON.stringify(payload);
  let sent = 0;
  const stale = [];

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        body
      );
      sent++;
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) stale.push(sub.id);
    }
  }

  if (stale.length > 0) {
    await db.from("push_subscriptions").delete().in("id", stale);
  }

  if (sent > 0 && referenceId) {
    await db.from("notification_log").insert({
      user_id: userId,
      type,
      reference_id: referenceId,
    });
  }

  return sent;
}

export default async function handler(req, res) {
  // Verify cron authorization
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = getSupabaseClient(); // admin client
  const now = new Date();
  let totalSent = 0;

  // ── 1. Upcoming program reminders ──
  for (const daysOut of [1, 3, 7]) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + daysOut);
    const dateStr = targetDate.toISOString().split("T")[0]; // YYYY-MM-DD

    const { data: programs } = await db
      .from("user_programs")
      .select("id, name, user_id, kid_ids, start_date")
      .eq("status", "Enrolled")
      .eq("start_date", dateStr);

    if (programs) {
      for (const prog of programs) {
        // Check user's notification preference
        const { data: profile } = await db
          .from("profiles")
          .select("notify_upcoming_programs, display_name")
          .eq("id", prog.user_id)
          .single();

        if (profile?.notify_upcoming_programs === false) continue;

        const refId = `upcoming-${prog.id}-${daysOut}d`;
        const dayLabel = daysOut === 1 ? "tomorrow" : `in ${daysOut} days`;

        const sent = await sendToUser(db, prog.user_id, {
          title: `${prog.name} starts ${dayLabel}`,
          body: "Tap to view program details",
          icon: "/icon-192.png",
          data: { url: "/?tab=programs", type: "upcoming_program" },
        }, "upcoming_program", refId);

        totalSent += sent;
      }
    }
  }

  // ── 2. Budget milestones ──
  const { data: allProfiles } = await db
    .from("profiles")
    .select("id, budget_goal, notify_budget_milestones");

  if (allProfiles) {
    for (const profile of allProfiles) {
      if (!profile.budget_goal || profile.budget_goal <= 0) continue;
      if (profile.notify_budget_milestones === false) continue;

      // Calculate total enrolled cost for this user
      const { data: userPrograms } = await db
        .from("user_programs")
        .select("cost")
        .eq("user_id", profile.id)
        .eq("status", "Enrolled");

      if (!userPrograms) continue;

      const totalCost = userPrograms.reduce((sum, p) => sum + (Number(p.cost) || 0), 0);
      const pct = (totalCost / profile.budget_goal) * 100;

      for (const milestone of [50, 75, 90]) {
        if (pct >= milestone) {
          const refId = `budget-${profile.id}-${milestone}`;
          const sent = await sendToUser(db, profile.id, {
            title: `Budget ${milestone}% reached`,
            body: `You've committed $${Math.round(totalCost)} of your $${Math.round(profile.budget_goal)} budget`,
            icon: "/icon-192.png",
            data: { url: "/?tab=budget", type: "budget_milestone" },
          }, "budget_milestone", refId);

          totalSent += sent;
        }
      }
    }
  }

  // ── 3. Registration reminders (programs with registration dates approaching) ──
  // This checks directory_programs for status changes — placeholder for now
  // Will be enhanced when program refresh detects status changes

  return res.status(200).json({
    ok: true,
    totalSent,
    timestamp: now.toISOString(),
  });
}
