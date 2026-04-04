import { useState, useEffect } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

export default function AuthPage({ mode, onNavigate, onAuthSuccess, initialError }) {
  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError || "");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  // BUG #3: clear error when switching between sign-in / sign-up
  useEffect(() => {
    setError(initialError || "");
    setShowResend(false);
    setResendSent(false);
  }, [mode, initialError]);

  const isSignUp = mode === "signup";
  const title = isSignUp ? "Create your account" : "Welcome back";
  const subtitle = isSignUp
    ? "Start planning in seconds."
    : "Sign in to pick up where you left off.";
  const buttonText = isSignUp ? "Create Account" : "Sign In";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // BUG #1/#2: inline validation before API call
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (isSignUp && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const data = await signUp(email, password);
        // Supabase may require email confirmation
        if (data?.user && !data.session) {
          setConfirmationSent(true);
        } else {
          onAuthSuccess();
        }
      } else {
        await signIn(email, password);
        onAuthSuccess();
      }
    } catch (err) {
      const msg = err.message || "Something went wrong. Please try again.";
      setError(msg);
      // If "email not confirmed", show resend option
      if (msg.toLowerCase().includes("not confirmed") || msg.toLowerCase().includes("not been confirmed")) {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      await supabase.auth.resend({ type: "signup", email });
      setResendSent(true);
      setError("");
    } catch (err) {
      setError("Could not resend confirmation. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email address first, then tap Forgot Password.");
      return;
    }
    setResetLoading(true);
    setError("");
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (resetErr) throw resetErr;
      setResetSent(true);
    } catch (err) {
      setError(err.message || "Could not send reset email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  // BUG #9: Set new password form (shown when user arrives via password reset link)
  if (mode === "resetpassword") {
    return (
      <SetPasswordForm onSuccess={onAuthSuccess} />
    );
  }

  if (resetSent) {
    return (
      <div
        style={{
          fontFamily: "'Barlow', sans-serif",
          background: C.cream,
          minHeight: "100dvh",
          maxWidth: 480,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Barlow:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${C.cream}; }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#9993;</div>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 26,
              color: C.ink,
              marginBottom: 8,
            }}
          >
            Check your email
          </h1>
          <p
            style={{
              fontSize: 14,
              color: C.muted,
              lineHeight: 1.6,
              maxWidth: 300,
              margin: "0 auto 24px",
            }}
          >
            We sent a password reset link to <strong style={{ color: C.ink }}>{email}</strong>.
            Follow the link to set a new password.
          </p>
          <p
            style={{
              fontSize: 13,
              color: C.muted,
              lineHeight: 1.6,
              maxWidth: 300,
              margin: "0 auto 24px",
            }}
          >
            Didn't get it? If you haven't confirmed your email yet, check for
            our earlier confirmation email and confirm your account first.
          </p>
          <button
            onClick={() => { setResetSent(false); setError(""); }}
            style={{
              ...s.secondaryBtn,
              padding: "12px 32px",
              borderRadius: 12,
              fontSize: 14,
              flex: "none",
            }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (confirmationSent) {
    return (
      <div
        style={{
          fontFamily: "'Barlow', sans-serif",
          background: C.cream,
          minHeight: "100dvh",
          maxWidth: 480,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Barlow:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${C.cream}; }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#9993;</div>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 26,
              color: C.ink,
              marginBottom: 8,
            }}
          >
            Check your email
          </h1>
          <p
            style={{
              fontSize: 14,
              color: C.muted,
              lineHeight: 1.6,
              maxWidth: 300,
              margin: "0 auto 24px",
            }}
          >
            We sent a confirmation link to <strong style={{ color: C.ink }}>{email}</strong>.
            Click the link in your email to activate your account — you'll be logged in automatically.
          </p>
          <button
            onClick={() => onNavigate("signin")}
            style={{
              ...s.secondaryBtn,
              padding: "12px 32px",
              borderRadius: 12,
              fontSize: 14,
              flex: "none",
            }}
          >
            Already confirmed? Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Barlow', sans-serif",
        background: C.cream,
        minHeight: "100dvh",
        maxWidth: 480,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Barlow:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.cream}; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus { outline: none; border-color: ${C.seaGreen} !important; box-shadow: 0 0 0 3px rgba(45,159,111,0.12); }
      `}</style>

      <div style={{ animation: "fadeUp 0.4s ease" }}>
        {/* Back button */}
        <button
          onClick={() => onNavigate("landing")}
          aria-label="Back to Skeddo home page"
          style={{
            background: "none",
            border: "none",
            color: C.seaGreen,
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 24,
            padding: 0,
          }}
        >
          &larr; Back to Home
        </button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src="/skeddo-logo-dark.png"
            alt="Skeddo — kids activity planner"
            width={48}
            height={48}
            style={{ height: 48, width: "auto", borderRadius: 10 }}
          />
        </div>

        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 26,
            color: C.ink,
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: 14,
            color: C.muted,
            textAlign: "center",
            marginBottom: 28,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="auth-email" style={labelStyle}>EMAIL</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={s.input}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="auth-password" style={labelStyle}>PASSWORD</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? "At least 6 characters" : "Your password"}
              required
              minLength={6}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              style={s.input}
            />
            {!isSignUp && (
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                style={{
                  background: "none",
                  border: "none",
                  color: C.seaGreen,
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: resetLoading ? "not-allowed" : "pointer",
                  padding: 0,
                  marginTop: 6,
                  display: "block",
                  opacity: resetLoading ? 0.6 : 1,
                }}
              >
                {resetLoading ? "Sending..." : "Forgot password?"}
              </button>
            )}
          </div>

          {resendSent && (
            <div
              style={{
                background: "rgba(45, 159, 111, 0.1)",
                color: C.seaGreen,
                fontSize: 14,
                fontWeight: 600,
                padding: "12px 14px",
                borderRadius: 10,
                marginBottom: 16,
                lineHeight: 1.4,
              }}
            >
              ✅ Confirmation email resent! Check your inbox (and spam folder) and click the link to confirm.
            </div>
          )}
          {error && (
            <div
              style={{
                background: C.dangerBg,
                color: C.danger,
                fontSize: 14,
                fontWeight: 600,
                padding: "10px 14px",
                borderRadius: 10,
                marginBottom: showResend ? 8 : 16,
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          )}
          {showResend && !resendSent && (
            <button
              type="button"
              onClick={handleResendConfirmation}
              style={{
                background: "none",
                border: `1px solid ${C.seaGreen}`,
                color: C.seaGreen,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Barlow', sans-serif",
                padding: "10px 16px",
                borderRadius: 8,
                cursor: "pointer",
                width: "100%",
                marginBottom: 16,
                minHeight: 44,
              }}
            >
              Resend Confirmation Email
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...s.primaryBtn,
              width: "100%",
              padding: "14px 16px",
              fontSize: 16,
              borderRadius: 12,
              textAlign: "center",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Please wait..." : buttonText}
          </button>
        </form>

        {/* Toggle sign in / sign up */}
        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            color: C.muted,
            marginTop: 20,
          }}
        >
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => onNavigate(isSignUp ? "signin" : "signup")}
            style={{
              background: "none",
              border: "none",
              color: C.seaGreen,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "'Barlow', sans-serif",
              padding: 0,
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ── Set New Password form (used after clicking a password reset link) ── */
function SetPasswordForm({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!password) { setError("Please enter a new password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    try {
      const { error: updateErr } = await supabase.auth.updateUser({ password });
      if (updateErr) throw updateErr;
      setDone(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setError(err.message || "Could not update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", background: C.cream, minHeight: "100dvh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Barlow:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { background: ${C.cream}; } @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } } input:focus { outline: none; border-color: ${C.seaGreen} !important; box-shadow: 0 0 0 3px rgba(45,159,111,0.12); }`}</style>
      <div style={{ animation: "fadeUp 0.4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src="/skeddo-logo-dark.png" alt="Skeddo" width={48} height={48} style={{ height: 48, width: "auto", borderRadius: 10 }} />
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, color: C.ink, textAlign: "center", marginBottom: 6 }}>Set a new password</h1>
        <p style={{ fontSize: 14, color: C.muted, textAlign: "center", marginBottom: 28, lineHeight: 1.5 }}>Choose a password for your Skeddo account.</p>
        {done ? (
          <div style={{ background: "rgba(45,159,111,0.1)", color: C.seaGreen, fontSize: 15, fontWeight: 600, padding: "14px 16px", borderRadius: 12, textAlign: "center" }}>
            ✅ Password updated! Taking you to the app…
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>NEW PASSWORD</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" style={s.input} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>CONFIRM PASSWORD</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password" style={s.input} />
            </div>
            {error && <div style={{ background: C.dangerBg, color: C.danger, fontSize: 14, fontWeight: 600, padding: "10px 14px", borderRadius: 10, marginBottom: 16 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ ...s.primaryBtn, width: "100%", padding: "14px 16px", fontSize: 16, borderRadius: 12, textAlign: "center", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Updating…" : "Set Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: 11,
  fontWeight: 700,
  color: C.muted,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  marginBottom: 4,
  display: "block",
};
