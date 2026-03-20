import { useState } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import Label from "../components/Label";
import Modal from "../components/Modal";
import PaymentMethodSection from "../components/PaymentMethodSection";

/* ─── Subscription Plans ─── */
const PLANS = [
  {
    key: "free",
    name: "Free",
    price: null,
    description: "All features included during early access",
    disabled: false,
  },
  {
    key: "plus",
    name: "Skeddo+",
    price: "$4.99/mo",
    description: "Priority alerts, unlimited saved programs, family sharing",
    disabled: true,
  },
  {
    key: "pro",
    name: "Skeddo Pro",
    price: "$9.99/mo",
    description: "Everything in Plus, plus multi-city search and provider reviews",
    disabled: true,
  },
];

function formatLastSynced(ts) {
  if (!ts) return null;
  const diff = Date.now() - ts;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "Last synced: just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Last synced: ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 12) return `Last synced: ${hours} hour${hours === 1 ? "" : "s"} ago`;
  const d = new Date(ts);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Last synced: Today at ${time}`;
  return `Last synced: ${d.toLocaleDateString("en-CA", { month: "short", day: "numeric" })} at ${time}`;
}

export default function ProfileModal({ profile, setProfile, email, lastSynced, onSignOut, onClose }) {
  // Work on a local draft so changes aren't auto-saved on every keystroke
  const [draft, setDraft] = useState({ ...profile });
  const update = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  // Bug report state
  const [showBugForm, setShowBugForm] = useState(false);
  const [bugDescription, setBugDescription] = useState("");
  const [bugStatus, setBugStatus] = useState(null); // null | "sending" | "sent" | "error"

  const handleSave = () => {
    setProfile(draft);
    onClose();
  };
  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h3 style={s.modalTitle}>Your Profile</h3>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.5 }}>
        Manage your account details and preferences.
      </p>

      {/* ─── Account Section ─── */}
      <SectionLabel>Account</SectionLabel>

      <Label>Display Name</Label>
      <input
        style={s.input}
        value={draft.displayName || ""}
        onChange={(e) => update("displayName", e.target.value)}
        placeholder="e.g. Nicole"
      />

      <Label>Email</Label>
      <input
        style={{ ...s.input, background: "#F0EDE6", color: C.muted, cursor: "not-allowed" }}
        value={email || ""}
        readOnly
        tabIndex={-1}
      />
      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 4, marginBottom: 8 }}>
        Email is managed through your sign-in account
      </div>

      <Label>Postal Code</Label>
      <input
        style={s.input}
        value={draft.postalCode || ""}
        onChange={(e) => update("postalCode", e.target.value.toUpperCase())}
        placeholder="V6B 1A1"
        maxLength={7}
      />
      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 4, marginBottom: 8 }}>
        Helps us show programs near you (coming soon)
      </div>

      {formatLastSynced(lastSynced) && (
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 12,
          color: "#888",
          marginTop: 8,
          marginBottom: 4,
        }}>
          {formatLastSynced(lastSynced)}
        </div>
      )}

      {/* ─── Budget Section ─── */}
      <SectionLabel>Budget</SectionLabel>

      <Label>Seasonal Budget Goal</Label>
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "'Barlow', sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: C.muted,
        }}>$</span>
        <input
          style={{ ...s.input, paddingLeft: 28 }}
          type="number"
          value={draft.budgetGoal || ""}
          onChange={(e) => update("budgetGoal", e.target.value)}
          placeholder="2,000"
          min={0}
        />
      </div>
      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 4, marginBottom: 8 }}>
        Set a target to track spending on the Budget tab
      </div>

      {/* ─── Notifications Section ─── */}
      <SectionLabel>Notifications</SectionLabel>
      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginBottom: 12 }}>
        Email notifications (coming soon)
      </div>

      <ToggleRow
        label="Registration reminders"
        description="Reminders before registration deadlines"
        checked={draft.notifyRegistration !== false}
        onChange={(val) => update("notifyRegistration", val)}
      />
      <ToggleRow
        label="New programs nearby"
        description="Discover new camps and classes in your area"
        checked={draft.notifyNewPrograms !== false}
        onChange={(val) => update("notifyNewPrograms", val)}
      />
      <ToggleRow
        label="Weekly summary"
        description="A snapshot of your upcoming week"
        checked={draft.notifyWeeklySummary !== false}
        onChange={(val) => update("notifyWeeklySummary", val)}
      />

      {/* ─── Payment Method Section ─── */}
      <SectionLabel>Payment Method</SectionLabel>
      <PaymentMethodSection />

      {/* ─── Subscription Section ─── */}
      <SectionLabel>Subscription</SectionLabel>

      {PLANS.map((plan) => {
        const isSelected = (draft.plan || "free") === plan.key;
        return (
          <div
            key={plan.key}
            onClick={() => !plan.disabled && update("plan", plan.key)}
            role={plan.disabled ? undefined : "button"}
            tabIndex={plan.disabled ? undefined : 0}
            aria-label={plan.disabled ? `${plan.name} plan, coming soon` : `Select ${plan.name} plan`}
            style={{
              background: isSelected ? "#E8F5EE" : C.white,
              borderRadius: 12,
              padding: "14px 16px",
              border: isSelected
                ? `2px solid ${C.seaGreen}`
                : `1.5px solid ${C.border}`,
              marginBottom: 8,
              cursor: plan.disabled ? "default" : "pointer",
              opacity: plan.disabled ? 0.55 : 1,
              transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.ink,
                }}>
                  {plan.name}
                  {plan.price && (
                    <span style={{ fontWeight: 500, color: C.muted, marginLeft: 6 }}>
                      {plan.price}
                    </span>
                  )}
                </div>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12,
                  color: C.muted,
                  marginTop: 2,
                }}>
                  {plan.description}
                </div>
              </div>
              {isSelected && (
                <div style={{
                  background: C.seaGreen,
                  color: C.cream,
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 6,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  flexShrink: 0,
                  marginLeft: 10,
                }}>
                  Active
                </div>
              )}
              {plan.disabled && !isSelected && (
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.muted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  flexShrink: 0,
                  marginLeft: 10,
                }}>
                  Coming Soon
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ─── Report a Bug ─── */}
      <SectionLabel>Feedback</SectionLabel>
      {!showBugForm ? (
        <button
          onClick={() => setShowBugForm(true)}
          style={{
            width: "100%",
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: C.blue,
            background: `${C.blue}0A`,
            border: `1.5px solid ${C.blue}20`,
            borderRadius: 10,
            padding: "12px 16px",
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.12s",
          }}
          className="chip-btn"
        >
          <span style={{ fontSize: 16 }}>🐛</span>
          Report a bug
        </button>
      ) : (
        <div style={{
          background: `${C.blue}06`,
          border: `1.5px solid ${C.blue}20`,
          borderRadius: 12,
          padding: 14,
        }}>
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: C.ink,
            marginBottom: 8,
          }}>
            What went wrong?
          </div>
          <textarea
            style={{
              ...s.input,
              minHeight: 80,
              resize: "vertical",
              fontSize: 13,
            }}
            value={bugDescription}
            onChange={(e) => setBugDescription(e.target.value)}
            placeholder="Describe what happened and what you expected..."
            autoFocus
          />
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 11,
            color: C.muted,
            marginTop: 4,
            marginBottom: 10,
          }}>
            We'll also include your device info to help us investigate.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={s.secondaryBtn}
              onClick={() => {
                setShowBugForm(false);
                setBugDescription("");
                setBugStatus(null);
              }}
            >
              Cancel
            </button>
            <button
              style={{
                ...s.primaryBtn,
                opacity: !bugDescription.trim() || bugStatus === "sending" ? 0.5 : 1,
              }}
              disabled={!bugDescription.trim() || bugStatus === "sending"}
              onClick={async () => {
                setBugStatus("sending");
                try {
                  const res = await fetch("/api/report-bug", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      description: bugDescription.trim(),
                      email: email || "",
                      displayName: profile.displayName || "",
                      userAgent: navigator.userAgent,
                    }),
                  });
                  if (res.ok) {
                    setBugStatus("sent");
                    setBugDescription("");
                    setTimeout(() => {
                      setShowBugForm(false);
                      setBugStatus(null);
                    }, 2500);
                  } else {
                    setBugStatus("error");
                  }
                } catch {
                  setBugStatus("error");
                }
              }}
            >
              {bugStatus === "sending" ? "Sending..." : "Send Report"}
            </button>
          </div>
          {bugStatus === "sent" && (
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              color: C.seaGreen,
              fontWeight: 600,
              marginTop: 10,
            }}>
              Thanks! We received your report.
            </div>
          )}
          {bugStatus === "error" && (
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              color: C.danger,
              fontWeight: 600,
              marginTop: 10,
            }}>
              Something went wrong. Please try again.
            </div>
          )}
        </div>
      )}

      {/* ─── Actions ─── */}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button style={s.secondaryBtn} onClick={handleCancel}>
          Cancel
        </button>
        <button style={s.primaryBtn} onClick={handleSave}>
          Save
        </button>
        <button
          style={{
            ...s.dangerBtn,
            flex: 1,
          }}
          className="del-btn"
          onClick={() => {
            onSignOut();
            onClose();
          }}
        >
          Sign Out
        </button>
      </div>

      <div style={{
        textAlign: "center",
        marginTop: 16,
        paddingTop: 12,
        borderTop: `1px solid ${C.border}`,
      }}>
        <span style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 11,
          color: C.muted,
        }}>
          Skeddo v1.0 · Made in Vancouver
        </span>
      </div>
    </Modal>
  );
}


/* ─── Section Label ─── */
function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Barlow', sans-serif",
      fontSize: 11,
      fontWeight: 700,
      color: C.seaGreen,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginTop: 20,
      marginBottom: 10,
      paddingTop: 12,
      borderTop: `1px solid ${C.border}`,
    }}>
      {children}
    </div>
  );
}


/* ─── Toggle Row ─── */
function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: `1px solid ${C.border}`,
        cursor: "pointer",
      }}
      onClick={() => onChange(!checked)}
      role="switch"
      tabIndex={0}
      aria-checked={checked}
      aria-label={label}
    >
      <div style={{ flex: 1, marginRight: 12 }}>
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: C.ink,
        }}>
          {label}
        </div>
        {description && (
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 12,
            color: C.muted,
            marginTop: 1,
          }}>
            {description}
          </div>
        )}
      </div>
      {/* Toggle switch */}
      <div style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? C.seaGreen : C.border,
        position: "relative",
        transition: "background 0.2s ease",
        flexShrink: 0,
      }}>
        <div style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          background: C.white,
          position: "absolute",
          top: 2,
          left: checked ? 22 : 2,
          transition: "left 0.2s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }} />
      </div>
    </div>
  );
}
