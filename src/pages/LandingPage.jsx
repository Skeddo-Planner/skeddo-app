import { useState, useEffect } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import useIsDesktop from "../hooks/useIsDesktop";

const BASE_FEATURES = [
  {
    icon: "\uD83D\uDD0D",
    titleTemplate: (count) => `Browse ${count} Programs`,
    desc: "Search and filter kids camps, classes, and summer programs across Vancouver and the Lower Mainland. Filter by age, neighbourhood, price, and activity type.",
  },
  {
    icon: "\uD83D\uDCCB",
    title: "Track Registrations & Waitlists",
    desc: "Keep track of what's enrolled, waitlisted, and still exploring. Never lose track of a camp registration deadline again.",
  },
  {
    icon: "\uD83D\uDCB0",
    title: "Budget Across All Kids",
    desc: "Set a budget goal and see exactly how much you're committing per kid. No more spreadsheet surprises.",
  },
  {
    icon: "\uD83D\uDCC5",
    title: "One Schedule, Every Kid",
    desc: "See all your kids' activities on one calendar. Spot conflicts and free days at a glance.",
  },
];

export default function LandingPage({ onNavigate }) {
  const [programCount, setProgramCount] = useState(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    import("../data/programs-summary.json").then((m) => {
      const rounded = Math.floor(m.default.totalPrograms / 1000) * 1000;
      setProgramCount(rounded);
    });
  }, []);

  const countLabel = programCount
    ? `${programCount.toLocaleString()}+`
    : "...";

  const features = BASE_FEATURES.map((f) =>
    f.titleTemplate
      ? { ...f, title: f.titleTemplate(countLabel) }
      : f
  );

  return (
    <div style={{ background: C.cream, minHeight: "100dvh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Barlow:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.cream}; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Desktop header — logo left, Log In right */}
      {isDesktop && (
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: C.white,
          borderBottom: `0.5px solid rgba(27,36,50,0.08)`,
          padding: "0 32px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <img
            src="/skeddo-logo-dark.png"
            alt="Skeddo"
            style={{ height: 38, width: "auto", borderRadius: 8 }}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => onNavigate("signin")}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: C.seaGreen,
                background: "transparent",
                border: `1.5px solid ${C.seaGreen}`,
                borderRadius: 8,
                padding: "8px 20px",
                cursor: "pointer",
              }}
            >
              Log In
            </button>
            <button
              onClick={() => onNavigate("signup")}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                background: C.seaGreen,
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                cursor: "pointer",
              }}
            >
              Get Started Free
            </button>
          </div>
        </header>
      )}

      <main
        role="main"
        style={{
          fontFamily: "'Barlow', sans-serif",
          maxWidth: 480,
          margin: "0 auto",
          padding: isDesktop ? "48px 24px 60px" : "40px 24px 60px",
        }}
      >
      <div style={{ animation: "fadeUp 0.5s ease", textAlign: "center" }}>
        {/* Logo — only show on mobile (desktop header has it) */}
        {!isDesktop && (
          <img
            src="/skeddo-logo-dark.png"
            alt="Skeddo — kids activity planner for Vancouver families"
            width={80}
            height={80}
            style={{ height: 80, width: "auto", borderRadius: 16, marginBottom: 24 }}
          />
        )}

        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: isDesktop ? 36 : 30,
            color: C.ink,
            lineHeight: 1.2,
            marginBottom: 8,
            marginTop: isDesktop ? 0 : 0,
          }}
        >
          Plan Your Kids' Camps &amp; Classes — All in One Place
        </h1>

        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, marginBottom: 24, maxWidth: 340, margin: "0 auto 24px" }}>
          The family planner for busy parents in Vancouver &amp; the Lower Mainland. Browse kids activities, track registrations, and stay on budget.
        </p>

        {/* CTA */}
        <div style={{ maxWidth: 300, margin: "0 auto 40px" }}>
          <button
            onClick={() => onNavigate("signup")}
            style={{
              ...s.primaryBtn,
              display: "block",
              padding: "14px 40px",
              fontSize: 16,
              borderRadius: 12,
              width: "100%",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Get Started — It's Free
          </button>
          <button
            onClick={() => onNavigate("signin")}
            style={{
              ...s.secondaryBtn,
              display: "block",
              padding: "13px 40px",
              fontSize: 16,
              borderRadius: 12,
              width: "100%",
              textAlign: "center",
              color: C.seaGreen,
              border: `1.5px solid ${C.seaGreen}`,
            }}
          >
            Log In
          </button>
        </div>
      </div>

      {/* Feature sections with SEO keywords */}
      <div style={{ animation: "fadeUp 0.6s ease" }}>
        {features.map((f, i) => (
          <div
            key={i}
            style={{
              background: C.white,
              borderRadius: 14,
              padding: "18px 20px",
              marginBottom: 12,
              boxShadow: "0 2px 8px rgba(27, 36, 50, 0.07), 0 1px 3px rgba(27, 36, 50, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <h2 style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 16, fontWeight: 700, color: C.ink,
                  marginBottom: 4, lineHeight: 1.3,
                }}>
                  {f.title}
                </h2>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Local SEO content */}
      <div style={{
        textAlign: "center", marginTop: 24, padding: "20px 16px",
        background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(27, 36, 50, 0.07), 0 1px 3px rgba(27, 36, 50, 0.04)",
      }}>
        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 20, color: C.ink, marginBottom: 8,
        }}>
          Built for Vancouver &amp; Lower Mainland Families
        </h2>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
          Skeddo covers kids activities and summer programs from 150+ providers including City of Vancouver community centres,
          Pedalheads, Science World, and dozens of local camps across Riley Park, Mount Pleasant,
          Kensington, Grandview-Woodland, Burnaby, North Vancouver, and more across the Lower Mainland.
        </p>
      </div>

      {/* Trust signals */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 20, marginTop: 20,
        fontSize: 13, color: C.muted, fontWeight: 600,
      }}>
        <span>{countLabel} programs</span>
        <span>·</span>
        <span>150+ providers</span>
        <span>·</span>
        <span>Free</span>
      </div>

      <footer style={{
        textAlign: "center", fontSize: 12, color: C.muted, marginTop: 24,
      }}>
        <p>Made by Mended with Gold Inc. · Vancouver, BC</p>
      </footer>
      </main>
    </div>
  );
}
