/**
 * POST /api/notify-manual-program
 *
 * When a user manually adds a program:
 * 1. Inserts it into directory_programs (Supabase) so ALL users can discover it immediately
 * 2. Sends an email notification to founders for review/verification
 *
 * Body: { programName, provider, category, cost, days, times, startDate, endDate,
 *         ageMin, ageMax, location, neighbourhood, registrationUrl, userEmail, userName, userId }
 * Requires: RESEND_API_KEY, NOTIFY_EMAIL, SUPABASE_SERVICE_ROLE_KEY env vars in Vercel.
 */

import { handleCors, getSupabaseClient } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    programName, provider, category, cost, days, times,
    startDate, endDate, ageMin, ageMax, location, neighbourhood,
    registrationUrl, userEmail, userName, userId,
  } = req.body || {};

  if (!programName) {
    return res.status(400).json({ error: "Missing programName" });
  }

  // ─── 1. Insert into directory_programs (using service role to bypass RLS) ───
  const sb = getSupabaseClient(); // service role client
  try {
    const { error: insertErr } = await sb
      .from("directory_programs")
      .insert({
        name: programName,
        provider: provider || null,
        category: category || "General",
        cost: cost ? Number(cost) : null,
        days: days || null,
        start_time: times ? times.split("–")[0]?.trim() : null,
        end_time: times ? times.split("–")[1]?.trim() : null,
        start_date: startDate || null,
        end_date: endDate || null,
        age_min: ageMin ? Number(ageMin) : null,
        age_max: ageMax ? Number(ageMax) : null,
        address: location || null,
        neighbourhood: neighbourhood || null,
        registration_url: registrationUrl || null,
        enrollment_status: "Open",
        source: "user-submitted",
        source_id: `user-${userId || "anon"}-${Date.now()}`,
        user_submitted: true,
        submitted_by: userId || null,
        submitted_by_name: userName || null,
        verified: false,
        description: `User-submitted program. ${provider ? "Provider: " + provider + "." : ""} Pending verification.`,
        tags: ["user-submitted"],
      });

    if (insertErr) {
      console.error("Failed to insert user-submitted program:", insertErr);
      // Don't return error — still send the email notification
    }
  } catch (err) {
    console.error("Supabase insert error:", err);
  }

  // ─── 2. Send email notification to founders ───
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!resendKey || !notifyEmail) {
    // No email config — the program was still added to Supabase above
    return res.status(200).json({ success: true, note: "Added to directory but email not configured" });
  }

  const submittedAt = new Date().toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const field = (label, value) =>
    value ? `<p style="margin: 0 0 6px; font-size: 14px; color: #8A9A8E;">
      <strong style="color: #1A2E26;">${label}:</strong> ${value}
    </p>` : "";

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Skeddo <onboarding@resend.dev>",
        to: notifyEmail,
        subject: `📋 New manual program: ${programName} (${provider || "no provider"})`,
        html: `
          <div style="font-family: 'Barlow', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
            <h2 style="font-family: 'Instrument Serif', Georgia, serif; color: #1A2E26; margin-bottom: 8px;">
              Manual program added 📋
            </h2>
            <p style="font-size: 13px; color: #3A9E6A; font-weight: 600; margin: 0 0 16px;">
              ✓ Already added to the directory — other users can discover it now.
            </p>

            <div style="background: #FAF8F3; border: 1px solid #E4E0D8; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
              <h3 style="font-size: 16px; color: #1A2E26; margin: 0 0 12px;">Program Details</h3>
              ${field("Program Name", programName)}
              ${field("Provider", provider)}
              ${field("Category", category)}
              ${field("Cost", cost ? "$" + cost : null)}
              ${field("Ages", ageMin || ageMax ? `${ageMin || "?"} – ${ageMax || "?"}` : null)}
              ${field("Days", days)}
              ${field("Times", times)}
              ${field("Dates", startDate ? `${startDate}${endDate ? " to " + endDate : ""}` : null)}
              ${field("Location", location)}
              ${field("Neighbourhood", neighbourhood)}
              ${field("Registration URL", registrationUrl ? `<a href="${registrationUrl}" style="color: #3A9E6A;">${registrationUrl}</a>` : null)}
            </div>

            <div style="background: #EDF7F1; border: 1px solid #C3E0CC; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
              <h3 style="font-size: 14px; color: #1A2E26; margin: 0 0 8px;">Submitted by</h3>
              ${field("Name", userName)}
              ${field("Email", userEmail)}
              ${field("Submitted", submittedAt + " PT")}
            </div>

            <div style="background: #FFF8E1; border: 1px solid #F5E6B8; border-radius: 12px; padding: 14px;">
              <p style="font-size: 13px; color: #8B7000; margin: 0; line-height: 1.5;">
                <strong>Review needed:</strong> This program has been auto-added to the directory
                (marked as unverified). Please verify it's a real program from a real provider.
                If it's not legitimate, remove it from the directory_programs table in Supabase.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #E4E0D8; margin: 16px 0;" />
            <p style="font-size: 11px; color: #8A9A8E;">
              Sent by Skeddo · skeddo.ca
            </p>
          </div>
        `,
      }),
    });
  } catch (err) {
    console.error("Email notification error:", err);
  }

  return res.status(200).json({ success: true });
}
