import { useState, useEffect } from "react";
import { C } from "../constants/brand";

export default function ComingSoonPage() {
  const launchDate = new Date("2026-04-01T00:00:00-07:00"); // April 1, PDT

  const calcTimeLeft = () => {
    const now = new Date();
    const diff = launchDate - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        fontFamily: "'Barlow', sans-serif",
        background: C.ink,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 24px",
        textAlign: "center",
        color: C.cream,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.ink}; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <div style={{ animation: "fadeUp 0.6s ease", maxWidth: 420 }}>
        {/* Logo */}
        <img
          src="/skeddo-logo-dark.png"
          alt="Skeddo"
          style={{
            height: 88,
            width: "auto",
            borderRadius: 18,
            marginBottom: 32,
          }}
        />

        {/* Tagline */}
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 36,
            color: C.cream,
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          Something <em style={{ color: C.olive }}>great</em> is coming
        </h1>

        <p
          style={{
            fontSize: 16,
            color: C.muted,
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          The planner for busy families — launching April 1, 2026
        </p>

        {/* Countdown */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Min" },
            { value: timeLeft.seconds, label: "Sec" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 40,
                  fontWeight: 400,
                  color: C.seaGreen,
                  lineHeight: 1,
                  minWidth: 56,
                }}
              >
                {pad(value)}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  color: C.muted,
                  marginTop: 6,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature preview */}
        <div
          style={{
            background: "rgba(58,158,106,0.08)",
            borderRadius: 16,
            padding: "24px 20px",
            marginBottom: 32,
            border: `1px solid rgba(58,158,106,0.15)`,
          }}
        >
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.8,
              color: "rgba(250,248,243,0.8)",
            }}
          >
            Browse <strong style={{ color: C.seaGreen }}>700+ camps & programs</strong> across Vancouver
            <br />
            Track waitlists · Manage budgets · Coordinate schedules
          </p>
        </div>

        {/* Footer text */}
        <p
          style={{
            fontSize: 13,
            color: C.muted,
            animation: "pulse 2.5s ease-in-out infinite",
          }}
        >
          skeddo.ca
        </p>
      </div>
    </div>
  );
}
