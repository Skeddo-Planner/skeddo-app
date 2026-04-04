import { useState, useEffect, useMemo, useRef } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import EmptyState from "../components/EmptyState";
import { trackEvent } from "../utils/analytics";

/* ─── Design tokens ─── */
const SHADOW = "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)";
const SOFT = {
  seaGreen: "#ECFDF5",
  blue: "#EFF6FF",
  lilac: "#FEF3E2",
  peach: "#FFF5F0",
};

const CIRCLE_EMOJIS = ["👨‍👩‍👧‍👦", "⚽", "🎨", "🎵", "📚", "🏕️", "🎭", "🧪", "🏊", "🚴"];

/* ─── Emoji background color map (soft tints) ─── */
function emojiBackground(emoji) {
  const map = {
    "👨‍👩‍👧‍👦": "#EFF6FF", "⚽": "#ECFDF5", "🎨": "#FEF3E2", "🎵": "#F5F0FF",
    "📚": "#FFF5F0", "🏕️": "#ECFDF5", "🎭": "#FEF3E2", "🧪": "#EFF6FF",
    "🏊": "#E8F8FF", "🚴": "#F0FFF4",
  };
  return map[emoji] || SOFT.blue;
}

/* ─── SVG share icons matching tab bar stroke style ─── */
function ShareIcon({ type, color, size = 18 }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "whatsapp": return <svg {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>;
    case "text": return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
    case "email": return <svg {...props}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>;
    case "copy": return <svg {...props}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
    case "share": return <svg {...props}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
    default: return null;
  }
}

