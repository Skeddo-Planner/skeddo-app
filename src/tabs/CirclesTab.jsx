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

/* ─── Sample data (will be replaced with Supabase) ─── */
const SAMPLE_CIRCLES = [
  { id: 1, name: "Soccer U8 Parents", members: 12, newCount: 3, color: C.seaGreen, colorSoft: SOFT.seaGreen, emoji: "\u26BD" },
  { id: 2, name: "Maple St Families", members: 6, newCount: 0, color: C.blue, colorSoft: SOFT.blue, emoji: "\uD83C\uDFE1" },
  { id: 3, name: "Piano Studio Friends", members: 4, newCount: 1, color: C.lilac, colorSoft: SOFT.lilac, emoji: "\uD83C\uDFB9" },
];

const SAMPLE_FEED = [
  { id: 1, child: "Liam", parent: "Sarah", activity: "Spring Soccer U8", provider: "Vancouver Youth FC", schedule: "Saturdays \u00B7 10:00 \u2013 11:30 AM", dates: "Apr 12 \u2013 Jun 21", age: "Ages 7\u20138", time: "2h ago", saved: false },
  { id: 2, child: "Anika", parent: "Priya", activity: "Soccer Skills Camp", provider: "Vancouver Youth FC", schedule: "Mon \u2013 Fri \u00B7 9:00 AM \u2013 12:00 PM", dates: "Jul 7 \u2013 Jul 11", age: "Ages 6\u20139", time: "1d ago", saved: true },
  { id: 3, child: "Noah", parent: "Mike", activity: "Spring Soccer U8", provider: "Vancouver Youth FC", schedule: "Saturdays \u00B7 10:00 \u2013 11:30 AM", dates: "Apr 12 \u2013 Jun 21", age: "Ages 7\u20138", time: "2d ago", saved: false },
];

const SAMPLE_ACTIVITIES = [
  { id: 1, name: "Spring Soccer U8", provider: "Vancouver Youth FC", detail: "Saturdays \u00B7 10\u201311:30 AM", child: "Liam", shared: true },
  { id: 2, name: "Piano Lessons", provider: "Harmony Music Academy", detail: "Tuesdays \u00B7 4\u20135 PM", child: "Liam", shared: false },
  { id: 3, name: "Swimming Level 4", provider: "City of Burnaby", detail: "Thursdays \u00B7 3:30\u20134:30 PM", child: "Liam", shared: false },
  { id: 4, name: "Art Explorers Camp", provider: "Burnaby Arts Centre", detail: "Jul 14\u201318 \u00B7 9 AM\u20133 PM", child: "Liam", shared: false },
];

const SAMPLE_PENDING = [
  { id: 1, name: "Jessica R.", time: "3h ago" },
  { id: 2, name: "David L.", time: "1d ago" },
];

