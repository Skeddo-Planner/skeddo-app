/**
 * POST /api/report-bug
 *
 * Sends a bug report email to the Skeddo founders via Resend.
 *
 * Body: { description, email, displayName, userAgent }
 * Requires: RESEND_API_KEY and NOTIFY_EMAIL env vars in Vercel.
 */

import { handleCors, verifyUser, escapeHtml } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Require authentication to prevent spam
  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!resendKey || !notifyEmail) {
    console.error("Missing RESEND_API_KEY or NOTIFY_EMAIL env var");
    return res.status(500).json({ error: "Notification not configured" });
  }

  const { description, type, email, displayName, userAgent } = req.body || {};
  const isFeedback = type === "feedback";
  const label = isFeedback ? "Feedback" : "Bug Report";

  if (!description || !description.trim()) {
    return res.status(400).json({ error: "Missing description" });
  }

  // Input length limits to prevent abuse
  if (description.length > 5000) {
    return res.status(400).json({ error: "Description too long (max 5000 characters)" });
  }

  const reportTime = new Date().toLocaleString("en-CA", {
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
        subject: `${label} from ${escapeHtml(displayName || email || "Anonymous")}`,
        html: `
          <div style="font-family: 'Barlow', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="font-family: 'Poppins', Arial, sans-serif; color: #1B2432; margin-bottom: 16px;">
              ${label}
            </h2>
            <div style="background: #FAF8F3; border: 1px solid #E4E0D8; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
              <p style="margin: 0 0 12px; font-size: 14px; color: #1A2E26; line-height: 1.6; white-space: pre-wrap;">
                ${description.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
              </p>
              <hr style="border: none; border-top: 1px solid #E4E0D8; margin: 12px 0;" />
              <p style="margin: 0 0 4px; font-size: 12px; color: #8A9A8E;">
                <strong style="color: #1A2E26;">From:</strong> ${escapeHtml(displayName) || "Unknown"} (${escapeHtml(email) || "no email"})
              </p>
              <p style="margin: 0 0 4px; font-size: 12px; color: #8A9A8E;">
                <strong style="color: #1A2E26;">Time:</strong> ${reportTime} PT
              </p>
              <p style="margin: 0; font-size: 12px; color: #8A9A8E;">
                <strong style="color: #1A2E26;">Device:</strong> ${(userAgent || "Unknown").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
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
      return res.status(502).json({ error: "Failed to send bug report" });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error("Bug report error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
