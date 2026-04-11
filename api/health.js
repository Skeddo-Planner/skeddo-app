/**
 * Health check endpoint for diagnosing Supabase connectivity issues.
 * GET /api/health — returns env var status and basic DB connectivity.
 *
 * This endpoint does NOT expose secrets — it only reports whether
 * env vars are present and whether basic queries succeed.
 */

import { createClient } from "@supabase/supabase-js";
import { handleCors } from "./_helpers.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  const health = {
    timestamp: new Date().toISOString(),
    env: {
      VITE_SUPABASE_URL: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "MISSING",
      SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey ? "SET" : "MISSING",
      VITE_SUPABASE_ANON_KEY: anonKey ? "SET" : "MISSING",
      NODE_ENV: process.env.NODE_ENV || "unset",
    },
    db: { status: "unknown" },
    tables: {},
  };

  // Test DB connectivity
  if (supabaseUrl && (serviceRoleKey || anonKey)) {
    try {
      const sb = createClient(supabaseUrl, serviceRoleKey || anonKey);

      // Check key tables exist and are queryable
      const tables = ["profiles", "kids", "user_programs", "circles", "circle_memberships"];
      for (const table of tables) {
        try {
          const { count, error } = await sb
            .from(table)
            .select("*", { count: "exact", head: true });
          health.tables[table] = error
            ? { status: "error", message: error.message, code: error.code }
            : { status: "ok", rowCount: count };
        } catch (err) {
          health.tables[table] = { status: "error", message: err.message };
        }
      }

      // Check if the handle_new_user trigger exists
      const { data: triggers, error: trigErr } = await sb.rpc("check_trigger_exists", {
        trigger_name: "on_auth_user_created",
      }).catch(() => ({ data: null, error: { message: "RPC not available" } }));

      health.db.status = "connected";
      health.db.triggerCheck = triggers != null ? "available" : "rpc not set up (ok)";
    } catch (err) {
      health.db.status = "failed";
      health.db.error = err.message;
    }
  } else {
    health.db.status = "no credentials";
  }

  return res.status(200).json(health);
}
