import { useState, useEffect } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import EmptyState from "../components/EmptyState";

/* ─── Soft color variants ─── */
const SOFT = {
  seaGreen: "#EDF7F1",
  blue: "#EBF2F8",
  lilac: "#F9EFF3",
  gold: "#FBF6E6",
};

const CIRCLE_EMOJIS = ["👨‍👩‍👧‍👦", "⚽", "🎨", "🎵", "📚", "🏕️", "🎭", "🧪", "🏊", "🚴"];

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
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CirclesTab({
  programs, kids, profile, showToast, userId, circlesHook,
}) {
  const {
    circles, pendingRequests, activeFeed, bookmarks, referrals, loading,
    createCircle, joinCircle, handleMemberRequest, leaveCircle,
    shareActivities, loadFeed, toggleBookmark, flagActivity,
    createReferral, getMembers, pendingCount,
  } = circlesHook;

  const [screen, setScreen] = useState("home"); // home | feed | share | invite | create | join
  const [activeCircle, setActiveCircle] = useState(null);
  const [createName, setCreateName] = useState("");
  const [createEmoji, setCreateEmoji] = useState("👨‍👩‍👧‍👦");
  const [joinCode, setJoinCode] = useState("");
  const [selectedActivities, setSelectedActivities] = useState(new Set());
  const [circleMembers, setCircleMembers] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Build shareable activities from user's enrolled programs
  const shareableActivities = (programs || []).map((p) => {
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
    };
  });

  // Duplicate detection for feed
  const getDuplicateCounts = () => {
    const counts = {};
    activeFeed.forEach((item) => {
      const key = `${item.activity_name}|||${item.provider_name}`.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  };

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
      setSelectedActivities(new Set());
      setScreen("feed");
      showToast(`Shared ${toShare.length} activit${toShare.length === 1 ? "y" : "ies"}!`);
    } catch (err) {
      showToast(err.message);
    }
    setActionLoading(false);
  };

  const duplicateCounts = getDuplicateCounts();

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
              onClick={() => setScreen("join")}
              style={{ ...s.secondaryBtn, fontSize: 12, padding: "8px 12px" }}
            >
              Join
            </button>
            <button
              onClick={() => setScreen("create")}
              style={{ ...s.addButton, fontSize: 12, padding: "8px 12px" }}
            >
              + Create
            </button>
          </div>
        </div>

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
                    {req.profiles?.display_name || "Someone"}
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                    wants to join {req.circles?.name}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => handleMemberRequest(req.id, "approve").then(() => showToast("Approved!"))}
                    style={{ background: C.seaGreen, color: C.cream, border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow', sans-serif" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleMemberRequest(req.id, "decline").then(() => showToast("Declined"))}
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

        {/* Referral banner */}
        <div
          onClick={() => setScreen("invite")}
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
              onClick={() => setScreen("share")}
              style={{ ...s.addButton, fontSize: 11, padding: "6px 12px" }}
            >
              + Share
            </button>
          }
        />

        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          <Tag color={C.seaGreen} bg={SOFT.seaGreen}>
            {circleMembers.length} member{circleMembers.length !== 1 ? "s" : ""}
          </Tag>
          {activeCircle?.role === "owner" && (
            <Tag color={C.olive} bg={SOFT.gold}>Owner</Tag>
          )}
        </div>

        {/* Invite code for sharing */}
        {activeCircle?.inviteCode && activeCircle?.role === "owner" && (
          <div style={{
            background: SOFT.blue, borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Invite Code
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 13, color: C.ink }}>
                {activeCircle.inviteCode}
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(activeCircle.inviteCode).catch(() => {});
                showToast("Invite code copied!");
              }}
              style={{
                background: C.blue, color: C.cream, border: "none", borderRadius: 6,
                padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              Copy
            </button>
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
                <div style={{ background: "#FAF8F3", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
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
                    onClick={() => toggleBookmark(item.id)}
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
                      flagActivity(item.id, "Reported as outdated").then(() => showToast("Flagged!")).catch(() => {});
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
          <EmptyState icon={"\uD83D\uDCCB"} message="No enrolled programs to share. Add programs from the Discover tab first." />
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
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.ink }}>
                      {a.activityName}
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
    const totalInvited = referrals.length;
    const totalConverted = referrals.filter((r) => r.status === "converted").length;
    const totalMonths = referrals.reduce((sum, r) => sum + (r.status === "converted" ? r.reward_months : 0), 0);

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
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { num: totalInvited, label: "Invited" },
              { num: totalConverted, label: "Joined" },
              { num: totalMonths, label: "mo Earned" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.cream }}>{stat.num}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "#B0C4B6", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate referral link */}
        <button
          onClick={async () => {
            setActionLoading(true);
            try {
              const result = await createReferral();
              showToast("Referral link created!");
              // Copy to clipboard
              await navigator.clipboard.writeText(result.referralUrl).catch(() => {});
              showToast("Link copied to clipboard!");
            } catch (err) {
              showToast(err.message);
            }
            setActionLoading(false);
          }}
          style={{ ...s.primaryBtn, width: "100%", marginBottom: 16, opacity: actionLoading ? 0.5 : 1 }}
          disabled={actionLoading}
        >
          {actionLoading ? "Generating..." : "Generate Referral Link"}
        </button>

        {/* How referrals work */}
        <div style={{ background: C.white, borderRadius: 14, padding: "16px 18px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
            How referrals work
          </div>
          {[
            { num: "1", text: "Share your referral link with another parent" },
            { num: "2", text: "They sign up for Skeddo Plus within 7 days" },
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

        {/* Your referrals */}
        {referrals.length > 0 && (
          <div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Your Referrals
            </div>
            {referrals.map((ref) => (
              <div key={ref.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: C.ink }}>
                  {ref.referral_code}
                </div>
                <Tag
                  color={ref.status === "converted" ? C.seaGreen : C.olive}
                  bg={ref.status === "converted" ? SOFT.seaGreen : SOFT.gold}
                >
                  {ref.status === "converted" ? "Joined" : ref.status === "expired" ? "Expired" : "Pending"}
                </Tag>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
