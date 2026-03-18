import { C } from "../constants/brand";
import { s } from "../styles/shared";

export default function LandingPage({ onNavigate }) {
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
        alignItems: "center",
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

      <div style={{ animation: "fadeUp 0.5s ease" }}>
        {/* Logo */}
        <img
          src="/skeddo-logo-dark.png"
          alt="Skeddo"
          style={{
            height: 80,
            width: "auto",
            borderRadius: 16,
            marginBottom: 24,
          }}
        />

        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 32,
            color: C.ink,
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          Welcome to Skeddo
        </h1>

        <p
          style={{
            fontSize: 16,
            color: C.muted,
            lineHeight: 1.6,
            marginBottom: 12,
          }}
        >
          The summer planner for busy families
        </p>

        <p
          style={{
            fontSize: 14,
            color: C.ink,
            lineHeight: 1.7,
            maxWidth: 320,
            margin: "0 auto 40px",
          }}
        >
          Track camps, manage waitlists, and keep your budget in check &mdash;
          all in one place.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 300, margin: "0 auto" }}>
          <button
            onClick={() => onNavigate("signup")}
            style={{
              ...s.primaryBtn,
              padding: "14px 40px",
              fontSize: 16,
              borderRadius: 12,
              width: "100%",
              textAlign: "center",
            }}
          >
            Get Started
          </button>

          <button
            onClick={() => onNavigate("signin")}
            style={{
              ...s.secondaryBtn,
              padding: "14px 40px",
              fontSize: 16,
              borderRadius: 12,
              width: "100%",
              textAlign: "center",
              flex: "none",
            }}
          >
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
}
