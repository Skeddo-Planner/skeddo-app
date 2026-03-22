import { useState } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import { uid } from "../constants/sampleData";

export default function OnboardingFlow({ onComplete }) {
  const [screen, setScreen] = useState(0);
  const [kids, setKids] = useState([]);
  const [kidName, setKidName] = useState("");
  const [kidAge, setKidAge] = useState("");
  const [kidBirthMonth, setKidBirthMonth] = useState("");
  const [kidBirthYear, setKidBirthYear] = useState("");

  /* Profile fields collected during onboarding */
  const [displayName, setDisplayName] = useState("");
  const [postalCode, setPostalCode] = useState("");

  /* Validation state */
  const [showErrors, setShowErrors] = useState(false);

  /* Invite sharing state */

  const addKid = () => {
    if (!kidName.trim()) return;
    const bm = kidBirthMonth ? Number(kidBirthMonth) : null;
    const by = kidBirthYear ? Number(kidBirthYear) : null;
    // Compute age from birth month/year if available
    let computedAge = kidAge || "";
    if (bm && by) {
      const now = new Date();
      let a = now.getFullYear() - by;
      if (now.getMonth() + 1 < bm) a -= 1;
      computedAge = String(a);
    }
    setKids((prev) => [...prev, {
      id: uid(),
      name: kidName.trim(),
      age: computedAge,
      birthMonth: bm,
      birthYear: by,
    }]);
    setKidName("");
    setKidAge("");
    setKidBirthMonth("");
    setKidBirthYear("");
  };

  const removeKid = (id) => {
    setKids((prev) => prev.filter((k) => k.id !== id));
  };

  const handleAboutYouNext = () => {
    if (!displayName.trim() || !postalCode.trim()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setScreen(2);
  };

  const handleComplete = () => {
    const profileData = {
      displayName: displayName.trim(),
      postalCode: postalCode.trim().toUpperCase(),
      plan: "free",
    };
    onComplete(kids, profileData);
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

        {/* ─── SCREEN 0: Welcome ─── */}
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
                fontFamily: "'Poppins', sans-serif",
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
              The planner for busy families
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

        {/* ─── SCREEN 1: About You ─── */}
        {screen === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <h1
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 26,
                color: C.ink,
                lineHeight: 1.2,
                marginBottom: 6,
                textAlign: "center",
              }}
            >
              Tell us about <em style={{ color: C.olive }}>you</em>
            </h1>

            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 14,
                color: C.muted,
                textAlign: "center",
                marginBottom: 28,
                lineHeight: 1.5,
              }}
            >
              A couple of quick details to personalize your experience.
            </p>

            {/* Display Name */}
            <div style={{ marginBottom: 16 }}>
              <div style={labelStyle}>
                YOUR NAME <span style={{ color: C.danger }}>*</span>
              </div>
              <input
                style={{
                  ...s.input,
                  ...(showErrors && !displayName.trim() ? errorBorder : {}),
                }}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Nicole"
                autoFocus
              />
              {showErrors && !displayName.trim() && (
                <div style={errorText}>Please enter your name</div>
              )}
            </div>

            {/* Postal Code */}
            <div style={{ marginBottom: 24 }}>
              <div style={labelStyle}>
                POSTAL CODE <span style={{ color: C.danger }}>*</span>
              </div>
              <input
                style={{
                  ...s.input,
                  ...(showErrors && !postalCode.trim() ? errorBorder : {}),
                }}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                placeholder="V6B 1A1"
                maxLength={7}
              />
              {showErrors && !postalCode.trim() && (
                <div style={errorText}>Please enter your postal code</div>
              )}
              <div style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 11,
                color: C.muted,
                marginTop: 4,
              }}>
                This helps us show programs near you
              </div>
            </div>

            {/* Navigation buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{
                  ...s.secondaryBtn,
                  textAlign: "center",
                }}
                onClick={() => setScreen(0)}
              >
                Back
              </button>
              <button
                style={{
                  ...s.primaryBtn,
                  textAlign: "center",
                }}
                onClick={handleAboutYouNext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ─── SCREEN 2: Add Kids ─── */}
        {screen === 2 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <h1
              style={{
                fontFamily: "'Poppins', sans-serif",
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
            <div style={{ marginBottom: 4 }}>
              <div style={labelStyle}>NAME</div>
              <input
                style={s.input}
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                placeholder="e.g. Maya"
                onKeyDown={(e) => e.key === "Enter" && addKid()}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={labelStyle}>WHEN WAS {kidName.trim() ? kidName.trim().toUpperCase() : "THIS CHILD"} BORN?</div>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, margin: "0 0 6px", lineHeight: 1.4 }}>
                Optional — helps us show age-appropriate programs.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <select
                  style={{ ...s.input, flex: 1 }}
                  value={kidBirthMonth}
                  onChange={(e) => setKidBirthMonth(e.target.value)}
                >
                  <option value="">Month</option>
                  {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select
                  style={{ ...s.input, flex: 1 }}
                  value={kidBirthYear}
                  onChange={(e) => setKidBirthYear(e.target.value)}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 19 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
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
                        fontFamily: "'Poppins', sans-serif",
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
                      {(k.age || (k.birthMonth && k.birthYear)) && (
                        <div
                          style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontSize: 11,
                            color: C.muted,
                          }}
                        >
                          Age {k.birthMonth && k.birthYear ? (() => {
                            const now = new Date();
                            let a = now.getFullYear() - k.birthYear;
                            if (now.getMonth() + 1 < k.birthMonth) a -= 1;
                            return a;
                          })() : k.age}
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
                onClick={() => {
                  setKids([]); // Skip means don't save any kids
                  setScreen(4);
                }}
              >
                Skip
              </button>
              <button
                style={{
                  ...s.primaryBtn,
                  textAlign: "center",
                  opacity: kids.length === 0 ? 0.5 : 1,
                }}
                onClick={() => setScreen(4)}
                disabled={kids.length === 0}
              >
                Next ({kids.length} kid{kids.length !== 1 ? "s" : ""})
              </button>
            </div>
          </div>
        )}

        {/* ─── SCREEN 4: All Set ─── */}
        {screen === 4 && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease" }}>
            {/* Celebration icon */}
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#9788;</div>

            <h1
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 28,
                color: C.ink,
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              You're all set, {displayName.trim().split(" ")[0] || "there"}!
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
              Let's start planning
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
        {[0, 1, 2, 3, 4].map((i) => (
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
  color: "#4A6FA5",
  textTransform: "uppercase",
  letterSpacing: 0.8,
  marginBottom: 4,
};

/* Error styles */
const errorBorder = {
  borderColor: "#C0392B",
};

const errorText = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: 12,
  color: "#C0392B",
  fontWeight: 600,
  marginTop: 4,
};
