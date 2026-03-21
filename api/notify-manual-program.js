/**
 * POST /api/notify-manual-program
 *
 * When a user manually adds a program:
 * 1. Check if the provider already exists in our directory (trusted provider)
 * 2. If KNOWN provider → auto-add to directory_programs (immediately discoverable)
 * 3. If UNKNOWN provider → save to program_submissions staging table (awaits review)
 * 4. Email founders either way — "auto-added" or "needs review"
 *
 * Body: { programName, provider, category, cost, days, times, startDate, endDate,
 *         ageMin, ageMax, location, neighbourhood, registrationUrl, userEmail, userName, userId }
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

  const sb = getSupabaseClient(); // service role client

  // ─── Step 1: Check if provider is known ───
  let isKnownProvider = false;
  if (provider && provider.trim()) {
    const providerLower = provider.trim().toLowerCase();

    // Check directory_programs for existing programs from this provider
    const { data: existing } = await sb
      .from("directory_programs")
      .select("id")
      .ilike("provider", providerLower)
      .limit(1);

    if (existing && existing.length > 0) {
      isKnownProvider = true;
    }

    // Also check the static programs list via a broader match
    // (directory_programs may not have all providers from programs.json)
    if (!isKnownProvider) {
      // Try partial match for providers like "City of Vancouver - Trout Lake"
      const { data: partial } = await sb
        .from("directory_programs")
        .select("id")
        .ilike("provider", `%${providerLower}%`)
        .limit(1);

      if (partial && partial.length > 0) {
        isKnownProvider = true;
      }
    }
  }

  // ─── Step 2: Auto-add or stage ───
  let autoAdded = false;

  if (isKnownProvider) {
    // KNOWN PROVIDER → add directly to directory_programs
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
        verified: true, // Known provider = trusted
        description: `Submitted by ${userName || "a user"}. Provider verified against existing directory.`,
        tags: ["user-submitted"],
      });

    if (insertErr) {
      console.error("Failed to insert verified program:", insertErr);
    } else {
      autoAdded = true;
    }
  } else {
    // UNKNOWN PROVIDER → staging table only (not in public directory)
    const { error: stageErr } = await sb
      .from("program_submissions")
      .insert({
        name: programName,
        provider: provider || null,
        category: category || "General",
        cost: cost ? Number(cost) : null,
        days: days || null,
        times: times || null,
        start_date: startDate || null,
        end_date: endDate || null,
        age_min: ageMin ? Number(ageMin) : null,
        age_max: ageMax ? Number(ageMax) : null,
        location: location || null,
        neighbourhood: neighbourhood || null,
        registration_url: registrationUrl || null,
        submitted_by: userId || null,
        submitted_by_name: userName || null,
        submitted_by_email: userEmail || null,
        status: "pending",
      });

    if (stageErr) {
      console.error("Failed to stage program submission:", stageErr);
    }
  }

  // ─── Step 3: Send email notification ───
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (resendKey && notifyEmail) {
    const submittedAt = new Date().toLocaleString("en-CA", {
      timeZone: "America/Vancouver",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const field = (label, value) =>
      value ? `<p style="margin: 0 0 6px; font-size: 14px; color: #8A9A8E;">
        <strong style="color: #1A2E26;">${label}:</strong> ${value}
      </p>` : "";

    const statusBanner = autoAdded
      ? `<div style="background: #EDF7F1; border: 1px solid #C3E0CC; border-radius: 10px; padding: 12px; margin-bottom: 16px;">
          <p style="font-size: 13px; color: #2D7A4A; font-weight: 600; margin: 0;">
            ✓ Auto-added to directory — provider "${provider}" is already in the database.
          </p>
        </div>`
      : `<div style="background: #FEE2E2; border: 1px solid #FECACA; border-radius: 10px; padding: 12px; margin-bottom: 16px;">
          <p style="font-size: 13px; color: #991B1B; font-weight: 600; margin: 0;">
            ⚠ NOT added to directory — provider "${provider || "none"}" is unknown. Saved to submissions for your review.
          </p>
        </div>`;

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
          subject: `${autoAdded ? "✓" : "⚠"} Program submission: ${programName} (${provider || "unknown provider"})`,
          html: `
            <div style="font-family: 'Barlow', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
              <h2 style="font-family: 'Instrument Serif', Georgia, serif; color: #1A2E26; margin-bottom: 12px;">
                Program submission
              </h2>

              ${statusBanner}

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

              <div style="background: #F5F3EE; border: 1px solid #E4E0D8; border-radius: 12px; padding: 16px;">
                <h3 style="font-size: 14px; color: #1A2E26; margin: 0 0 8px;">Submitted by</h3>
                ${field("Name", userName)}
                ${field("Email", userEmail)}
                ${field("Submitted", submittedAt + " PT")}
              </div>

              <hr style="border: none; border-top: 1px solid #E4E0D8; margin: 16px 0;" />
              <p style="font-size: 11px; color: #8A9A8E;">Sent by Skeddo · skeddo.ca</p>
            </div>
          `,
        }),
      });
    } catch (err) {
      console.error("Email notification error:", err);
    }
  }

  return res.status(200).json({ success: true, autoAdded });
}
