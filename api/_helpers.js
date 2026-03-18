/**
 * Shared helpers for Vercel serverless API routes.
 * - Verifies Supabase JWT tokens for authentication
 * - Provides a Supabase admin client (bypasses RLS)
 * - Handles CORS headers for cross-origin requests
 */

import { createClient } from "@supabase/supabase-js";

/* ── Supabase admin client (service role — bypasses RLS) ── */
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Verify the Supabase JWT from the Authorization header.
 * Returns the authenticated user object, or null if invalid.
 */
export async function verifyUser(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;

  return data.user;
}

/**
 * Get the Supabase admin client (for server-side DB operations).
 */
export function getSupabaseAdmin() {
  return supabaseAdmin;
}

/**
 * Standard CORS headers for API responses.
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Handle CORS preflight OPTIONS request.
 * Returns true if this was a preflight request (caller should return early).
 */
export function handleCors(req, res) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}