const SAMPLE_REFERRALS = [
  { name: "Jessica R.", status: "Joined", sc: C.seaGreen, sb: SOFT.seaGreen },
  { name: "David L.", status: "Joined", sc: C.seaGreen, sb: SOFT.seaGreen },
  { name: "Nadia K.", status: "Pending", sc: C.olive, sb: SOFT.gold },
];

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
function CirclesHome({ onOpenCircle, onOpenInvite }) {
  return (
    <div>
      {/* Header */}
      <div style={{ padding: "20px 20px 10px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: C.ink, margin: 0 }}>Circles</h2>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: C.muted }}>
            {SAMPLE_CIRCLES.length} circle{SAMPLE_CIRCLES.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0", fontFamily: "'Barlow', sans-serif" }}>
          Share schedules with your parent groups
        </p>
      </div>

      {/* Create button */}
      <div style={{ padding: "6px 20px 14px" }}>
        <button style={{
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
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Create a Circle
        </button>
      </div>

      {/* Pending approvals */}
      {SAMPLE_PENDING.length > 0 && (
        <div style={{ padding: "0 20px 12px" }}>
          <div style={{
            background: SOFT.lilac,
            borderRadius: 12,
            padding: "14px 16px",
            border: "1px solid #E8D0DC",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.lilac, fontFamily: "'Barlow', sans-serif" }}>
                {SAMPLE_PENDING.length} pending request{SAMPLE_PENDING.length !== 1 ? "s" : ""}
              </span>
              <span style={{ fontSize: 12, color: C.lilac, fontWeight: 600, cursor: "pointer" }}>Review &rarr;</span>
            </div>
            {SAMPLE_PENDING.map((m, i) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < SAMPLE_PENDING.length - 1 ? 8 : 0 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", background: C.lilac, color: C.cream,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {m.name[0]}
                </div>
                <span style={{ fontSize: 13, color: C.ink, flex: 1, fontFamily: "'Barlow', sans-serif" }}>{m.name}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{
                    padding: "4px 12px", background: C.seaGreen, color: C.cream, border: "none",
                    borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Barlow', sans-serif",
                  }}>Accept</button>
                  <button style={{
                    padding: "4px 10px", background: "transparent", color: C.muted,
                    border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
                  }}>&times;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Circle cards */}
      <div style={{ padding: "0 20px" }}>
        {SAMPLE_CIRCLES.map((c) => (
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
function CircleFeed({ circle, onBack, onOpenShare }) {
  const [saved, setSaved] = useState({ 2: true });
  const [flagged, setFlagged] = useState({});
  const toggle = (id) => setSaved((p) => ({ ...p, [id]: !p[id] }));
  const toggleFlag = (id) => setFlagged((p) => ({ ...p, [id]: !p[id] }));

  const dupCounts = getDuplicateCounts(SAMPLE_FEED);

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
        {circle.members} members &middot; {circle.newCount} new activit{circle.newCount !== 1 ? "ies" : "y"}
      </div>

      <div style={{ padding: "14px 20px" }}>
        {SAMPLE_FEED.map((item) => {
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
                ].map((r, i) => (
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
    </div>
  );
}

/* ─── Screen 3: Share Sheet (bottom-sheet modal) ─── */
function ShareSheet({ circle, onClose }) {
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

        {SAMPLE_ACTIVITIES.map((a) => (
          <div
            key={a.id}
            onClick={() => !a.shared && toggle(a.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              background: C.white, borderRadius: 11, marginBottom: 7,
              border: `1.5px solid ${sel[a.id] ? C.seaGreen : a.shared ? SOFT.seaGreen : C.border}`,
              cursor: a.shared ? "default" : "pointer",
              opacity: a.shared ? 0.55 : 1,
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 5, flexShrink: 0,
              border: `2px solid ${sel[a.id] ? C.seaGreen : a.shared ? C.seaGreen : C.border}`,
              background: sel[a.id] || a.shared ? C.seaGreen : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.cream, fontSize: 12, fontWeight: 700,
            }}>
              {(sel[a.id] || a.shared) && "\u2713"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, fontFamily: "'Barlow', sans-serif" }}>{a.name}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontFamily: "'Barlow', sans-serif" }}>
                {a.provider} &middot; {a.detail}
              </div>
            </div>
            {a.shared && <span style={{ fontSize: 10, color: C.seaGreen, fontWeight: 600 }}>Shared</span>}
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={onClose} style={{ ...s.secondaryBtn, flex: 1 }}>Cancel</button>
          <button
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
function InviteScreen({ onBack }) {
  const [copied, setCopied] = useState(false);

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
              { val: "3", label: "Invited" },
              { val: "2", label: "Joined" },
              { val: "2 mo", label: "Earned", hl: true },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: 22, fontWeight: 700, color: stat.hl ? C.olive : C.cream, fontFamily: "'Poppins', sans-serif" }}>{stat.val}</div>
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
              skeddo.ca/invite/your-code
            </div>
            <button
              onClick={() => setCopied(true)}
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
            <button key={o.l} className="skeddo-card" style={{
              flex: 1, padding: "12px 8px", background: C.white,
              border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
            }}>
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

        {/* Referral list */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10, fontFamily: "'Barlow', sans-serif" }}>Your referrals</div>
          {SAMPLE_REFERRALS.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
              borderBottom: i < SAMPLE_REFERRALS.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: SOFT.blue, color: C.blue,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0, fontFamily: "'Barlow', sans-serif",
              }}>{r.name[0]}</div>
              <span style={{ fontSize: 13, color: C.ink, flex: 1, fontFamily: "'Barlow', sans-serif" }}>{r.name}</span>
              <Tag color={r.sc} bg={r.sb}>{r.status}</Tag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main CirclesTab (manages sub-screen navigation) ─── */
export default function CirclesTab() {
  const [screen, setScreen] = useState("home"); // home | feed | invite
  const [activeCircle, setActiveCircle] = useState(null);
  const [showShareSheet, setShowShareSheet] = useState(false);

  const openCircle = (circle) => {
    setActiveCircle(circle);
    setScreen("feed");
  };

  if (screen === "invite") {
    return <InviteScreen onBack={() => setScreen("home")} />;
  }

  if (screen === "feed" && activeCircle) {
    return (
      <>
        <CircleFeed
          circle={activeCircle}
          onBack={() => { setScreen("home"); setActiveCircle(null); }}
          onOpenShare={() => setShowShareSheet(true)}
        />
        {showShareSheet && (
          <ShareSheet
            circle={activeCircle}
            onClose={() => setShowShareSheet(false)}
          />
        )}
      </>
    );
  }

  return (
    <CirclesHome
      onOpenCircle={openCircle}
      onOpenInvite={() => setScreen("invite")}
    />
  );
}