function ShareIcons({ shareText, shareUrl, onCopy, subject }) {
  const fullText = shareText + "\n\n" + shareUrl;
  const actions = [
    { label: "WhatsApp", type: "whatsapp", color: "#25D366", action: () => window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, "_blank") },
    { label: "Text", type: "text", color: C.blue, action: () => window.open(`sms:?body=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank") },
    { label: "Email", type: "email", color: C.lilac, action: () => window.open(`mailto:?subject=${encodeURIComponent(subject || "Skeddo")}&body=${encodeURIComponent(fullText)}`, "_blank") },
    { label: "Copy", type: "copy", color: C.olive, action: onCopy },
    ...(navigator.share ? [{ label: "Share", type: "share", color: C.seaGreen, action: () => navigator.share({ title: subject || "Skeddo", text: shareText, url: shareUrl }).catch(() => {}) }] : []),
  ];
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
      {actions.map((a) => (
        <button key={a.label} onClick={a.action} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          background: "none", border: "none", cursor: "pointer", padding: "6px 4px",
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: a.color + "14", border: `1.5px solid ${a.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ShareIcon type={a.type} color={a.color} />
          </div>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>
            {a.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ─── Helpers ─── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDateRange(startDate, endDate) {
  if (!startDate) return null;
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  try {
    const s = new Date(startDate + "T00:00:00");
    const sMonth = MONTHS[s.getMonth()];
    const sDay = s.getDate();
    if (!endDate || endDate === startDate) return `${sMonth} ${sDay}`;
    const e = new Date(endDate + "T00:00:00");
    const eMonth = MONTHS[e.getMonth()];
    const eDay = e.getDate();
    if (sMonth === eMonth) return `${sMonth} ${sDay}\u2013${eDay}`;
    return `${sMonth} ${sDay} \u2013 ${eMonth} ${eDay}`;
  } catch { return null; }
}

/* ─── Heart SVG for bookmarks ─── */
function HeartIcon({ filled, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? C.olive : "none"}
      stroke={filled ? C.olive : C.muted}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ─── Trash SVG for delete ─── */
function TrashIcon({ size = 16, color = C.danger }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

/* ─── Status pill for per-member status on shared activities ─── */
function StatusPill({ initial, status, label }) {
  const statusStyles = {
    Enrolled: { color: C.seaGreen, bg: "rgba(45,159,111,0.10)", text: "Enrolled" },
    Exploring: { color: C.blue, bg: "rgba(74,111,165,0.10)", text: "Exploring" },
    Waitlist: { color: C.olive, bg: "rgba(231,111,81,0.10)", text: "Waitlisted" },
    Interested: { color: C.lilac, bg: "rgba(244,162,97,0.10)", text: "Interested" },
    none: { color: "#9CA3AF", bg: "rgba(156,163,175,0.08)", text: "\u2014" },
  };
  const s = statusStyles[status] || statusStyles.none;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600,
      color: s.color, background: s.bg, padding: "2px 8px 2px 6px",
      borderRadius: 20, whiteSpace: "nowrap",
      border: status === "none" ? "1px solid #E5E7EB" : "none",
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: "50%", background: s.color,
        color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, fontWeight: 700, flexShrink: 0,
      }}>
        {initial}
      </span>
      {label}: {s.text}
    </span>
  );
}

/* ─── Co-parent SVG (two equal people, same as HomeTab) ─── */
function CoParentIcon({ color = C.blue, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="3" />
      <path d="M1 20v-1.5A3.5 3.5 0 0 1 4.5 15h5A3.5 3.5 0 0 1 13 18.5V20" />
      <circle cx="17" cy="7" r="3" />
      <path d="M11 20v-1.5a3.5 3.5 0 0 1 3.5-3.5h5a3.5 3.5 0 0 1 3.5 3.5V20" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   CirclesTab — v3 redesign
   ════════════════════════════════════════════════════════════ */
export default function CirclesTab({
  programs, kids, profile, showToast, userId, circlesHook, planAccess, onInviteCoParent,
}) {
  const {
    circles, pendingRequests, activeFeed, bookmarks, bookmarkedActivities, referrals, loading,
    referralCode, referralUrl, membersRecruited, freeMonthsEarned,
    createCircle, joinCircle, handleMemberRequest, leaveCircle, deleteCircle, removeMember,
    shareActivities, loadFeed, toggleBookmark, flagActivity, deleteSharedActivity,
    ensureReferralCode, getMembers, refreshPending, pendingCount,
  } = circlesHook;

  const [screen, setScreen] = useState("home"); // home | feed | share | create | join
  const [activeCircle, setActiveCircle] = useState(null);
  const [createName, setCreateName] = useState("");
  const [createEmoji, setCreateEmoji] = useState("👨‍👩‍👧‍👦");
  const [joinCode, setJoinCode] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState(new Set());
  const [circleMembers, setCircleMembers] = useState([]);
  const [showInviteDrawer, setShowInviteDrawer] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [membersExpanded, setMembersExpanded] = useState(false);

  // Stable refs to avoid useEffect dependency loops
  const ensureReferralCodeRef = useRef(ensureReferralCode);
  ensureReferralCodeRef.current = ensureReferralCode;
  const refreshPendingRef = useRef(refreshPending);
  refreshPendingRef.current = refreshPending;

  useEffect(() => {
    if (screen === "home") {
      refreshPendingRef.current();
    }
  }, [screen]);

  // Close share sheet on Escape key
  useEffect(() => {
    if (screen !== "share") return;
    const handler = (e) => { if (e.key === "Escape") setScreen("feed"); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [screen]);

  // Build shareable activities from ALL tracked programs
  const shareableActivities = (programs || []).filter((p) => ["Enrolled", "Waitlist", "Exploring"].includes(p.status)).map((p) => {
    const kidNames = (p.kidIds || [])
      .map((id) => (kids || []).find((k) => k.id === id)?.name)
      .filter(Boolean);
    return {
      id: p.id,
      activityName: p.name,
      providerName: p.provider || "",
      childName: kidNames.join(", ") || "",
      scheduleInfo: [p.days, p.times].filter(Boolean).join(" · "),
      ageGroup: p.ageMin && p.ageMax ? `Ages ${p.ageMin}-${p.ageMax}` : "",
      registrationUrl: p.registrationUrl || "",
      programId: p.id,
      status: p.status || "Exploring",
      location: p.location || "",
      startDate: p.startDate || "",
      endDate: p.endDate || "",
    };
  });

  // Already-shared activity IDs for the current circle
  const alreadySharedIds = useMemo(() => {
    if (!activeCircle) return new Set();
    return new Set(activeFeed.filter((item) => item.shared_by === userId).map((item) => item.program_id || item.activity_name));
  }, [activeFeed, activeCircle, userId]);

  // Duplicate detection for feed
  const duplicateCounts = useMemo(() => {
    const counts = {};
    activeFeed.forEach((item) => {
      const key = `${item.activity_name}|||${item.provider_name}`.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [activeFeed]);

  // Count new activities this week across all circles
  const newThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return circles.reduce((sum, c) => sum + (c.newCount || 0), 0);
  }, [circles]);

  const openCircleFeed = async (circle) => {
    setActiveCircle(circle);
    setScreen("feed");
    await loadFeed(circle.id);
    const members = await getMembers(circle.id);
    setCircleMembers(members);
  };

  const handleCreate = async () => {
    if (!createName.trim()) return;
    setActionLoading(true);
    try {
      await createCircle(createName.trim(), createEmoji);
      setCreateName("");
      setScreen("home");
      showToast("Circle created!");
    } catch (err) {
      showToast(err.message);
    }
    setActionLoading(false);
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setActionLoading(true);
    try {
      await joinCircle(joinCode.trim());
      setJoinCode("");
      setScreen("home");
      showToast("Join request sent! Waiting for approval.");
    } catch (err) {
      showToast(err.message);
    }
    setActionLoading(false);
  };

  const handleShare = async () => {
    if (selectedActivities.size === 0 || !activeCircle) return;
    setActionLoading(true);
    try {
      const toShare = shareableActivities.filter((a) => selectedActivities.has(a.id));
      await shareActivities(activeCircle.id, toShare, profile?.displayName);
      trackEvent("share_activity", { count: toShare.length, circle_name: activeCircle.name });
      setSelectedActivities(new Set());
      setScreen("feed");
      showToast(`Shared ${toShare.length} activit${toShare.length === 1 ? "y" : "ies"}!`);
    } catch (err) {
      showToast(err.message);
    }
    setActionLoading(false);
  };

  /* ═══════════════════════════════════════════════
     SCREEN 1: Circles Home
     ═══════════════════════════════════════════════ */
  if (screen === "home") {
    return (
      <div>
        {/* Header */}
        <h2 style={s.pageTitle}>Circles</h2>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: C.muted, marginBottom: 16, marginTop: 0 }}>
          {circles.length} group{circles.length !== 1 ? "s" : ""}
          {newThisWeek > 0 && <> &middot; <span style={{ color: C.olive, fontWeight: 600 }}>{newThisWeek} new activit{newThisWeek === 1 ? "y" : "ies"} this week</span></>}
        </p>

        {/* Create / Join buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => setScreen("create")}
            style={{
              flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700,
              background: C.seaGreen, color: "#fff", border: "none", borderRadius: 10,
              padding: "12px 16px", cursor: "pointer", minHeight: 44,
            }}
          >
            Create a Circle
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            style={{
              flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700,
              background: C.white, color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 10,
              padding: "12px 16px", cursor: "pointer", minHeight: 44,
            }}
          >
            Join a Circle
          </button>
        </div>

        {/* Circle cards */}
        {circles.length === 0 && !loading ? (
          <EmptyState
            icon={"\uD83D\uDC65"}
            message="No circles yet. Create one to start sharing schedules with other parents."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {circles.map((c) => {
              // Find pending requests for this circle
              const circlePending = pendingRequests.filter((r) => r.circleId === c.id || r.circle_id === c.id);
              // Last activity in feed (approximate from circle metadata)
              return (
                <div
                  key={c.id}
                  onClick={() => openCircleFeed(c)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCircleFeed(c); } }}
                  role="button"
                  tabIndex={0}
                  style={{
                    background: C.white, borderRadius: 12, padding: "14px 16px",
                    boxShadow: SHADOW, cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Emoji icon */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, background: emojiBackground(c.emoji),
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
                    }}>
                      {c.emoji}
                    </div>

                    {/* Name + member count */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 600, color: C.ink }}>
                        {c.name}
                      </div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginTop: 2 }}>
                        {c.memberCount} member{c.memberCount !== 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* New activities badge */}
                    {c.newCount > 0 && (
                      <span style={{
                        fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                        color: C.olive, background: `${C.olive}14`, padding: "3px 10px",
                        borderRadius: 20, whiteSpace: "nowrap",
                      }}>
                        {c.newCount} new
                      </span>
                    )}
                  </div>

                  {/* Pending requests inline bar */}
                  {circlePending.length > 0 && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        marginTop: 10, background: SOFT.peach, borderRadius: 8, padding: "8px 12px",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}
                    >
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: C.olive }}>
                        {circlePending.length} pending request{circlePending.length !== 1 ? "s" : ""}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); openCircleFeed(c); }}
                        style={{
                          fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
                          color: C.olive, background: "none", border: "none", cursor: "pointer", padding: 0,
                        }}
                      >
                        Review &rarr;
                      </button>
                    </div>
                  )}

                  {/* Last activity preview */}
                  {c.lastActivity && (
                    <div style={{
                      marginTop: 8, fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {c.lastActivity}
                    </div>
                  )}

                  {/* Delete button — owner only */}
                  {c.role === "owner" && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 8, display: "flex", justifyContent: "flex-end" }}
                    >
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!window.confirm(`Delete "${c.name}"? This will remove the circle and all shared activities for all members.`)) return;
                          try {
                            await deleteCircle(c.id);
                            showToast("Circle deleted");
                          } catch (err) {
                            showToast(err.message);
                          }
                        }}
                        style={{
                          fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
                          color: "#ef4444", background: "none", border: "none", cursor: "pointer",
                          padding: "4px 0", display: "flex", alignItems: "center", gap: 4,
                        }}
                      >
                        <TrashIcon size={14} color="#ef4444" />
                        Delete Circle
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pending requests (global, for requests across circles) */}
        {pendingRequests.length > 0 && (
          <div style={{ marginTop: 16, background: SOFT.peach, borderRadius: 12, padding: "12px 16px", boxShadow: SHADOW }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.olive, marginBottom: 8, textTransform: "uppercase" }}>
              {pendingRequests.length} pending request{pendingRequests.length !== 1 ? "s" : ""}
            </div>
            {pendingRequests.map((req) => (
              <div key={req.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.olive}18` }}>
                <div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink }}>
                    {req.displayName || "Someone"}
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>
                    wants to join {req.circleName || "your circle"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => handleMemberRequest(req.id, "approve").then(() => showToast("Approved!")).catch((e) => showToast(e.message || "Failed"))}
                    style={{
                      background: C.seaGreen, color: "#fff", border: "none", borderRadius: 8,
                      padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      fontFamily: "'Barlow', sans-serif", minHeight: 32,
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleMemberRequest(req.id, "decline").then(() => showToast("Declined")).catch((e) => showToast(e.message || "Failed"))}
                    style={{
                      background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
                      padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      color: C.muted, fontFamily: "'Barlow', sans-serif", minHeight: 32,
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Co-parent invite card (dashed border) */}
        {onInviteCoParent && kids.length > 0 && (
          <div
            onClick={onInviteCoParent}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onInviteCoParent(); } }}
            role="button"
            tabIndex={0}
            style={{
              marginTop: 20, borderRadius: 12, padding: "16px",
              background: C.white, border: `1.5px dashed ${C.blue}50`,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: `${C.blue}14`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <CoParentIcon color={C.blue} size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink }}>
                Invite someone to manage your {kids.length === 1 ? "child's" : "children's"} schedule
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginTop: 2 }}>
                Share access with another parent or caregiver
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        )}

        {/* Join circle modal */}
        {showJoinModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(26,46,38,0.5)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }} onClick={() => setShowJoinModal(false)}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: C.cream, borderRadius: 16, padding: "24px 20px",
              maxWidth: 360, width: "100%", boxShadow: "0 12px 40px rgba(26,46,38,0.18)",
            }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, color: C.ink, marginBottom: 4 }}>
                Join a Circle
              </h3>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
                Enter the invite code you received from a friend or family member.
              </p>
              <input
                style={{ ...s.input, fontSize: 16, marginBottom: 14 }}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Paste invite code"
                autoFocus
              />
              <button
                onClick={() => { handleJoin(); setShowJoinModal(false); }}
                disabled={!joinCode.trim() || actionLoading}
                style={{
                  width: "100%", fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700,
                  background: !joinCode.trim() ? C.muted : C.blue, color: "#fff",
                  border: "none", borderRadius: 10, padding: "12px",
                  cursor: !joinCode.trim() ? "default" : "pointer", minHeight: 44,
                  opacity: !joinCode.trim() ? 0.5 : 1, marginBottom: 8,
                }}
              >
                {actionLoading ? "Joining..." : "Join Circle"}
              </button>
              <button
                onClick={() => setShowJoinModal(false)}
                style={{
                  width: "100%", fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600,
                  background: "none", color: C.muted, border: `1.5px solid ${C.border}`,
                  borderRadius: 10, padding: "10px", cursor: "pointer",
                }}
              >Cancel</button>
            </div>
          </div>
        )}

        {/* Bookmarked activities */}
        {bookmarkedActivities.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
              {"\u2764\uFE0F"} Saved Activities ({bookmarkedActivities.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {bookmarkedActivities.map((a) => (
                <div key={a.id} style={{
                  background: C.white, borderRadius: 12, padding: "12px 14px",
                  boxShadow: SHADOW, display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink }}>
                      {a.activity_name}
                    </div>
                    {a.provider_name && (
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.seaGreen, marginTop: 2 }}>
                        {a.provider_name}
                      </div>
                    )}
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginTop: 2 }}>
                      {[a.child_name, a.schedule_info, a.age_group].filter(Boolean).join(" · ")}
                    </div>
                    {a.shared_by_name && (
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 4 }}>
                        Shared by {a.shared_by_name} &middot; {timeAgo(a.shared_at)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {a.registration_url && (
                      <button
                        onClick={() => window.open(a.registration_url, "_blank")}
                        style={{
                          background: C.seaGreen, color: "#fff", border: "none", borderRadius: 8,
                          padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                          fontFamily: "'Barlow', sans-serif",
                        }}
                      >
                        Register
                      </button>
                    )}
                    <button
                      onClick={() => toggleBookmark(a.id)}
                      style={{
                        background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
                        padding: "6px 8px", cursor: "pointer", lineHeight: 1,
                      }}
                      aria-label="Remove bookmark"
                    >
                      <HeartIcon filled size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN: Create Circle
     ═══════════════════════════════════════════════ */
  if (screen === "create") {
    return (
      <div>
        <div style={{ padding: "14px 0", display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.ink, padding: 0 }} aria-label="Go back">{"\u2190"}</button>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 700, color: C.ink, flex: 1 }}>Create a Circle</span>
        </div>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
          Create a private group to share your kids' activity schedules with other parents.
        </p>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
          Circle Name
        </div>
        <input
          style={s.input}
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
          placeholder="e.g. Grade 3 Parents"
          autoFocus
        />
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, marginTop: 12 }}>
          Icon
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {CIRCLE_EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setCreateEmoji(e)}
              style={{
                width: 40, height: 40, borderRadius: 10, fontSize: 20,
                border: createEmoji === e ? `2px solid ${C.seaGreen}` : `1px solid ${C.border}`,
                background: createEmoji === e ? SOFT.seaGreen : C.white,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {e}
            </button>
          ))}
        </div>
        <button
          style={{ ...s.primaryBtn, width: "100%", opacity: !createName.trim() || actionLoading ? 0.5 : 1 }}
          onClick={handleCreate}
          disabled={!createName.trim() || actionLoading}
        >
          {actionLoading ? "Creating..." : "Create Circle"}
        </button>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN: Join Circle (standalone)
     ═══════════════════════════════════════════════ */
  if (screen === "join") {
    return (
      <div>
        <div style={{ padding: "14px 0", display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.ink, padding: 0 }} aria-label="Go back">{"\u2190"}</button>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 700, color: C.ink, flex: 1 }}>Join a Circle</span>
        </div>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
          Enter the invite code from another parent to request to join their circle.
        </p>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
          Invite Code
        </div>
        <input
          style={s.input}
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Paste invite code here"
          autoFocus
        />
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 16 }}>
          The circle owner will need to approve your request.
        </p>
        <button
          style={{ ...s.primaryBtn, width: "100%", opacity: !joinCode.trim() || actionLoading ? 0.5 : 1 }}
          onClick={handleJoin}
          disabled={!joinCode.trim() || actionLoading}
        >
          {actionLoading ? "Sending request..." : "Request to Join"}
        </button>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN 2: Circle Feed
     ═══════════════════════════════════════════════ */
  if (screen === "feed") {
    return (
      <div>
        {/* Sticky header */}
        <div style={{
          position: "sticky", top: 0, background: C.cream, zIndex: 10,
          padding: "8px 0 8px", display: "flex", alignItems: "center", gap: 10,
        }}>
          <button
            onClick={() => { setScreen("home"); setActiveCircle(null); }}
            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.ink, padding: 0, flexShrink: 0 }}
            aria-label="Go back"
          >
            {"\u2190"}
          </button>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: emojiBackground(activeCircle?.emoji),
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
          }}>
            {activeCircle?.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>
              {activeCircle?.name || "Circle"}
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
              {circleMembers.length} member{circleMembers.length !== 1 ? "s" : ""}
            </div>
          </div>
          <button
            onClick={() => setScreen("share")}
            style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
              background: C.seaGreen, color: "#fff", border: "none", borderRadius: 10,
              padding: "7px 14px", cursor: "pointer", flexShrink: 0, minHeight: 36,
            }}
          >
            + Share
          </button>
        </div>

        {/* Collapsible members list */}
        <div style={{
          background: C.white, borderRadius: 12, boxShadow: SHADOW,
          padding: "10px 14px", marginBottom: 10,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => setMembersExpanded((v) => !v)}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                display: "flex", alignItems: "center", gap: 6,
              }}
              aria-expanded={membersExpanded}
              aria-label={membersExpanded ? "Collapse members" : "Expand members"}
            >
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={C.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: "transform 0.2s ease", transform: membersExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Members ({circleMembers.length})
              </span>
            </button>
            {activeCircle?.inviteCode && (
              <button
                onClick={() => setShowInviteDrawer((v) => !v)}
                style={{
                  background: C.blue, color: "#fff", border: "none", borderRadius: 8,
                  padding: "5px 12px", fontFamily: "'Barlow', sans-serif", fontSize: 12,
                  fontWeight: 700, cursor: "pointer",
                }}
              >+ Invite</button>
            )}
          </div>
          {membersExpanded && (
            <>
              {circleMembers.map((m) => {
                const isMe = m.userId === userId;
                const isOwner = activeCircle?.role === "owner";
                const memberName = isMe ? (profile?.displayName || m.displayName) : m.displayName;
                return (
                  <div key={m.userId} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 0", borderBottom: `1px solid ${C.border}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: m.role === "owner" ? C.seaGreen : C.blue,
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
                      }}>
                        {memberName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink }}>
                        {memberName}{isMe ? " (you)" : ""}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                        color: m.role === "owner" ? C.seaGreen : C.muted,
                        textTransform: "uppercase",
                      }}>
                        {m.role}
                      </span>
                      {isOwner && !isMe && (
                        <button
                          onClick={async () => {
                            if (!window.confirm(`Remove ${m.displayName} from this circle?`)) return;
                            try {
                              await removeMember(activeCircle.id, m.userId);
                              const updated = await getMembers(activeCircle.id);
                              setCircleMembers(updated);
                              showToast("Removed");
                            } catch (e) { showToast(e.message); }
                          }}
                          style={{
                            background: "none", border: "none", fontFamily: "'Barlow', sans-serif",
                            fontSize: 11, fontWeight: 600, color: C.danger, cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <button
                onClick={async () => {
                  if (activeCircle?.role === "owner") {
                    const otherMembers = circleMembers.filter((m) => m.userId !== userId);
                    if (otherMembers.length === 0) {
                      showToast("You're the only member.");
                      return;
                    }
                    if (!window.confirm(`Transfer ownership to ${otherMembers[0].displayName} and leave?`)) return;
                    try { await leaveCircle(activeCircle.id, otherMembers[0].userId); setScreen("home"); showToast("Left circle"); } catch (e) { showToast(e.message); }
                  } else {
                    if (!window.confirm("Leave this circle? Your shared activities will become anonymous.")) return;
                    try { await leaveCircle(activeCircle.id); setScreen("home"); showToast("Left circle"); } catch (e) { showToast(e.message); }
                  }
                }}
                style={{
                  background: "none", border: "none", fontFamily: "'Barlow', sans-serif",
                  fontSize: 12, fontWeight: 600, color: C.danger, cursor: "pointer",
                  marginTop: 8, padding: 0,
                }}
              >
                Leave this circle
              </button>
            </>
          )}
        </div>

        {/* Feed cards */}
        {activeFeed.length === 0 ? (
          <EmptyState icon={"\uD83D\uDCE8"} message="No shared activities yet. Tap '+ Share' to share your first activity with this circle." />
        ) : (
          activeFeed.map((item) => {
            const dupKey = `${item.activity_name}|||${item.provider_name}`.toLowerCase();
            const dupCount = duplicateCounts[dupKey] || 1;
            const isBookmarked = bookmarks.has(item.id);
            const isFlagged = item.activity_flags?.length > 0;
            const dateLabel = formatDateRange(item.start_date, item.end_date);
            const isSharer = item.shared_by === userId;

            // Compute per-member statuses
            const sharerName = item.shared_by_name || "Someone";
            const sharerInitial = sharerName[0]?.toUpperCase() || "?";
            const myName = profile?.displayName || "You";
            const myInitial = myName[0]?.toUpperCase() || "?";

            // Check if current user has this program in their tracked programs
            const myProgram = item.program_id
              ? (programs || []).find((p) => p.id === item.program_id)
              : null;
            const myStatus = myProgram?.status || "none";

            return (
              <div key={item.id} style={{
                background: C.white, borderRadius: 12, boxShadow: SHADOW,
                marginBottom: 12, overflow: "hidden", position: "relative",
              }}>
                {/* Delete button — only visible to the person who shared */}
                {isSharer && (
                  <button
                    onClick={async () => {
                      if (!window.confirm("Remove from circle?")) return;
                      try {
                        await deleteSharedActivity(item.id, activeCircle?.id);
                        showToast("Removed from circle");
                      } catch (e) { showToast(e.message || "Failed to remove"); }
                    }}
                    style={{
                      position: "absolute", top: 10, right: 10, zIndex: 2,
                      background: "rgba(239,68,68,0.08)", border: "none", borderRadius: 8,
                      padding: 6, cursor: "pointer", display: "flex", alignItems: "center",
                      justifyContent: "center", lineHeight: 1,
                    }}
                    aria-label="Remove shared activity"
                  >
                    <TrashIcon size={15} color={C.danger} />
                  </button>
                )}

                {/* Attribution row */}
                <div style={{ padding: "12px 14px 0", display: "flex", alignItems: "center", gap: 8, paddingRight: isSharer ? 40 : 14 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8,
                    background: `linear-gradient(135deg, ${C.seaGreen}, ${C.blue})`,
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>
                    {sharerInitial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>
                      <strong style={{ color: C.ink }}>{sharerName}</strong>
                      {item.child_name && <> shared <strong style={{ color: C.ink }}>{item.child_name}</strong>'s activity</>}
                    </span>
                  </div>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, flexShrink: 0 }}>
                    {timeAgo(item.shared_at)}
                  </span>
                </div>

                {/* Activity card (cloud background) */}
                <div style={{
                  margin: "10px 14px 0", background: C.cream, borderRadius: 10, padding: "12px 14px",
                }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
                    {item.activity_name}
                  </div>
                  {item.provider_name && (
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.seaGreen, fontWeight: 600, marginTop: 2 }}>
                      {item.provider_name}
                    </div>
                  )}

                  {/* Details with icons */}
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    {(item.schedule_info || dateLabel) && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {[item.schedule_info, dateLabel].filter(Boolean).join(" · ")}
                      </div>
                    )}
                    {item.age_group && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                        {item.age_group}
                      </div>
                    )}
                    {item.location && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        {item.location}
                      </div>
                    )}
                  </div>

                  {/* Duplicate indicator */}
                  {dupCount > 1 && (
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.seaGreen, fontWeight: 600, marginTop: 6 }}>
                      {dupCount} parents shared this program
                    </div>
                  )}
                  {/* Per-member status pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {/* Sharer's status — only show if sharer is not the current user */}
                    {!isSharer && (
                      <StatusPill
                        initial={sharerInitial}
                        status={item.sharer_status || "none"}
                        label={sharerName.split(" ")[0]}
                      />
                    )}
                    {/* Current user's status */}
                    <StatusPill
                      initial={myInitial}
                      status={myStatus}
                      label="You"
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ padding: "10px 14px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    onClick={() => toggleBookmark(item.id, item)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: isBookmarked ? `${C.olive}14` : "transparent",
                      border: `1px solid ${isBookmarked ? C.olive + "30" : C.border}`,
                      borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                      fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
                      color: isBookmarked ? C.olive : C.muted,
                    }}
                    aria-label={isBookmarked ? "Remove from favorites" : "Add to favorites"}
                  >
                    <HeartIcon filled={isBookmarked} size={14} />
                    {isBookmarked ? "Saved" : "Bookmark"}
                  </button>

                  {item.registration_url && (
                    <a
                      href={item.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        background: C.seaGreen, border: "none",
                        borderRadius: 8, padding: "6px 14px", fontSize: 13,
                        fontFamily: "'Barlow', sans-serif", fontWeight: 700,
                        color: "#fff", textDecoration: "none", cursor: "pointer",
                      }}
                    >
                      Register &rarr;
                    </a>
                  )}

                  <button
                    onClick={() => {
                      flagActivity(item.id, "Reported as outdated", activeCircle?.id).then(() => showToast("Flagged!")).catch((e) => showToast(e.message || "Already flagged"));
                    }}
                    style={{
                      background: isFlagged ? "#FEE2E2" : "none",
                      border: `1px solid ${isFlagged ? "#FECACA" : C.border}`,
                      borderRadius: 8, padding: "6px 10px", fontSize: 12,
                      fontFamily: "'Barlow', sans-serif", fontWeight: 600,
                      color: isFlagged ? "#991B1B" : C.muted, cursor: "pointer", marginLeft: "auto",
                    }}
                  >
                    {isFlagged ? "Flagged" : "Flag"}
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Invite drawer — slides up from bottom */}
        {showInviteDrawer && activeCircle?.inviteCode && (
          <>
            <div
              onClick={() => setShowInviteDrawer(false)}
              style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(27,36,50,0.4)", zIndex: 100,
              }}
            />
            <div style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 101,
              background: C.white, borderRadius: "20px 20px 0 0",
              padding: "20px 20px 32px", maxWidth: 480, margin: "0 auto",
              boxShadow: "0 -4px 24px rgba(27,36,50,0.15)",
              animation: "slideUp 0.25s ease-out",
            }}>
              <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: C.ink }}>
                  Invite to {activeCircle.name}
                </div>
                <button onClick={() => setShowInviteDrawer(false)} style={{ background: "none", border: "none", fontSize: 20, color: C.muted, cursor: "pointer", padding: 4 }}>{"\u2715"}</button>
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 12 }}>
                Share this invite code with another parent:
              </div>
              <div style={{
                background: C.cream, borderRadius: 10, padding: "12px 16px", marginBottom: 16,
                fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: C.ink,
                textAlign: "center", border: `1px solid ${C.border}`, letterSpacing: 1,
              }}>
                {activeCircle.inviteCode}
              </div>
              <ShareIcons
                shareText={`Join my circle "${activeCircle.name}" on Skeddo! Use invite code: ${activeCircle.inviteCode}`}
                shareUrl="https://skeddo.ca"
                onCopy={() => { (navigator.clipboard ? navigator.clipboard.writeText(activeCircle.inviteCode) : Promise.reject()).catch(() => {}); showToast("Invite code copied!"); setShowInviteDrawer(false); }}
                subject={`Join my Skeddo circle: ${activeCircle.name}`}
              />
            </div>
          </>
        )}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN 3: Share Sheet (bottom sheet overlay)
     ═══════════════════════════════════════════════ */
  if (screen === "share") {
    return (
      <>
        {/* Dark backdrop */}
        <div
          onClick={() => setScreen("feed")}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(27,36,50,0.45)", zIndex: 200,
          }}
        />

        {/* Bottom sheet */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
          background: C.white, borderRadius: "20px 20px 0 0",
          padding: "0 0 env(safe-area-inset-bottom, 16px)",
          maxWidth: 480, margin: "0 auto", maxHeight: "85vh",
          boxShadow: "0 -4px 24px rgba(27,36,50,0.18)",
          animation: "slideUp 0.25s ease-out",
          display: "flex", flexDirection: "column",
        }}>
          <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

          {/* Pill handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
          </div>

          {/* Header */}
          <div style={{ padding: "4px 20px 12px" }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, color: C.ink, margin: "0 0 4px" }}>
              Share to Circle
            </h3>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, margin: 0 }}>
              Sharing to <strong style={{ color: C.ink }}>{activeCircle?.name}</strong>
            </p>
          </div>

          {/* Activity list (scrollable) */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px", WebkitOverflowScrolling: "touch" }}>
            {shareableActivities.length === 0 ? (
              <EmptyState icon={"\uD83D\uDCCB"} message="No tracked programs to share. Add programs from the Discover tab first." />
            ) : (
              shareableActivities.map((a) => {
                const isSelected = selectedActivities.has(a.id);
                const isAlreadyShared = alreadySharedIds.has(a.id) || alreadySharedIds.has(a.activityName);

                return (
                  <div
                    key={a.id}
                    onClick={() => {
                      if (isAlreadyShared) return;
                      setSelectedActivities((prev) => {
                        const n = new Set(prev);
                        if (n.has(a.id)) n.delete(a.id); else n.add(a.id);
                        return n;
                      });
                    }}
                    onKeyDown={(e) => {
                      if (isAlreadyShared) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedActivities((prev) => { const n = new Set(prev); if (n.has(a.id)) n.delete(a.id); else n.add(a.id); return n; });
                      }
                    }}
                    role="button"
                    tabIndex={isAlreadyShared ? -1 : 0}
                    style={{
                      background: isAlreadyShared ? `${C.border}40` : isSelected ? SOFT.seaGreen : C.white,
                      borderRadius: 12, padding: "12px 14px", marginBottom: 8,
                      border: `2px solid ${isAlreadyShared ? C.border : isSelected ? C.seaGreen : "transparent"}`,
                      boxShadow: isSelected ? `0 0 0 2px ${C.seaGreen}30` : SHADOW,
                      cursor: isAlreadyShared ? "default" : "pointer",
                      display: "flex", alignItems: "center", gap: 12,
                      opacity: isAlreadyShared ? 0.6 : 1,
                    }}
                  >
                    {/* Selection ring / checkbox */}
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      border: `2px solid ${isAlreadyShared ? C.border : isSelected ? C.seaGreen : C.border}`,
                      background: isSelected && !isAlreadyShared ? C.seaGreen : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, color: "#fff", flexShrink: 0,
                      transition: "all 0.15s",
                    }}>
                      {isSelected && !isAlreadyShared ? "\u2713" : ""}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: isAlreadyShared ? C.muted : C.ink }}>
                          {a.activityName}
                        </span>
                        {isAlreadyShared && (
                          <span style={{
                            fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                            color: C.muted, background: `${C.border}60`, padding: "1px 8px",
                            borderRadius: 20, textTransform: "uppercase",
                          }}>
                            Shared
                          </span>
                        )}
                        {!isAlreadyShared && a.status && a.status !== "Enrolled" && (
                          <span style={{
                            fontSize: 11, fontWeight: 700, fontFamily: "'Barlow', sans-serif",
                            color: a.status === "Waitlist" ? C.olive : C.blue,
                            background: a.status === "Waitlist" ? "rgba(231,111,81,0.10)" : "rgba(74,111,165,0.10)",
                            padding: "2px 8px", borderRadius: 20, textTransform: "uppercase",
                            letterSpacing: 0.3, whiteSpace: "nowrap",
                          }}>
                            {a.status === "Waitlist" ? "Waitlist" : "Exploring"}
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>
                        {a.providerName}{a.childName ? ` · ${a.childName}` : ""}
                      </div>
                      {a.scheduleInfo && (
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>
                          {a.scheduleInfo}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Share button */}
          {shareableActivities.length > 0 && (
            <div style={{ padding: "12px 20px 8px", borderTop: `1px solid ${C.border}` }}>
              <button
                style={{
                  ...s.primaryBtn, width: "100%",
                  opacity: selectedActivities.size === 0 || actionLoading ? 0.5 : 1,
                  fontSize: 16, borderRadius: 12, padding: "14px 24px",
                }}
                onClick={handleShare}
                disabled={selectedActivities.size === 0 || actionLoading}
              >
                {actionLoading
                  ? "Sharing..."
                  : `${selectedActivities.size} Activit${selectedActivities.size === 1 ? "y" : "ies"}`
                }
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  return null;
}
