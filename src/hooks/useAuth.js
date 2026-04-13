import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { trackEvent } from "../utils/analytics";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
      setLoading(false);
    }).catch(() => { setLoading(false); });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // BUG #9: detect password recovery flow so app can show set-password form
        if (_event === "PASSWORD_RECOVERY") {
          setPasswordRecovery(true);
        }
        setUser(session?.user ?? null);
        setSession(session ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const clearPasswordRecovery = useCallback(() => {
    setPasswordRecovery(false);
  }, []);

  const signUp = useCallback(async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    // Handle "already registered but unconfirmed" — resend confirmation
    if (error) {
      if (error.message?.toLowerCase().includes("already registered")) {
        // Resend confirmation email instead of showing error
        await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: window.location.origin } });
        return { user: { email }, session: null };
      }
      throw error;
    }
    // If user already exists (Supabase returns user with no identities), tell them
    if (data?.user && data.user.identities?.length === 0) {
      throw new Error("An account with this email already exists. Try signing in instead.");
    }

    trackEvent("sign_up", { method: "email" });

    // Notify founders about the new sign-up (fire-and-forget, don't block the user)
    try {
      fetch("/api/notify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName: displayName || "" }),
      }).catch(() => {});
    } catch {}

    // Send welcome email with beta link to the new user (fire-and-forget)
    try {
      fetch("/api/welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName: displayName || "" }),
      }).catch(() => {});
    } catch {}

    return data;
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    trackEvent("login", { method: "email" });
    return data;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    trackEvent("sign_up", { method: "google" });
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  return { user, session, loading, signUp, signIn, signInWithGoogle, signOut, passwordRecovery, clearPasswordRecovery };
}
