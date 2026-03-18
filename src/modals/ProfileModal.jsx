import { C } from "../constants/brand";
import { s } from "../styles/shared";
import Label from "../components/Label";
import Modal from "../components/Modal";

export default function ProfileModal({ profile, setProfile, email, onSignOut, onClose }) {
  const update = (field, value) => setProfile((prev) => ({ ...prev, [field]: value }));

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
        value={profile.displayName || ""}
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

      <Label>Phone Number</Label>
      <input
        style={s.input}
        type="tel"
        value={profile.phone || ""}
        onChange={(e) => update("phone", e.target.value)}
        placeholder="604-555-1234"
      />

      <Label>Postal Code</Label>
      <input
        style={s.input}
        value={profile.postalCode || ""}
        onChange={(e) => update("postalCode", e.target.value.toUpperCase())}
        placeholder="V6B 1A1"
        maxLength={7}
      />
      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 4, marginBottom: 8 }}>
        Helps us show programs near you (coming soon)
      </div>

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
          value={profile.budgetGoal || ""}
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
        label="Waitlist alerts"
        description="Get notified when a spot opens up"
        checked={profile.notifyWaitlist !== false}
        onChange={(val) => update("notifyWaitlist", val)}
      />
      <ToggleRow
        label="Registration reminders"
        description="Reminders before registration deadlines"
        checked={profile.notifyRegistration !== false}
        onChange={(val) => update("notifyRegistration", val)}
      />
      <ToggleRow
        label="New programs nearby"
        description="Discover new camps and classes in your area"
        checked={profile.notifyNewPrograms !== false}
        onChange={(val) => update("notifyNewPrograms", val)}
      />
      <ToggleRow
        label="Weekly summary"
        description="A snapshot of your upcoming week"
        checked={profile.notifyWeeklySummary !== false}
        onChange={(val) => update("notifyWeeklySummary", val)}
      />

      {/* ─── Subscription Section ─── */}
      <SectionLabel>Subscription</SectionLabel>
      <div style={{
        background: "#E8F5EE",
        borderRadius: 12,
        padding: "14px 16px",
        border: `1px solid rgba(58,158,106,0.15)`,
        marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: C.ink,
            }}>
              Free Plan
            </div>
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 12,
              color: C.muted,
              marginTop: 2,
            }}>
              All features included during early access
            </div>
          </div>
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
          }}>
            Active
          </div>
        </div>
      </div>

      {/* ─── Actions ─── */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button style={s.secondaryBtn} onClick={onClose}>
          Done
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
