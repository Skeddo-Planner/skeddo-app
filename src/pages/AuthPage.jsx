import { useState } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage({ mode, onNavigate, onAuthSuccess }) {
  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const isSignUp = mode === "signup";
  const title = isSignUp ? "Create your account" : "Welcome back";
  const subtitle = isSignUp
    ? "Start planning your summer in seconds."
    : "Sign in to pick up where you left off.";
  const buttonText = isSignUp ? "Create Account" : "Sign In";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (confirmationSent) {
    return (
      <div
        style={{
          fontFamily: "'Barlow', sans-serif",
          background: C.cream,
          minHeight: "100vh",
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
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@400;500;600;700;800&display=swap');
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
              fontFamily: "'Instrument Serif', serif",
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
            Click the link to activate your account.
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
            Go to Sign In
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
        minHeight: "100vh",
        maxWidth: 480,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.cream}; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus { outline: none; border-color: ${C.seaGreen} !important; box-shadow: 0 0 0 3px rgba(58,158,106,0.12); }
      `}</style>

      <div style={{ animation: "fadeUp 0.4s ease" }}>
        {/* Back button */}
        <button
          onClick={() => onNavigate("landing")}
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
          &larr; Back
        </button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src="/skeddo-logo-dark.png"
            alt="Skeddo"
            style={{ height: 48, width: "auto", borderRadius: 10 }}
          />
        </div>

        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
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
            <label style={labelStyle}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={s.input}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? "At least 6 characters" : "Your password"}
              required
              minLength={6}
              style={s.input}
            />
          </div>

          {error && (
            <div
              style={{
                background: C.dangerBg,
                color: C.danger,
                fontSize: 13,
                fontWeight: 600,
                padding: "10px 14px",
                borderRadius: 10,
                marginBottom: 16,
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
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

const labelStyle = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: 11,
  fontWeight: 700,
  color: "#8A9A8E",
  textTransform: "uppercase",
  letterSpacing: 0.8,
  marginBottom: 4,
  display: "block",
};
