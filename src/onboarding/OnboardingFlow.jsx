import { useState } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export default function OnboardingFlow({ onComplete }) {
  const [screen, setScreen] = useState(0);
  const [kids, setKids] = useState([]);
  const [kidName, setKidName] = useState("");
  const [kidAge, setKidAge] = useState("");

  const addKid = () => {
    if (!kidName.trim()) return;
    setKids((prev) => [...prev, { id: uid(), name: kidName.trim(), age: kidAge || "" }]);
    setKidName("");
    setKidAge("");
  };

  const removeKid = (id) => {
    setKids((prev) => prev.filter((k) => k.id !== id));
  };

  const handleComplete = () => {
    onComplete(kids);
  };

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
        position: "relative",
      }}
    >
      {/* Main content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px 100px" }}>

        {/* ─── SCREEN 1: Welcome ─── */}
        {screen === 0 && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease" }}>
            {/* Logo */}
            <img
              src="/skeddo-logo-dark.png"
              alt="Skeddo"
              style={{
                height: 64,
                width: "auto",
                borderRadius: 12,
                marginBottom: 24,
              }}
            />

            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 28,
                color: C.ink,
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              Welcome to Skeddo
            </h1>

            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 16,
                color: C.muted,
                lineHeight: 1.5,
                marginBottom: 24,
              }}
            >
              The summer planner for busy families
            </p>

            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 14,
                color: C.ink,
                lineHeight: 1.7,
                maxWidth: 320,
                margin: "0 auto 32px",
              }}
            >
              Track camps, manage waitlists, and keep your budget in check &mdash; all in one place.
            </p>

            <button
              style={{
                ...s.primaryBtn,
                flex: "none",
                padding: "14px 40px",
                fontSize: 16,
                borderRadius: 12,
              }}
              onClick={() => setScreen(1)}
            >
              Get Started
            </button>
          </div>
        )}

        {/* ─── SCREEN 2: Add Kids ─── */}
        {screen === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 26,
                color: C.ink,
                lineHeight: 1.2,
                marginBottom: 6,
                textAlign: "center",
              }}
            >
              Who are we planning for?
            </h1>

            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 14,
                color: C.muted,
                textAlign: "center",
                marginBottom: 24,
                lineHeight: 1.5,
              }}
            >
              Add your kids so you can assign programs to them.
            </p>

            {/* Add kid form */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 12,
                alignItems: "flex-end",
              }}
            >
              <div style={{ flex: 2 }}>
                <div style={labelStyle}>NAME</div>
                <input
                  style={s.input}
                  value={kidName}
                  onChange={(e) => setKidName(e.target.value)}
                  placeholder="e.g. Maya"
                  onKeyDown={(e) => e.key === "Enter" && addKid()}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={labelStyle}>AGE</div>
                <input
                  style={s.input}
                  type="number"
                  value={kidAge}
                  onChange={(e) => setKidAge(e.target.value)}
                  placeholder="7"
                  onKeyDown={(e) => e.key === "Enter" && addKid()}
                />
              </div>
            </div>

            <button
              onClick={addKid}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: C.seaGreen,
                background: "transparent",
                border: `1.5px solid ${C.seaGreen}`,
                borderRadius: 10,
                padding: "8px 16px",
                cursor: "pointer",
                width: "100%",
                marginBottom: 20,
              }}
            >
              + Add another
            </button>

            {/* Added kids */}
            {kids.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {kids.map((k) => (
                  <div
                    key={k.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: C.white,
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      padding: "8px 12px",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: `linear-gradient(135deg, ${C.seaGreen}, ${C.blue})`,
                        color: C.cream,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Instrument Serif', serif",
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      {k.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Barlow', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.ink,
                        }}
                      >
                        {k.name}
                      </div>
                      {k.age && (
                        <div
                          style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontSize: 11,
                            color: C.muted,
                          }}
                        >
                          Age {k.age}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeKid(k.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: C.muted,
                        fontSize: 16,
                        cursor: "pointer",
                        padding: "0 2px",
                        lineHeight: 1,
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{
                  ...s.secondaryBtn,
                  textAlign: "center",
                }}
                onClick={() => setScreen(2)}
              >
                Skip
              </button>
              <button
                style={{
                  ...s.primaryBtn,
                  textAlign: "center",
                }}
                onClick={() => setScreen(2)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ─── SCREEN 3: All Set ─── */}
        {screen === 2 && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease" }}>
            {/* Celebration icon */}
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#9788;</div>

            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 28,
                color: C.ink,
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              You're all set!
            </h1>

            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 15,
                color: C.muted,
                lineHeight: 1.6,
                maxWidth: 300,
                margin: "0 auto 24px",
              }}
            >
              {kids.length > 0
                ? `Great \u2014 ${kids.map((k) => k.name).join(" & ")} ${kids.length === 1 ? "is" : "are"} ready to go.`
                : "You can always add kids later from the Home tab."}
            </p>

            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 13,
                color: C.olive,
                fontWeight: 600,
                marginBottom: 32,
                lineHeight: 1.5,
              }}
            >
              Tip: Check out the Discover tab to browse local camps and classes.
            </p>

            <button
              style={{
                ...s.primaryBtn,
                flex: "none",
                padding: "14px 40px",
                fontSize: 16,
                borderRadius: 12,
              }}
              onClick={handleComplete}
            >
              Start planning your summer
            </button>
          </div>
        )}
      </div>

      {/* ─── Dot indicator ─── */}
      <div
        style={{
          position: "fixed",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 10,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: screen === i ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: screen === i ? C.seaGreen : C.border,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* Reusable label style for this component */
const labelStyle = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: 11,
  fontWeight: 700,
  color: "#8A9A8E",
  textTransform: "uppercase",
  letterSpacing: 0.8,
  marginBottom: 4,
};
