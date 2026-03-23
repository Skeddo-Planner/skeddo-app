import { useState, useEffect, useMemo, useRef } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import EmptyState from "../components/EmptyState";
import PromoBanner from "../components/PromoBanner";
import { trackEvent } from "../utils/analytics";

/* ─── Soft color variants ─── */
const SOFT = {
  seaGreen: "#ECFDF5",
  blue: "#EFF6FF",
  lilac: "#FEF3E2",
  gold: "#FEF3E2",
};

const CIRCLE_EMOJIS = ["👨‍👩‍👧‍👦", "⚽", "🎨", "🎵", "📚", "🏕️", "🎭", "🧪", "🏊", "🚴"];

/* SVG share icons matching tab bar stroke style */
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
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>
            {a.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ─── Sub-header with back arrow ─── */
function SubHeader({ title, onBack, right }) {
  return (
    <div style={{
      padding: "14px 0", display: "flex", alignItems: "center", gap: 12,
      borderBottom: `1px solid ${C.border}`, marginBottom: 16,
    }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.ink, padding: 0,
      }} aria-label="Go back">{"\u2190"}</button>
      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, color: C.ink, flex: 1 }}>{title}</span>
      {right}
    </div>
  );
}

function Tag({ children, color, bg }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, fontFamily: "'Barlow', sans-serif",
      color, background: bg, padding: "2px 8px", borderRadius: 20,
      textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CirclesTab({
  programs, kids, profile, showToast, userId, circlesHook, planAccess, onInviteCoParent,
}) {
  const {
    circles, pendingRequests, activeFeed, bookmarks, bookmarkedActivities, referrals, loading,
    referralCode, referralUrl, membersRecruited, freeMonthsEarned,
    createCircle, joinCircle, handleMemberRequest, leaveCircle, removeMember,
    shareActivities, loadFeed, toggleBookmark, flagActivity,
    ensureReferralCode, getMembers, refreshPending, pendingCount,
  } = circlesHook;

  const [screen, setScreen] = useState("home"); // home | feed | share | invite | create | join
  const [activeCircle, setActiveCircle] = useState(null);
  const [createName, setCreateName] = useState("");
  const [createEmoji, setCreateEmoji] = useState("👨‍👩‍👧‍👦");
  const [joinCode, setJoinCode] = useState("");
  const [selectedActivities, setSelectedActivities] = useState(new Set());
  const [circleMembers, setCircleMembers] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [showSharingBanner, setShowSharingBanner] = useState(true);

  // Stable refs to avoid useEffect dependency loops
  const ensureReferralCodeRef = useRef(ensureReferralCode);
  ensureReferralCodeRef.current = ensureReferralCode;
  const refreshPendingRef = useRef(refreshPending);
  refreshPendingRef.current = refreshPending;

  useEffect(() => {
    if (screen === "invite" && !referralCode) {
      ensureReferralCodeRef.current().catch(() => {});
    }
    if (screen === "home") {
      refreshPendingRef.current();
    }
  }, [screen, referralCode]);

  // Build shareable activities from ALL tracked programs (enrolled, waitlisted, and exploring)
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
    };
  });

  // Duplicate detection for feed (memoized)
  const duplicateCounts = useMemo(() => {
    const counts = {};
    activeFeed.forEach((item) => {
      const key = `${item.activity_name}|||${item.provider_name}`.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [activeFeed]);

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
      await shareActivities(activeCircle.id, toShare);
      trackEvent("share_activity", { count: toShare.length, circle_name: activeCircle.name });
      setSelectedActivities(new Set());
      setScreen("feed");
      showToast(`Shared ${toShare.length} activit${toShare.length === 1 ? "y" : "ies"}!`);
    } catch (err) {
      showToast(err.message);
    }
    setActionLoading(false);
  };

  // ─── SCREEN: Home ───
  if (screen === "home") {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink, margin: 0 }}>
              Circles
              {circles.length > 0 && (
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.olive, fontStyle: "italic", marginLeft: 8 }}>
                  {circles.length} circle{circles.length !== 1 ? "s" : ""}
                </span>
              )}
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, margin: "2px 0 0" }}>
              Share schedules with your parent groups
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => planAccess.canUseCircles ? setScreen("join") : showToast("Upgrade to Skeddo Plus to use Circles")}
              style={{ ...s.secondaryBtn, fontSize: 12, padding: "8px 12px", opacity: planAccess.canUseCircles ? 1 : 0.5 }}
            >
              Join
            </button>
            <button
              onClick={() => planAccess.canUseCircles ? setScreen("create") : showToast("Upgrade to Skeddo Plus to use Circles")}
              style={{ ...s.addButton, fontSize: 12, padding: "8px 12px", opacity: planAccess.canUseCircles ? 1 : 0.5 }}
            >
              + Create
            </button>
          </div>
        </div>

        {showSharingBanner && !planAccess.canUseCircles && <PromoBanner type="upgrade-sharing" onDismiss={() => setShowSharingBanner(false)} />}

        {/* Pending requests */}
        {pendingRequests.length > 0 && (
          <div style={{ background: SOFT.lilac, borderRadius: 12, padding: "12px 16px", marginBottom: 16, border: `1px solid ${C.lilac}22` }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.lilac, marginBottom: 8, textTransform: "uppercase" }}>
              {pendingRequests.length} pending request{pendingRequests.length !== 1 ? "s" : ""}
            </div>
            {pendingRequests.map((req) => (
              <div key={req.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.lilac}18` }}>
                <div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: C.ink }}>
                    {req.displayName || "Someone"}
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                    wants to join {req.circleName || "your circle"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => handleMemberRequest(req.id, "approve").then(() => showToast("Approved!")).catch((e) => showToast(e.message || "Failed"))}
                    style={{ background: C.seaGreen, color: C.cream, border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow', sans-serif" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleMemberRequest(req.id, "decline").then(() => showToast("Declined")).catch((e) => showToast(e.message || "Failed"))}
                    style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", color: C.muted, fontFamily: "'Barlow', sans-serif" }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Circle list */}
        {circles.length === 0 && !loading ? (
          <EmptyState
            icon={"\uD83D\uDC65"}
            message="No circles yet. Create one to start sharing schedules with other parents."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {circles.map((c) => (
              <div
                key={c.id}
                onClick={() => openCircleFeed(c)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCircleFeed(c); } }}
                role="button"
                tabIndex={0}
                className="skeddo-card"
                style={{
                  background: C.white, borderRadius: 14, padding: "14px 16px",
                  border: `1px solid ${C.border}`, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: SOFT.seaGreen,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
                }}>
                  {c.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 700, color: C.ink }}>
                    {c.name}
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
                    {c.memberCount} member{c.memberCount !== 1 ? "s" : ""}
                  </div>
                </div>
                {c.newCount > 0 && (
                  <Tag color={C.seaGreen} bg={SOFT.seaGreen}>{c.newCount} new</Tag>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Co-parent invite banner */}
        {onInviteCoParent && kids.length > 0 && (
          <div
            onClick={onInviteCoParent}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onInviteCoParent(); } }}
            role="button"
            tabIndex={0}
            className="skeddo-card"
            style={{
              marginTop: 20, borderRadius: 14, padding: "14px 16px",
              background: C.white, border: `1.5px solid ${C.blue}30`,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: `${C.blue}14`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink }}>
                Invite a co-parent
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                Let a partner or caregiver help manage schedules
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        )}

        {/* Referral banner */}
        <div
          onClick={() => setScreen("invite")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setScreen("invite"); } }}
          role="button"
          tabIndex={0}
          style={{
            marginTop: 20, borderRadius: 14, padding: "16px 18px",
            background: `linear-gradient(135deg, ${C.ink} 0%, #2E4A3C 100%)`,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
          }}
        >
          <span style={{ fontSize: 28 }}>{"\uD83C\uDF81"}</span>
          <div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.cream }}>
              Invite a friend, get a free month
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "#B0C4B6" }}>
              Share your referral link with other parents
            </div>
          </div>
        </div>

        {/* Bookmarked activities */}
        {bookmarkedActivities.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
              {"\u2764\uFE0F"} Saved Activities ({bookmarkedActivities.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {bookmarkedActivities.map((a) => (
                <div key={a.id} style={{
                  background: C.white, borderRadius: 12, padding: "12px 14px",
                  border: `1px solid ${C.border}`,
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink }}>
                      {a.activity_name}
                    </div>
                    {a.provider_name && (
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginTop: 2 }}>
                        {a.provider_name}
                      </div>
                    )}
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>
                      {[a.child_name, a.schedule_info, a.age_group].filter(Boolean).join(" · ")}
                    </div>
                    {a.shared_by_name && (
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: C.olive, marginTop: 4 }}>
                        Shared by {a.shared_by_name} · {timeAgo(a.shared_at)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {a.registration_url && (
                      <button
                        onClick={() => window.open(a.registration_url, "_blank")}
                        style={{
                          background: C.seaGreen, color: C.cream, border: "none", borderRadius: 8,
                          padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer",
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
                        padding: "6px 8px", fontSize: 14, cursor: "pointer", lineHeight: 1,
                      }}
                      aria-label="Remove bookmark"
                    >
                      {"\u2764\uFE0F"}
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

  // ─── SCREEN: Create Circle ───
  if (screen === "create") {
    return (
      <div>
        <SubHeader title="Create a Circle" onBack={() => setScreen("home")} />
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
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

  // ─── SCREEN: Join Circle ───
  if (screen === "join") {
    return (
      <div>
        <SubHeader title="Join a Circle" onBack={() => setScreen("home")} />
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
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
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 4, marginBottom: 16 }}>
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

  // ─── SCREEN: Circle Feed ───
  if (screen === "feed") {
    return (
      <div>
        <SubHeader
          title={activeCircle?.name || "Circle"}
          onBack={() => { setScreen("home"); setActiveCircle(null); }}
          right={
            <button
              onClick={() => planAccess.canUseCircles ? setScreen("share") : showToast("Upgrade to Skeddo Plus to use Circles")}
              style={{ ...s.addButton, fontSize: 11, padding: "6px 12px", opacity: planAccess.canUseCircles ? 1 : 0.5 }}
            >
              + Share
            </button>
          }
        />

        {/* Members list with roles + remove */}
        <div style={{
          background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(27, 36, 50, 0.07), 0 1px 3px rgba(27, 36, 50, 0.04)",
          padding: "12px 14px", marginBottom: 16,
        }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
            Members ({circleMembers.length})
          </div>
          {circleMembers.map((m) => {
            const isMe = m.userId === userId;
            const isOwner = activeCircle?.role === "owner";
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
                    {m.displayName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink }}>
                    {m.displayName}{isMe ? " (you)" : ""}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700,
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
        </div>

        {/* Invite code + share icons */}
        {activeCircle?.inviteCode && (
          <div style={{
            background: SOFT.blue, borderRadius: 12, padding: "14px 16px", marginBottom: 16,
            border: `1px solid ${C.blue}18`,
          }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
              Invite Code
            </div>
            <div style={{
              background: C.white, borderRadius: 8, padding: "8px 12px", marginBottom: 12,
              fontFamily: "monospace", fontSize: 13, color: C.ink, border: `1px solid ${C.border}`,
            }}>
              {activeCircle.inviteCode}
            </div>
            <ShareIcons
              shareText={`Join my circle "${activeCircle.name}" on Skeddo! Use invite code: ${activeCircle.inviteCode}`}
              shareUrl="https://skeddo.ca"
              onCopy={() => { (navigator.clipboard ? navigator.clipboard.writeText(activeCircle.inviteCode) : Promise.reject()).catch(() => {}); showToast("Invite code copied!"); }}
              subject={`Join my Skeddo circle: ${activeCircle.name}`}
            />
          </div>
        )}

        {/* Feed */}
        {activeFeed.length === 0 ? (
          <EmptyState icon={"\uD83D\uDCE8"} message="No shared activities yet. Tap '+ Share' to share your first activity with this circle." />
        ) : (
          activeFeed.map((item) => {
            const dupKey = `${item.activity_name}|||${item.provider_name}`.toLowerCase();
            const dupCount = duplicateCounts[dupKey] || 1;
            const isBookmarked = bookmarks.has(item.id);
            const isFlagged = item.activity_flags?.length > 0;

            return (
              <div key={item.id} style={{
                background: C.white, borderRadius: 14, padding: "14px 16px",
                border: `1px solid ${C.border}`, marginBottom: 10,
              }}>
                {/* Attribution */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
                    <strong style={{ color: C.ink }}>{item.shared_by_name || "A parent"}</strong>
                    {item.child_name && <> shared {item.child_name}'s activity</>}
                  </div>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: C.muted }}>
                    {timeAgo(item.shared_at)}
                  </span>
                </div>

                {/* Activity card */}
                <div style={{ background: "#F8F9FA", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2 }}>
                    {item.activity_name}
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginBottom: 6 }}>
                    {item.provider_name}
                  </div>
                  {item.schedule_info && (
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                      {item.schedule_info}
                    </div>
                  )}
                  {item.age_group && (
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                      {item.age_group}
                    </div>
                  )}
                </div>

                {/* Duplicate indicator */}
                {dupCount > 1 && (
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.seaGreen, fontWeight: 600, marginBottom: 6 }}>
                    {dupCount} parents shared this program
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => toggleBookmark(item.id, item)}
                    style={{
                      background: isBookmarked ? SOFT.gold : "none",
                      border: `1px solid ${isBookmarked ? C.olive : C.border}`,
                      borderRadius: 8, padding: "6px 12px", fontSize: 12,
                      fontFamily: "'Barlow', sans-serif", fontWeight: 600,
                      color: isBookmarked ? C.olive : C.muted, cursor: "pointer",
                    }}
                  >
                    {isBookmarked ? "\uD83D\uDD16 Saved" : "\uD83D\uDD16 Bookmark"}
                  </button>
                  {item.registration_url && (
                    <a
                      href={item.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: SOFT.seaGreen, border: `1px solid ${C.seaGreen}22`,
                        borderRadius: 8, padding: "6px 12px", fontSize: 12,
                        fontFamily: "'Barlow', sans-serif", fontWeight: 600,
                        color: C.seaGreen, textDecoration: "none", cursor: "pointer",
                      }}
                    >
                      Register {"\u2192"}
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
      </div>
    );
  }

  // ─── SCREEN: Share Activity ───
  if (screen === "share") {
    return (
      <div>
        <SubHeader title="Share to Circle" onBack={() => setScreen("feed")} />
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
          Choose which activities to share with <strong style={{ color: C.ink }}>{activeCircle?.name}</strong>.
          Circle members will see the child's first name and activity details.
        </p>

        {shareableActivities.length === 0 ? (
          <EmptyState icon={"\uD83D\uDCCB"} message="No tracked programs to share. Add programs from the Discover tab first." />
        ) : (
          <>
            {shareableActivities.map((a) => {
              const isSelected = selectedActivities.has(a.id);
              return (
                <div
                  key={a.id}
                  onClick={() => {
                    setSelectedActivities((prev) => {
                      const n = new Set(prev);
                      if (n.has(a.id)) n.delete(a.id); else n.add(a.id);
                      return n;
                    });
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedActivities((prev) => { const n = new Set(prev); if (n.has(a.id)) n.delete(a.id); else n.add(a.id); return n; }); } }}
                  role="button"
                  tabIndex={0}
                  style={{
                    background: isSelected ? SOFT.seaGreen : C.white,
                    borderRadius: 12, padding: "12px 14px", marginBottom: 8,
                    border: `1px solid ${isSelected ? C.seaGreen : C.border}`,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    border: `2px solid ${isSelected ? C.seaGreen : C.border}`,
                    background: isSelected ? C.seaGreen : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, color: C.cream, flexShrink: 0,
                  }}>
                    {isSelected ? "\u2713" : ""}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.ink }}>
                        {a.activityName}
                      </span>
                      {a.status && a.status !== "Enrolled" && (
                        <Tag
                          color={a.status === "Waitlist" ? C.olive : C.blue}
                          bg={a.status === "Waitlist" ? "rgba(231,111,81,0.10)" : "rgba(74,111,165,0.10)"}
                        >
                          {a.status === "Waitlist" ? "Waitlist" : "Exploring"}
                        </Tag>
                      )}
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                      {a.providerName}{a.childName ? ` · ${a.childName}` : ""}
                    </div>
                    {a.scheduleInfo && (
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: C.muted }}>
                        {a.scheduleInfo}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <button
              style={{
                ...s.primaryBtn, width: "100%", marginTop: 12,
                opacity: selectedActivities.size === 0 || actionLoading ? 0.5 : 1,
              }}
              onClick={handleShare}
              disabled={selectedActivities.size === 0 || actionLoading}
            >
              {actionLoading
                ? "Sharing..."
                : `Share ${selectedActivities.size} Activit${selectedActivities.size === 1 ? "y" : "ies"}`
              }
            </button>
          </>
        )}
      </div>
    );
  }

  // ─── SCREEN: Invite & Referrals ───
  if (screen === "invite") {
    const shareUrl = referralUrl || "Loading...";
    const shareText = "I use Skeddo to plan my kids' camps and activities. Join with my link and we both get a free month!";

    return (
      <div>
        <SubHeader title="Invite Friends" onBack={() => setScreen("home")} />

        {/* Stats card */}
        <div style={{
          borderRadius: 14, padding: "18px 20px",
          background: `linear-gradient(135deg, ${C.ink} 0%, #2E4A3C 100%)`,
          marginBottom: 16,
        }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, color: C.cream, marginBottom: 12 }}>
            Give a month, get a month
          </div>
          <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
            {[
              { num: membersRecruited, label: "Recruited" },
              { num: freeMonthsEarned, label: "Free Months" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, color: C.cream }}>{stat.num}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "#B0C4B6", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral link */}
        <div style={{
          background: C.white, borderRadius: 14, padding: "16px 18px",
          border: `1px solid ${C.border}`, marginBottom: 12,
        }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
            Your Referral Link
          </div>
          <div style={{
            background: "#F2F0EC", borderRadius: 10, padding: "10px 12px",
            fontFamily: "monospace", fontSize: 12, color: C.ink, wordBreak: "break-all",
            border: `1px solid ${C.border}`,
          }}>
            {shareUrl}
          </div>
        </div>

        {/* Share icons */}
        <div style={{ marginBottom: 20 }}>
          <ShareIcons
            shareText={shareText}
            shareUrl={shareUrl}
            onCopy={() => { (navigator.clipboard ? navigator.clipboard.writeText(shareUrl) : Promise.reject()).catch(() => {}); showToast("Link copied!"); }}
            subject="Join me on Skeddo!"
          />
        </div>

        {/* How referrals work */}
        <div style={{ background: C.white, borderRadius: 12, padding: "16px 18px", boxShadow: "0 2px 8px rgba(27, 36, 50, 0.07), 0 1px 3px rgba(27, 36, 50, 0.04)", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
            How referrals work
          </div>
          {[
            { num: "1", text: "Share your referral link with another parent" },
            { num: "2", text: "They sign up for Skeddo Plus" },
            { num: "3", text: "You both get a free month!" },
          ].map((step) => (
            <div key={step.num} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", background: C.seaGreen,
                color: C.cream, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, fontFamily: "'Barlow', sans-serif", flexShrink: 0,
              }}>{step.num}</div>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.4 }}>{step.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
