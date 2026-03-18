/**
 * POST /api/stripe-setup-intent
 *
 * Creates (or retrieves) a Stripe Customer for the authenticated user,
 * then creates a SetupIntent so the frontend can securely collect a card.
 *
 * Returns: { clientSecret: "seti_xxx_secret_xxx" }
 */

import Stripe from "stripe";
import { verifyUser, getSupabaseAdmin, handleCors } from "./_helpers.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    /* ── 1. Authenticate the user ── */
    const user = await verifyUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const supabase = getSupabaseAdmin();

    /* ── 2. Look up existing Stripe Customer ID from profile ── */
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email, display_name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile lookup error:", profileError);
      return res.status(500).json({ error: "Failed to look up profile" });
    }

    let stripeCustomerId = profile.stripe_customer_id;

    /* ── 3. Create a Stripe Customer if none exists ── */
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: profile.email || user.email,
        name: profile.display_name || undefined,
        metadata: { supabase_user_id: user.id },
      });

      stripeCustomerId = customer.id;

      /* Save the Stripe Customer ID back to the profile */
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        /* Continue anyway — the SetupIntent will still work */
      }
    }

    /* ── 4. Create a SetupIntent ── */
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
    });

    return res.status(200).json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    console.error("Stripe SetupIntent error:", err);
    return res.status(500).json({ error: "Failed to create setup intent" });
  }
}
