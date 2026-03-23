import { useState, useMemo } from "react";
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
    description: "Up to 3 programs, basic search & budget",
    disabled: false,
  },
  {
    key: "plus",
    name: "Skeddo+",
    price: "$4.99/mo or $45/yr",
    description: "Unlimited programs, advanced filters, budget tracking, circles",
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

export default function ProfileModal({ profile, setProfile, email, lastSynced, onSignOut, onClose, pushNotifications, planAccess, session }) {
  // Work on a local draft so changes aren't auto-saved on every keystroke
  const [draft, setDraft] = useState({ ...profile });
  const update = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  // Feedback state — feedbackType: null | "bug" | "feedback"
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState(null); // null | "sending" | "sent" | "error"

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
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 1.5 }}>
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
        style={{ ...s.input, background: "#F0F1F3", color: C.muted, cursor: "not-allowed" }}
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
          color: C.muted,
          marginTop: 8,
          marginBottom: 4,
        }}>
          {formatLastSynced(lastSynced)}
        </div>
      )}

      {/* ─── Notifications Section ─── */}
      <SectionLabel>Push Notifications</SectionLabel>

      {/* Push subscribe/unsubscribe button */}
      {pushNotifications?.isSupported ? (
        <div style={{ marginBottom: 16 }}>
          {pushNotifications.isSubscribed ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                flex: 1,
                fontFamily: "'Barlow', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: C.seaGreen,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                <span style={{ fontSize: 16 }}>{"\u2713"}</span> Push notifications enabled
              </div>
              <button
                onClick={pushNotifications.unsubscribe}
                disabled={pushNotifications.loading}
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.muted,
                  background: "none",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Disable
              </button>
            </div>
          ) : (
            <button
              onClick={pushNotifications.subscribe}
              disabled={pushNotifications.loading}
              style={{
                width: "100%",
                fontFamily: "'Barlow', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: C.cream,
                background: C.seaGreen,
                border: "none",
                borderRadius: 10,
                padding: "12px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: pushNotifications.loading ? 0.6 : 1,
              }}
            >
              {pushNotifications.loading ? "Enabling..." : "Enable Push Notifications"}
            </button>
          )}
          {pushNotifications.permission === "denied" && (
            <NotificationBlockedGuide />
          )}
        </div>
      ) : (
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 12,
          color: C.muted,
          marginBottom: 12,
          lineHeight: 1.5,
        }}>
          Install Skeddo to your home screen to enable push notifications.
        </div>
      )}

      {/* Programs group */}
      <SubLabel>Programs</SubLabel>
      <ToggleRow
        label="Upcoming program reminders"
        description="Alerts before enrolled programs start"
        checked={draft.notifyUpcomingPrograms !== false}
        onChange={(val) => update("notifyUpcomingPrograms", val)}
      />
      <ToggleRow
        label="Registration reminders"
        description="When registration opens for saved programs"
        checked={draft.notifyRegistration !== false}
        onChange={(val) => update("notifyRegistration", val)}
      />
      <ToggleRow
        label="Waitlist alerts"
        description="When a waitlisted program has openings"
        checked={draft.notifyWaitlistAlerts !== false}
        onChange={(val) => update("notifyWaitlistAlerts", val)}
      />
      <ToggleRow
        label="Favourite updates"
        description="Status changes for favourited programs"
        checked={draft.notifyFavouriteUpdates !== false}
        onChange={(val) => update("notifyFavouriteUpdates", val)}
      />

      {/* Social group */}
      <SubLabel>Social</SubLabel>
      <ToggleRow
        label="Circle activity"
        description="When someone shares to your circle"
        checked={draft.notifyCircleActivity !== false}
        onChange={(val) => update("notifyCircleActivity", val)}
      />
      <ToggleRow
        label="Circle join requests"
        description="When someone wants to join your circle"
        checked={draft.notifyCircleRequests !== false}
        onChange={(val) => update("notifyCircleRequests", val)}
      />

      {/* Budget group */}
      <SubLabel>Budget</SubLabel>
      <ToggleRow
        label="Budget milestones"
        description="Alerts at 50%, 75%, and 90% of your goal"
        checked={draft.notifyBudgetMilestones !== false}
        onChange={(val) => update("notifyBudgetMilestones", val)}
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

      {/* Beta note */}
      {(planAccess?.isBeta || planAccess?.isBetaUser) && (
        <div style={{
          background: "#E8F5EE",
          borderRadius: 10,
          padding: "10px 14px",
          marginTop: 4,
          marginBottom: 4,
        }}>
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: C.seaGreen,
            margin: 0,
            lineHeight: 1.5,
          }}>
            {planAccess?.isBeta
              ? "All features are unlocked during early access"
              : "Thank you for being a beta tester! You have Skeddo Plus for life."}
          </p>
        </div>
      )}

      {/* ─── Feedback ─── */}
      <SectionLabel>Feedback</SectionLabel>
      {!feedbackType ? (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setFeedbackType("bug")}
            style={{
              flex: 1,
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: C.blue,
              background: `${C.blue}0A`,
              border: `1.5px solid ${C.blue}20`,
              borderRadius: 10,
              padding: "12px 14px",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.12s",
            }}
            className="chip-btn"
          >
            <span style={{ fontSize: 16, display: "block", marginBottom: 4 }}>🐛</span>
            Report a bug
          </button>
          <button
            onClick={() => setFeedbackType("feedback")}
            style={{
              flex: 1,
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: C.seaGreen,
              background: `${C.seaGreen}0A`,
              border: `1.5px solid ${C.seaGreen}20`,
              borderRadius: 10,
              padding: "12px 14px",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.12s",
            }}
            className="chip-btn"
          >
            <span style={{ fontSize: 16, display: "block", marginBottom: 4 }}>💬</span>
            Leave feedback
          </button>
        </div>
      ) : (
        <div style={{
          background: feedbackType === "bug" ? `${C.blue}06` : `${C.seaGreen}06`,
          border: `1.5px solid ${feedbackType === "bug" ? `${C.blue}20` : `${C.seaGreen}20`}`,
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
            {feedbackType === "bug" ? "What went wrong?" : "What's on your mind?"}
          </div>
          <textarea
            style={{
              ...s.input,
              minHeight: 80,
              resize: "vertical",
              fontSize: 13,
            }}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={feedbackType === "bug"
              ? "Describe what happened and what you expected..."
              : "Share an idea, suggestion, or anything else..."}
            autoFocus
          />
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 11,
            color: C.muted,
            marginTop: 4,
            marginBottom: 10,
          }}>
            {feedbackType === "bug"
              ? "We'll also include your device info to help us investigate."
              : "We read every message — your input helps shape Skeddo."}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={s.secondaryBtn}
              onClick={() => {
                setFeedbackType(null);
                setFeedbackText("");
                setFeedbackStatus(null);
              }}
            >
              Cancel
            </button>
            <button
              style={{
                ...s.primaryBtn,
                opacity: !feedbackText.trim() || feedbackStatus === "sending" ? 0.5 : 1,
              }}
              disabled={!feedbackText.trim() || feedbackStatus === "sending"}
              onClick={async () => {
                setFeedbackStatus("sending");
                try {
                  const headers = { "Content-Type": "application/json" };
                  if (session?.access_token) {
                    headers["Authorization"] = `Bearer ${session.access_token}`;
                  }
                  const res = await fetch("/api/report-bug", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                      description: feedbackText.trim(),
                      type: feedbackType,
                      email: email || "",
                      displayName: profile.displayName || "",
                      userAgent: navigator.userAgent,
                    }),
                  });
                  if (res.ok) {
                    setFeedbackStatus("sent");
                    setFeedbackText("");
                    setTimeout(() => {
                      setFeedbackType(null);
                      setFeedbackStatus(null);
                    }, 2500);
                  } else {
                    setFeedbackStatus("error");
                  }
                } catch {
                  setFeedbackStatus("error");
                }
              }}
            >
              {feedbackStatus === "sending" ? "Sending..." : "Send"}
            </button>
          </div>
          {feedbackStatus === "sent" && (
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              color: C.seaGreen,
              fontWeight: 600,
              marginTop: 10,
            }}>
              {feedbackType === "bug" ? "Thanks! We received your report." : "Thanks for your feedback!"}
            </div>
          )}
          {feedbackStatus === "error" && (
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


/* ─── Notification Blocked Guide ─── */
function detectBrowser() {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isMac = /Macintosh|MacIntel/.test(ua) && !isIOS;
  const isAndroid = /Android/.test(ua);
  if (/Edg\//.test(ua)) return { name: "Edge", isIOS, isMac, isAndroid };
  if (/Firefox\//.test(ua)) return { name: "Firefox", isIOS, isMac, isAndroid };
  if (/CriOS/.test(ua)) return { name: "Chrome", isIOS, isMac, isAndroid };
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return { name: "Chrome", isIOS, isMac, isAndroid };
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return { name: "Safari", isIOS, isMac, isAndroid };
  return { name: "your browser", isIOS, isMac, isAndroid };
}

function getInstructions(browser) {
  const { name, isIOS, isMac, isAndroid } = browser;
  if (name === "Safari" && isIOS) {
    return {
      icon: "gear",
      title: "Safari on iPhone / iPad",
      steps: [
        "Open the Settings app on your device",
        "Scroll down and tap Safari",
        "Tap Notifications",
        "Find Skeddo and tap Allow",
      ],
    };
  }
  if (name === "Safari" && isMac) {
    return {
      icon: "gear",
      title: "Safari on Mac",
      steps: [
        "In the menu bar, click Safari \u2192 Settings",
        "Go to the Websites tab",
        "Select Notifications in the sidebar",
        "Find skeddo.ca and change to Allow",
      ],
    };
  }
  if (name === "Chrome" && isAndroid) {
    return {
      icon: "dots",
      title: "Chrome on Android",
      steps: [
        "Tap the \u22ee menu (three dots) in the top right",
        "Tap Settings \u2192 Site settings",
        "Tap Notifications",
        "Find skeddo.ca and tap Allow",
      ],
    };
  }
  if (name === "Chrome") {
    return {
      icon: "lock",
      title: "Chrome on desktop",
      steps: [
        "Click the lock or tune icon in the address bar",
        "Click Site settings",
        "Find Notifications and change to Allow",
        "Reload the page",
      ],
    };
  }
  if (name === "Firefox") {
    return {
      icon: "lock",
      title: "Firefox",
      steps: [
        "Click the lock icon in the address bar",
        "Click Connection secure \u2192 More information",
        "Go to the Permissions tab",
        "Find Notifications, uncheck Use Default, and select Allow",
      ],
    };
  }
  if (name === "Edge") {
    return {
      icon: "lock",
      title: "Edge",
      steps: [
        "Click the lock icon in the address bar",
        "Click Permissions for this site",
        "Find Notifications and change to Allow",
        "Reload the page",
      ],
    };
  }
  return {
    icon: "lock",
    title: "Your browser",
    steps: [
      "Open your browser's site settings for skeddo.ca",
      "Find the Notifications permission",
      "Change it to Allow",
      "Reload the page",
    ],
  };
}

function NotificationBlockedGuide() {
  const [expanded, setExpanded] = useState(false);
  const [retryStatus, setRetryStatus] = useState(null); // null | "prompted" | "still-blocked"
  const browser = useMemo(() => detectBrowser(), []);
  const instructions = useMemo(() => getInstructions(browser), [browser]);

  const handleTryAgain = async () => {
    try {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        setRetryStatus(null);
        window.location.reload();
      } else {
        setRetryStatus("still-blocked");
      }
    } catch {
      setRetryStatus("still-blocked");
    }
  };

  const stepIcon = (index) => (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 20,
      height: 20,
      borderRadius: 10,
      background: C.seaGreen,
      color: C.white,
      fontFamily: "'Barlow', sans-serif",
      fontSize: 11,
      fontWeight: 700,
      flexShrink: 0,
      marginRight: 8,
    }}>
      {index + 1}
    </span>
  );

  return (
    <div style={{
      marginTop: 8,
      background: C.dangerBg,
      borderRadius: 10,
      border: `1px solid ${C.danger}20`,
      overflow: "hidden",
    }}>
      {/* Header — always visible */}
      <div
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label="Show how to enable notifications"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 12px",
          cursor: "pointer",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 14 }}>{"\uD83D\uDD14"}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: C.danger,
          }}>
            Notifications are blocked
          </div>
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 11,
            color: C.muted,
            marginTop: 1,
          }}>
            Tap here to see how to enable them
          </div>
        </div>
        <span style={{
          fontSize: 12,
          color: C.muted,
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}>
          {"\u25BC"}
        </span>
      </div>

      {/* Expandable instructions */}
      {expanded && (
        <div style={{
          padding: "0 12px 12px 12px",
          borderTop: `1px solid ${C.danger}15`,
        }}>
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: C.ink,
            marginTop: 10,
            marginBottom: 8,
          }}>
            {instructions.title}
          </div>
          {instructions.steps.map((step, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: 6,
            }}>
              {stepIcon(i)}
              <span style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 12,
                color: C.ink,
                lineHeight: 1.5,
                paddingTop: 1,
              }}>
                {step}
              </span>
            </div>
          ))}

          {/* Try Again button */}
          <button
            onClick={handleTryAgain}
            style={{
              width: "100%",
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: C.white,
              background: C.seaGreen,
              border: "none",
              borderRadius: 8,
              padding: "10px 14px",
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            Try Again
          </button>

          {retryStatus === "still-blocked" && (
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11,
              color: C.muted,
              marginTop: 6,
              lineHeight: 1.4,
            }}>
              Still blocked — please follow the steps above to update your browser settings, then try again.
            </div>
          )}
        </div>
      )}
    </div>
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


/* ─── Sub Label (for notification groups) ─── */
function SubLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Barlow', sans-serif",
      fontSize: 12,
      fontWeight: 700,
      color: C.ink,
      marginTop: 14,
      marginBottom: 4,
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
          boxShadow: "0 1px 3px rgba(27,36,50,0.15)",
        }} />
      </div>
    </div>
  );
}
