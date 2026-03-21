/**
 * POST /api/notify-manual-program
 *
 * Sends an email notification to the Skeddo founders when a user manually
 * adds a program (i.e. one not found in the Discover directory).
 * This lets founders verify it's real and add it to the directory for all users.
 *
 * Body: { programName, provider, category, cost, days, times, startDate, endDate,
 *         ageMin, ageMax, location, neighbourhood, userEmail, userName }
 * Requires: RESEND_API_KEY and NOTIFY_EMAIL env vars in Vercel.
 */

import { handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!resendKey || !notifyEmail) {
    console.error("Missing RESEND_API_KEY or NOTIFY_EMAIL env var");
    return res.status(500).json({ error: "Notification not configured" });
  }

  const {
    programName, provider, category, cost, days, times,
    startDate, endDate, ageMin, ageMax, location, neighbourhood,
    registrationUrl, userEmail, userName,
  } = req.body || {};

  if (!programName) {
    return res.status(400).json({ error: "Missing programName" });
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
    const response = await fetch("https://api.resend.com/emails", {
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
            <p style="font-size: 13px; color: #8A9A8E; margin: 0 0 16px; line-height: 1.5;">
              A user added a program that isn't in the Discover directory. Check if it's a real program
              from a real provider, and if so, add it to the directory so other users can find it.
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
                <strong>Action needed:</strong> Verify this is a real program, then add it to
                <code>programs.json</code> and push to deploy. If it's already in the directory
                under a different name, no action needed.
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Resend error:", response.status, errorData);
      return res.status(502).json({ error: "Failed to send notification" });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error("Notification error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
