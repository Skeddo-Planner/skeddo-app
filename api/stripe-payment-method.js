/**
 * GET  /api/stripe-payment-method — Fetch saved card details
 * DELETE /api/stripe-payment-method — Remove saved card
 *
 * Both require a valid Supabase JWT in the Authorization header.
 */

import Stripe from "stripe";
import { verifyUser, getSupabaseAdmin, handleCors } from "./_helpers.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  /* ── Authenticate ── */
  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabaseAdmin();

  /* ── Look up Stripe Customer ID ── */
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile lookup error:", profileError);
    return res.status(500).json({ error: "Failed to look up profile" });
  }

  const customerId = profile.stripe_customer_id;

  /* ── GET: Fetch saved payment method ── */
  if (req.method === "GET") {
    try {
      if (!customerId) {
        return res.status(200).json({ paymentMethod: null });
      }

      const methods = await stripe.customers.listPaymentMethods(customerId, {
        type: "card",
        limit: 1,
      });

      if (methods.data.length === 0) {
        return res.status(200).json({ paymentMethod: null });
      }

      const pm = methods.data[0];
      return res.status(200).json({
        paymentMethod: {
          id: pm.id,
          brand: pm.card.brand,
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year,
        },
      });
    } catch (err) {
      console.error("Fetch payment method error:", err);
      return res.status(500).json({ error: "Failed to fetch payment method" });
    }
  }

  /* ── DELETE: Remove saved payment method ── */
  if (req.method === "DELETE") {
    try {
      const { paymentMethodId } = req.body || {};
      if (!paymentMethodId) {
        return res.status(400).json({ error: "paymentMethodId is required" });
      }

      await stripe.paymentMethods.detach(paymentMethodId);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Detach payment method error:", err);
      return res.status(500).json({ error: "Failed to remove payment method" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
