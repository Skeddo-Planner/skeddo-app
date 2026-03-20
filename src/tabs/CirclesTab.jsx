import { useState } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";

/* ─── Soft color variants (not in brand.js) ─── */
const SOFT = {
  seaGreen: "#EDF7F1",
  blue: "#EBF2F8",
  lilac: "#F9EFF3",
  gold: "#FBF6E6",
};

/* ─── Sub-header with back arrow ─── */
function SubHeader({ title, onBack, right }) {
  return (
    <div style={{
      padding: "14px 20px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      borderBottom: `1px solid ${C.border}`,
      background: C.cream,
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <button
        onClick={onBack}
        aria-label="Go back"
        style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.ink, padding: "4px 8px", lineHeight: 1 }}
      >
        &larr;
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: C.ink }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

/* ─── Tag chip ─── */
function Tag({ children, color, bg }) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      color,
      background: bg,
      padding: "3px 9px",
      borderRadius: 6,
      fontFamily: "'Barlow', sans-serif",
    }}>
      {children}
    </span>
  );
}

/* ─── Screen 1: Circles Home ─── */
function CirclesHome({ circles, onOpenCircle, onOpenInvite, showToast }) {
  return (
    <div>
      {/* Header */}
      <div style={{ padding: "20px 20px 10px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: C.ink, margin: 0 }}>Circles</h2>
          {circles.length > 0 && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: C.muted }}>
              {circles.length} circle{circles.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0", fontFamily: "'Barlow', sans-serif" }}>
          Share schedules with your parent groups
        </p>
      </div>

      {/* Create button */}
      <div style={{ padding: "6px 20px 14px" }}>
        <button
          onClick={() => showToast && showToast("Circles are coming soon!")}
          style={{
            width: "100%",
            padding: 13,
            background: C.seaGreen,
            color: C.cream,
            border: "none",
            borderRadius: 12,
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Create a Circle
        </button>
      </div>

      {/* Empty state when no circles */}
      {circles.length === 0 && (
        <div style={{ padding: "30px 20px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 14, opacity: 0.8 }}>{"\uD83D\uDC65"}</div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 6 }}>
            No circles yet
          </div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>
            Circles let you share your kids&apos; schedules with other parents — like your soccer team, neighbours, or music class families.
          </div>
        </div>
      )}

      {/* Circle cards */}
      {circles.length > 0 && (
        <div style={{ padding: "0 20px" }}>
          {circles.map((c) => (
            <div
              key={c.id}
              className="skeddo-card"
              onClick={() => onOpenCircle(c)}
              role="button"
              tabIndex={0}
              style={{
                background: C.white,
                borderRadius: 14,
                padding: "14px 16px",
                marginBottom: 10,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: c.colorSoft,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
              }}>
                {c.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.ink, fontFamily: "'Barlow', sans-serif" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFamily: "'Barlow', sans-serif" }}>{c.members} members</div>
              </div>
              {c.newCount > 0 && <Tag color={C.cream} bg={c.color}>{c.newCount} new</Tag>}
            </div>
          ))}
        </div>
      )}

      {/* Referral banner */}
      <div style={{ padding: "10px 20px 20px" }}>
        <div
          className="skeddo-card"
          onClick={onOpenInvite}
          role="button"
          tabIndex={0}
          style={{
            background: `linear-gradient(135deg, ${SOFT.gold} 0%, #FFF3D0 100%)`,
            borderRadius: 14,
            padding: 16,
            border: "1px solid #DDD09A",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{"\uD83C\uDF81"}</span>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink }}>Invite a friend, get a free month</span>
          </div>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.5, fontFamily: "'Barlow', sans-serif" }}>
            When they join Skeddo Plus within 7 days, you both get a free month. Share your link &rarr;
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Duplicate detection: count how many parents shared the same activity+provider ─── */
function getDuplicateCounts(feed) {
  const counts = {};
  feed.forEach((item) => {
    const key = `${item.activity}|||${item.provider}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

/* ─── Screen 2: Circle Feed ─── */
function CircleFeed({ circle, feed, onBack, onOpenShare }) {
  const [saved, setSaved] = useState({});
  const [flagged, setFlagged] = useState({});
  const toggle = (id) => setSaved((p) => ({ ...p, [id]: !p[id] }));
  const toggleFlag = (id) => setFlagged((p) => ({ ...p, [id]: !p[id] }));

  const dupCounts = getDuplicateCounts(feed);

  return (
    <div>
      <SubHeader
        title={`${circle.emoji} ${circle.name}`}
        onBack={onBack}
        right={
          <button
            onClick={onOpenShare}
            style={{
              background: C.seaGreen, color: C.cream, border: "none", borderRadius: 8,
              padding: "7px 12px", fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}
          >
            + Share
          </button>
        }
      />
      <div style={{ fontSize: 11, color: C.muted, padding: "6px 20px 0", fontFamily: "'Barlow', sans-serif" }}>
        {circle.members} members
      </div>

      {/* Empty feed state */}
      {feed.length === 0 && (
        <div style={{ padding: "50px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.8 }}>{"\uD83D\uDCE8"}</div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 6 }}>
            No shared activities yet
          </div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
            Tap <strong style={{ color: C.seaGreen }}>+ Share</strong> to share your kids&apos; programs with this circle.
          </div>
        </div>
      )}

      {/* Feed items */}
      {feed.length > 0 && (
        <div style={{ padding: "14px 20px" }}>
          {feed.map((item) => {
            const dupKey = `${item.activity}|||${item.provider}`;
            const dupCount = dupCounts[dupKey];

            return (
            <div key={item.id} style={{ background: C.white, borderRadius: 14, padding: 16, marginBottom: 12, border: `1px solid ${C.border}` }}>
              {/* Duplicate indicator */}
              {dupCount > 1 && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
                  padding: "5px 10px", background: SOFT.gold, borderRadius: 8,
                }}>
                  <span style={{ fontSize: 12 }}>{"\uD83D\uDD25"}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.olive, fontFamily: "'Barlow', sans-serif" }}>
                    {dupCount} parents shared this program
                  </span>
                </div>
              )}

              {/* Who shared */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", background: SOFT.seaGreen,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: C.seaGreen, flexShrink: 0,
                }}>
                  {item.parent[0]}
                </div>
                <div style={{ fontSize: 12, color: C.muted, flex: 1, lineHeight: 1.4, fontFamily: "'Barlow', sans-serif" }}>
                  <strong style={{ color: C.ink, fontWeight: 600 }}>{item.parent}</strong> shared{" "}
                  <strong style={{ color: C.ink, fontWeight: 600 }}>{item.child}</strong>&apos;s activity
                </div>
                <span style={{ fontSize: 10, color: C.muted, flexShrink: 0 }}>{item.time}</span>
              </div>

              {/* Activity details */}
              <div style={{ background: C.cream, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 2 }}>
                  {item.activity}
                </div>
                <div style={{ fontSize: 12, color: C.seaGreen, fontWeight: 600, marginBottom: 10, fontFamily: "'Barlow', sans-serif" }}>
                  {item.provider}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {[
                    { icon: "\uD83D\uDCC5", text: item.schedule },
                    { icon: "\uD83D\uDCC6", text: item.dates },
                    { icon: "\uD83D\uDC66", text: item.age },
                  ].filter((r) => r.text).map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: C.muted, fontFamily: "'Barlow', sans-serif" }}>
                      <span style={{ fontSize: 12 }}>{r.icon}</span>{r.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions: Bookmark, Register, Flag */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => toggle(item.id)}
                  style={{
                    flex: 1, padding: 9,
                    background: saved[item.id] ? SOFT.seaGreen : "transparent",
                    border: `1.5px solid ${saved[item.id] ? C.seaGreen : C.border}`,
                    borderRadius: 9,
                    fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
                    color: saved[item.id] ? C.seaGreen : C.muted,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  }}
                >
                  {saved[item.id] ? "\u2713 Saved" : "\uD83D\uDD16 Bookmark"}
                </button>
                <button style={{
                  flex: 1, padding: 9, background: C.seaGreen, border: "none", borderRadius: 9,
                  fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: C.cream,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                }}>
                  Register &rarr;
                </button>
                <button
                  onClick={() => toggleFlag(item.id)}
                  style={{
                    padding: "9px 12px",
                    background: flagged[item.id] ? SOFT.lilac : "transparent",
                    border: `1.5px solid ${flagged[item.id] ? C.lilac : C.border}`,
                    borderRadius: 9,
                    fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
                    color: flagged[item.id] ? C.lilac : C.muted,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  }}
                  aria-label="Flag outdated info"
                  title="Report outdated info"
                >
                  {flagged[item.id] ? "\u2713" : "\u26A0\uFE0F"}
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Screen 3: Share Sheet (bottom-sheet modal) ─── */
function ShareSheet({ circle, activities, onClose, showToast }) {
  const [sel, setSel] = useState({});
  const toggle = (id) => setSel((p) => ({ ...p, [id]: !p[id] }));
  const count = Object.values(sel).filter(Boolean).length;

  return (
    <div style={s.overlay} className="modal-bg" onClick={onClose}>
      <div style={s.modal} className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Drag handle */}
        <div style={{ width: 34, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 16px" }} />

        <h3 style={{ ...s.modalTitle, marginBottom: 4 }}>Share to Circle</h3>
        <p style={{ fontSize: 12, color: C.muted, margin: "0 0 6px", fontFamily: "'Barlow', sans-serif" }}>
          Sharing to <strong style={{ color: C.ink }}>{circle.name}</strong>
        </p>
        <p style={{ fontSize: 12, color: C.muted, margin: "0 0 16px", lineHeight: 1.4, fontFamily: "'Barlow', sans-serif" }}>
          Choose which activities to share. Circle members will see the child&apos;s first name and activity details.
        </p>

        {/* Empty state when user has no programs */}
        {activities.length === 0 && (
          <div style={{ padding: "24px 0", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.7 }}>{"\uD83D\uDCCB"}</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              No programs to share yet.<br />
              Add programs to your schedule first.
            </div>
          </div>
        )}

        {/* Program list */}
        {activities.map((a) => (
          <div
            key={a.id}
            onClick={() => toggle(a.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              background: C.white, borderRadius: 11, marginBottom: 7,
              border: `1.5px solid ${sel[a.id] ? C.seaGreen : C.border}`,
              cursor: "pointer",
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 5, flexShrink: 0,
              border: `2px solid ${sel[a.id] ? C.seaGreen : C.border}`,
              background: sel[a.id] ? C.seaGreen : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.cream, fontSize: 12, fontWeight: 700,
            }}>
              {sel[a.id] && "\u2713"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, fontFamily: "'Barlow', sans-serif" }}>{a.name}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontFamily: "'Barlow', sans-serif" }}>
                {a.provider}{a.detail ? ` \u00B7 ${a.detail}` : ""}
              </div>
              {a.child && (
                <div style={{ fontSize: 10, color: C.blue, marginTop: 2, fontFamily: "'Barlow', sans-serif" }}>
                  {a.child}
                </div>
              )}
            </div>
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={onClose} style={{ ...s.secondaryBtn, flex: 1 }}>Cancel</button>
          <button
            onClick={() => {
              if (count > 0 && showToast) {
                showToast("Sharing will be available when Circles launches");
                onClose();
              }
            }}
            style={{
              ...s.primaryBtn, flex: 2,
              opacity: count > 0 ? 1 : 0.5,
              cursor: count > 0 ? "pointer" : "default",
            }}
          >
            {count > 0 ? `Share ${count} Activit${count === 1 ? "y" : "ies"}` : "Select activities"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Screen 4: Invite & Referral ─── */
function InviteScreen({ onBack, showToast }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (showToast) showToast("Referrals coming soon!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <SubHeader title="Invite Friends" onBack={onBack} />

      <div style={{ padding: 20 }}>
        {/* Hero card */}
        <div style={{
          background: `linear-gradient(145deg, ${C.ink} 0%, #2E4A3C 100%)`,
          borderRadius: 18, padding: "22px 20px", marginBottom: 20, color: C.cream,
        }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, lineHeight: 1.2, marginBottom: 10 }}>
            Give a month,<br />get a <span style={{ fontStyle: "italic", color: C.olive }}>month</span>
          </div>
          <p style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.5, margin: "0 0 16px", fontFamily: "'Barlow', sans-serif" }}>
            Invite friends to Skeddo Plus. When they subscribe within 7 days, you both get a free month. No limits.
          </p>
          <div style={{ display: "flex", gap: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            {[
              { val: "0", label: "Invited" },
              { val: "0", label: "Joined" },
              { val: "0", label: "Earned" },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.cream, fontFamily: "'Poppins', sans-serif" }}>{stat.val}</div>
                <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2, fontFamily: "'Barlow', sans-serif" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral link */}
        <div style={{ background: C.white, borderRadius: 14, padding: 16, border: `1px solid ${C.border}`, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8, fontFamily: "'Barlow', sans-serif" }}>Your referral link</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              flex: 1, padding: "9px 12px", background: C.cream, borderRadius: 8,
              fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              fontFamily: "'Barlow', sans-serif",
            }}>
              Coming soon
            </div>
            <button
              onClick={handleCopy}
              style={{
                padding: "9px 14px",
                background: copied ? SOFT.seaGreen : C.ink,
                color: copied ? C.seaGreen : C.cream,
                border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "'Barlow', sans-serif", whiteSpace: "nowrap",
              }}
            >
              {copied ? "Copied \u2713" : "Copy"}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            { l: "Text", i: "\uD83D\uDCAC" },
            { l: "Email", i: "\uD83D\uDCE7" },
            { l: "WhatsApp", i: "\uD83D\uDCF1" },
          ].map((o) => (
            <button
              key={o.l}
              className="skeddo-card"
              onClick={() => showToast && showToast("Referrals coming soon!")}
              style={{
                flex: 1, padding: "12px 8px", background: C.white,
                border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
              }}
            >
              <span style={{ fontSize: 20 }}>{o.i}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.ink, fontFamily: "'Barlow', sans-serif" }}>{o.l}</span>
            </button>
          ))}
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 12, fontFamily: "'Barlow', sans-serif" }}>How referrals work</div>
          {[
            "Share your invite link with a friend",
            "They sign up for Skeddo Plus within 7 days",
            "You both get a free month \u2014 instantly",
          ].map((text, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", background: SOFT.seaGreen, color: C.seaGreen,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0, fontFamily: "'Barlow', sans-serif",
              }}>{i + 1}</div>
              <span style={{ fontSize: 13, color: C.ink, fontFamily: "'Barlow', sans-serif" }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Empty referral list */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10, fontFamily: "'Barlow', sans-serif" }}>Your referrals</div>
          <div style={{ padding: "16px 0", textAlign: "center" }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>
              No referrals yet. Share your link to get started!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Build activities list from user's real programs ─── */
function buildActivities(programs, kids) {
  return programs.map((p) => {
    const kidNames = (p.kidIds || [])
      .map((id) => kids.find((k) => k.id === id)?.name)
      .filter(Boolean);
    return {
      id: p.id,
      name: p.name || "Untitled Program",
      provider: p.provider || "",
      detail: [p.days, p.times].filter(Boolean).join(" \u00B7 ") || "",
      child: kidNames.join(", ") || "",
    };
  });
}

/* ─── Main CirclesTab (manages sub-screen navigation) ─── */
export default function CirclesTab({ programs = [], kids = [], profile = {}, showToast }) {
  const [screen, setScreen] = useState("home"); // home | feed | invite
  const [activeCircle, setActiveCircle] = useState(null);
  const [showShareSheet, setShowShareSheet] = useState(false);

  // No circles exist yet — will come from Supabase when the backend is built
  const circles = [];
  const feed = [];

  const activities = buildActivities(programs, kids);

  const openCircle = (circle) => {
    setActiveCircle(circle);
    setScreen("feed");
  };

  if (screen === "invite") {
    return <InviteScreen onBack={() => setScreen("home")} showToast={showToast} />;
  }

  if (screen === "feed" && activeCircle) {
    return (
      <>
        <CircleFeed
          circle={activeCircle}
          feed={feed}
          onBack={() => { setScreen("home"); setActiveCircle(null); }}
          onOpenShare={() => setShowShareSheet(true)}
        />
        {showShareSheet && (
          <ShareSheet
            circle={activeCircle}
            activities={activities}
            onClose={() => setShowShareSheet(false)}
            showToast={showToast}
          />
        )}
      </>
    );
  }

  return (
    <CirclesHome
      circles={circles}
      onOpenCircle={openCircle}
      onOpenInvite={() => setScreen("invite")}
      showToast={showToast}
    />
  );
}
