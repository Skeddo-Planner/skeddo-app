/**
 * Shared helpers for Vercel serverless API routes.
 * - Verifies Supabase JWT tokens for authentication
 * - Provides a Supabase client for DB operations
 * - Handles CORS headers for cross-origin requests
 *
 * Works with either:
 *   1. SUPABASE_SERVICE_ROLE_KEY (admin, bypasses RLS) — preferred
 *   2. VITE_SUPABASE_ANON_KEY + user JWT (RLS-based) — fallback
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

/* ── Supabase client for auth verification ── */
const supabaseAuth = createClient(supabaseUrl, serviceRoleKey || anonKey);

/**
 * Verify the Supabase JWT from the Authorization header.
 * Returns the authenticated user object, or null if invalid.
 */
export async function verifyUser(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabaseAuth.auth.getUser(token);
  if (error || !data?.user) return null;

  return { ...data.user, _token: token };
}

/**
 * Get a Supabase client for DB operations.
 * If service role key is available, returns an admin client (bypasses RLS).
 * Otherwise, returns a client authenticated with the user's JWT (uses RLS).
 */
export function getSupabaseClient(userToken) {
  if (serviceRoleKey) {
    return createClient(supabaseUrl, serviceRoleKey);
  }
  // Fallback: create a client with the user's JWT for RLS-based access
  return createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${userToken}` } },
  });
}

/**
 * Allowed CORS origins — restrict to our own domain.
 * In development, also allow localhost.
 */
const ALLOWED_ORIGINS = [
  "https://skeddo.ca",
  "https://www.skeddo.ca",
  "https://staging.skeddo.ca",
];

// Allow localhost in development
if (process.env.NODE_ENV !== "production") {
  ALLOWED_ORIGINS.push("http://localhost:5173", "http://localhost:3000");
}

/**
 * Handle CORS preflight OPTIONS request.
 * Returns true if this was a preflight request (caller should return early).
 */
export function handleCors(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Push-Secret");
  res.setHeader("Access-Control-Max-Age", "86400");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}

// Legacy export for any code that references corsHeaders directly
export const corsHeaders = {
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Push-Secret",
};

/**
 * Escape HTML special characters to prevent XSS/HTML injection in emails.
 */
export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
