import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Check your .env file."
  );
}

// Guard: only create the client if both values are present
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : new Proxy(
        {},
        {
          get(_, prop) {
            // Return chainable no-ops so the app doesn't crash — it'll just fall back to localStorage
            if (prop === "auth") {
              return {
                getSession: () => Promise.resolve({ data: { session: null } }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
                signUp: () => Promise.reject(new Error("Supabase not configured")),
                signInWithPassword: () => Promise.reject(new Error("Supabase not configured")),
                signOut: () => Promise.resolve({}),
                resetPasswordForEmail: () => Promise.reject(new Error("Supabase not configured")),
              };
            }
            if (prop === "from") {
              const noOp = () => ({
                select: () => noOp(),
                insert: () => noOp(),
                update: () => noOp(),
                upsert: () => noOp(),
                delete: () => noOp(),
                eq: () => noOp(),
                single: () => noOp(),
                order: () => noOp(),
                then: (cb) => cb({ data: null, error: { message: "Supabase not configured" } }),
              });
              return () => noOp();
            }
            return undefined;
          },
        }
      );
