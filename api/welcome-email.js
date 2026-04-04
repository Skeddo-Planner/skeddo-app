/**
 * POST /api/welcome-email
 *
 * Sends a branded welcome email to new users with beta access link.
 * Called from the front-end after successful registration.
 *
 * Body: { email, displayName }
 * Requires: RESEND_API_KEY env var in Vercel.
 */

import { handleCors, verifyUser, escapeHtml } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic origin check — this endpoint is called from our frontend during signup.
  // Full JWT auth isn't possible since the user may not have a confirmed session yet.
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";
  if (!origin.includes("skeddo.ca") && !origin.includes("localhost") &&
      !referer.includes("skeddo.ca") && !referer.includes("localhost")) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("Missing RESEND_API_KEY env var");
    return res.status(500).json({ error: "Email not configured" });
  }

  const { email, displayName } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  // Basic email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const name = escapeHtml(displayName) ||
    email.split("@")[0].replace(/[._+\-]/g, " ").replace(/\b\w/g, l => l.toUpperCase()) ||
    "there";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Skeddo <noreply@skeddo.ca>",
        to: email,
        subject: "Welcome to Skeddo! Here's your beta access link",
        html: `
          <div style="font-family: 'Barlow', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #FAF8F3;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://skeddo.ca/skeddo-logo-dark.png" alt="Skeddo" style="height: 48px; width: auto; border-radius: 10px;" />
            </div>

            <h1 style="font-family: Georgia, serif; font-size: 24px; color: #1A2E26; text-align: center; margin-bottom: 8px;">
              Welcome to Skeddo, ${name}!
            </h1>

            <p style="font-size: 15px; color: #4A5E52; line-height: 1.7; text-align: center; margin-bottom: 24px;">
              The activity planner for busy families in Vancouver &amp; the Lower Mainland.
            </p>

            <div style="text-align: center; margin-bottom: 28px;">
              <a href="https://skeddo.ca"
                 style="display: inline-block; background: #3A9E6A; color: #ffffff; text-decoration: none;
                        font-size: 16px; font-weight: 700; padding: 14px 32px; border-radius: 12px;">
                Open Skeddo
              </a>
            </div>

            <div style="background: #ffffff; border: 1px solid #E4E0D8; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="font-size: 14px; font-weight: 700; color: #1A2E26; margin: 0 0 12px;">
                Quick start:
              </p>
              <p style="font-size: 14px; color: #4A5E52; line-height: 1.8; margin: 0;">
                1. Tap the link above to open the app<br/>
                2. Sign in with <strong>${escapeHtml(email)}</strong><br/>
                3. Add your kids and start browsing programs<br/>
                4. Save your favourites and build your schedule
              </p>
            </div>

            <p style="font-size: 14px; color: #4A5E52; line-height: 1.7; text-align: center; margin-bottom: 8px;">
              Bookmark this link for easy access:<br />
              <a href="https://skeddo.ca" style="color: #3A9E6A; font-weight: 600;">skeddo.ca</a>
            </p>

            <p style="font-size: 14px; color: #4A5E52; line-height: 1.7; text-align: center;">
              Have feedback or questions? Just reply to this email — we'd love to hear from you.
            </p>

            <hr style="border: none; border-top: 1px solid #E4E0D8; margin: 24px 0 16px;" />

            <p style="font-size: 11px; color: #8A9A8E; text-align: center; line-height: 1.5;">
              Skeddo · Mended with Gold Inc. · Vancouver, BC<br/>
              The planner for busy families · <a href="https://skeddo.ca" style="color: #8A9A8E;">skeddo.ca</a>
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Resend error:", response.status, errorData);
      return res.status(502).json({ error: "Failed to send welcome email" });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error("Welcome email error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
