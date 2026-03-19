/**
 * POST /api/notify-signup
 *
 * Sends an email notification to the Skeddo founders when a new user signs up.
 * Called from the front-end after successful registration.
 *
 * Body: { email, displayName }
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

  const { email, displayName } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  const signupTime = new Date().toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    dateStyle: "medium",
    timeStyle: "short",
  });

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
        subject: `🎉 New Skeddo sign-up: ${displayName || email}`,
        html: `
          <div style="font-family: 'Barlow', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="font-family: 'Instrument Serif', Georgia, serif; color: #1A2E26; margin-bottom: 16px;">
              New user signed up! 🎉
            </h2>
            <div style="background: #FAF8F3; border: 1px solid #E4E0D8; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #8A9A8E;">
                <strong style="color: #1A2E26;">Name:</strong> ${displayName || "Not provided yet"}
              </p>
              <p style="margin: 0 0 8px; font-size: 14px; color: #8A9A8E;">
                <strong style="color: #1A2E26;">Email:</strong> ${email}
              </p>
              <p style="margin: 0; font-size: 14px; color: #8A9A8E;">
                <strong style="color: #1A2E26;">Signed up:</strong> ${signupTime} PT
              </p>
            </div>
            <p style="font-size: 13px; color: #8A9A8E; line-height: 1.6;">
              This person just created a Skeddo account. They'll complete onboarding
              (display name + postal code) on their first login.
            </p>
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
