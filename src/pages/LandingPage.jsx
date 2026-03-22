import { C } from "../constants/brand";
import { s } from "../styles/shared";

const features = [
  {
    icon: "\uD83D\uDD0D",
    title: "Browse 2,000+ Programs",
    desc: "Search and filter kids camps, classes, and activities across Vancouver. Filter by age, neighbourhood, price, and activity type.",
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
  return (
    <div
      style={{
        fontFamily: "'Barlow', sans-serif",
        background: C.cream,
        minHeight: "100vh",
        maxWidth: 480,
        margin: "0 auto",
        padding: "40px 24px 60px",
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

      <div style={{ animation: "fadeUp 0.5s ease", textAlign: "center" }}>
        {/* Logo */}
        <img
          src="/skeddo-logo-dark.png"
          alt="Skeddo — kids activity planner for Vancouver families"
          width={80}
          height={80}
          style={{ height: 80, width: "auto", borderRadius: 16, marginBottom: 24 }}
        />

        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 30,
            color: C.ink,
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          Plan Your Kids' Camps &amp; Classes — All in One Place
        </h1>

        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, marginBottom: 24, maxWidth: 340, margin: "0 auto 24px" }}>
          The planner for busy families in Vancouver. Browse programs, track registrations, and stay on budget.
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
              marginBottom: 16,
            }}
          >
            Get Started — It's Free
          </button>
          <p style={{ fontSize: 14, color: C.muted, textAlign: "center" }}>
            Already have an account?{" "}
            <button
              onClick={() => onNavigate("signin")}
              style={{
                background: "none", border: "none",
                color: C.seaGreen, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Barlow', sans-serif", fontSize: 14,
              }}
            >
              Sign In
            </button>
          </p>
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
              border: `1px solid ${C.border}`,
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
          Built for Vancouver Families
        </h2>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
          Skeddo covers programs from 150+ providers including City of Vancouver community centres,
          Pedalheads, Science World, and dozens of local camps across Riley Park, Mount Pleasant,
          Kensington, Grandview-Woodland, and more.
        </p>
      </div>

      {/* Trust signals */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 20, marginTop: 20,
        fontSize: 13, color: C.muted, fontWeight: 600,
      }}>
        <span>2,000+ programs</span>
        <span>·</span>
        <span>150+ providers</span>
        <span>·</span>
        <span>Free</span>
      </div>

      <p style={{
        textAlign: "center", fontSize: 11, color: C.muted, marginTop: 24,
      }}>
        Made by Mended with Gold Inc. · Vancouver, BC
      </p>
    </div>
  );
}
