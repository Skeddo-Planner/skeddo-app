import { useState } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";

export default function InviteAcceptPage({ inviteCode, session, onAccept, onSignIn, onSignUp }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      await onAccept(inviteCode);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <img
        src="/skeddo-logo-dark.png"
        alt="Skeddo"
        style={{ height: 56, width: "auto", borderRadius: 10, marginBottom: 24 }}
      />

      {success ? (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{"\u2705"}</div>
          <h1 style={{
            fontFamily: "'Poppins', sans-serif", fontSize: 24, color: C.ink,
            lineHeight: 1.2, marginBottom: 8,
          }}>
            You're connected!
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 24 }}>
            You now have access to their schedule. Head to the app to start managing activities together.
          </p>
          <button
            style={{ ...s.primaryBtn, padding: "12px 32px", fontSize: 15 }}
            onClick={() => window.location.href = "/"}
          >
            Open Skeddo
          </button>
        </>
      ) : session ? (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{"\uD83D\uDD17"}</div>
          <h1 style={{
            fontFamily: "'Poppins', sans-serif", fontSize: 24, color: C.ink,
            lineHeight: 1.2, marginBottom: 8,
          }}>
            You've been invited
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 24, maxWidth: 320 }}>
            Someone invited you to help manage a child's schedule on Skeddo. Tap below to accept.
          </p>

          {error && (
            <div style={{
              background: C.dangerBg, color: C.danger, borderRadius: 8, padding: "10px 14px",
              fontSize: 13, marginBottom: 16, width: "100%", maxWidth: 320,
            }}>
              {error}
            </div>
          )}

          <button
            style={{ ...s.primaryBtn, padding: "12px 32px", fontSize: 15, opacity: loading ? 0.6 : 1 }}
            onClick={handleAccept}
            disabled={loading}
          >
            {loading ? "Accepting..." : "Accept Invite"}
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{"\uD83D\uDD17"}</div>
          <h1 style={{
            fontFamily: "'Poppins', sans-serif", fontSize: 24, color: C.ink,
            lineHeight: 1.2, marginBottom: 8,
          }}>
            You've been invited
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 24, maxWidth: 320 }}>
            Someone invited you to help manage a child's schedule on Skeddo. Sign in or create an account to accept.
          </p>
          <div style={{ display: "flex", gap: 10, flexDirection: "column", width: "100%", maxWidth: 280 }}>
            <button
              style={{ ...s.primaryBtn, padding: "12px 24px", fontSize: 15 }}
              onClick={onSignUp}
            >
              Get Started
            </button>
            <button
              style={{ ...s.secondaryBtn, padding: "12px 24px", fontSize: 14 }}
              onClick={onSignIn}
            >
              I already have an account
            </button>
          </div>
        </>
      )}
    </div>
  );
}
