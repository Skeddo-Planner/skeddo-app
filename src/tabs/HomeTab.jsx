import { useState } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import ProgramCard from "../components/ProgramCard";
import EmptyState from "../components/EmptyState";
import DeadlineAlert from "../components/DeadlineAlert";
import { fmt$, TIP_DISMISS_DURATION_MS } from "../utils/helpers";

/* ─── Seasonal Tips ─── */
const SEASONAL_TIPS = [
  {
    text: "Registration for camps typically opens in February — start planning now!",
    months: [1, 2, 3],
  },
  {
    text: "Pro tip: Many camps offer early-bird discounts if you register before March.",
    months: [1, 2, 3],
  },
  {
    text: "Waitlisted? Call the provider directly — spots open up more than you'd think.",
    months: [1, 2, 3, 4, 5, 6],
  },
  {
    text: "Now is the perfect time to compare programs and lock in your favorites.",
    months: [3, 4, 5],
  },
  {
    text: "Don't forget to check cancellation policies before you commit — every provider is different.",
    months: [3, 4, 5, 6],
  },
  {
    text: "Label everything! Sunscreen, water bottle, hat — camp lost-and-found bins fill up fast.",
    months: [5, 6, 7, 8],
  },
  {
    text: "Pack a comfort item for younger kids on their first day — it makes drop-off so much easier.",
    months: [5, 6, 7, 8],
  },
  {
    text: "Ask your child what they liked best each day — it helps you pick even better programs next year.",
    months: [6, 7, 8],
  },
  {
    text: "Fall programs and after-school activities often open registration in August. Stay ahead!",
    months: [7, 8, 9],
  },
  {
    text: "Pro-D day camps book up fast in Vancouver — add reminders a month ahead to snag a spot.",
    months: [9, 10, 11, 12],
  },
];

function getSeasonalTips() {
  const month = new Date().getMonth() + 1; // 1-12
  const relevant = SEASONAL_TIPS.filter((t) => t.months.includes(month));
  // If somehow no tips match the current month, return all tips
  return relevant.length > 0 ? relevant : SEASONAL_TIPS;
}

/* ─── "Coming Up" helper ─── */
function getUpcomingPrograms(allPrograms) {
  const now = new Date();
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  return allPrograms
    .filter((p) => {
      if (!p.startDate) return false;
      const start = new Date(p.startDate);
      return start >= now && start <= twoWeeks;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
}

function formatUpcomingDate(dateStr) {
  const d = new Date(dateStr);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `Starts ${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

/* ─── Seasonal greeting ─── */
function getSeasonalGreeting() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return { icon: "\ud83c\udf31", season: "spring" };
  if (month >= 6 && month <= 8) return { icon: "\u2600\ufe0f", season: "summer" };
  if (month >= 9 && month <= 11) return { icon: "\ud83c\udf42", season: "fall" };
  return { icon: "\u2744\ufe0f", season: "winter" };
}

/* ─── Status chip colors (inline) ─── */
const STATUS_COLORS = {
  Enrolled: { color: C.seaGreen, bg: "#E8F5EE" },
  Waitlist: { color: C.olive, bg: "#FBF6E6" },
  Exploring: { color: C.blue, bg: "#EAF0F6" },
};

export default function HomeTab({
  enrolledPrograms,
  waitlistPrograms,
  exploringPrograms,
  totalCostEnrolled,
  kids,
  onOpenDetail,
  onCycleStatus,
  onNavigateToTab,
  onOpenAddProgram,
  onOpenAddKid,
  onEditKid,
}) {
  const [tipIndex, setTipIndex] = useState(0);
  const [tipDismissed, setTipDismissed] = useState(() => {
    try {
      const stored = localStorage.getItem("skeddo_tip_dismissed");
      if (!stored) return false;
      const { date } = JSON.parse(stored);
      // Reset after 24 hours so tips cycle daily
      return date && (Date.now() - date) < TIP_DISMISS_DURATION_MS;
    } catch { return false; }
  });

  const tips = getSeasonalTips();
  const currentTip = tips[tipIndex % tips.length];

  const allPrograms = [...enrolledPrograms, ...waitlistPrograms, ...exploringPrograms];
  const totalPrograms = allPrograms.length;
  const upcomingPrograms = getUpcomingPrograms(allPrograms);
  const { icon: seasonIcon, season } = getSeasonalGreeting();
  const hasPrograms = totalPrograms > 0;

  return (
    <div>
      {/* Quick action cards */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          onClick={onOpenAddProgram}
          style={{
            flex: 1,
            background: C.white,
            border: `1.5px solid ${C.border}`,
            borderRadius: 14,
            padding: "14px 16px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.15s",
          }}
          className="skeddo-card"
        >
          <div style={{ fontSize: 22, marginBottom: 4 }}>+</div>
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: C.ink,
            }}
          >
            Add a program
          </div>
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11,
              color: C.muted,
              marginTop: 2,
            }}
          >
            Track camps & classes
          </div>
        </button>
        <button
          onClick={onOpenAddKid}
          style={{
            flex: 1,
            background: C.white,
            border: `1.5px solid ${C.border}`,
            borderRadius: 14,
            padding: "14px 16px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.15s",
          }}
          className="skeddo-card"
        >
          <div style={{ fontSize: 22, marginBottom: 4 }}>+</div>
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: C.ink,
            }}
          >
            Add a kid
          </div>
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11,
              color: C.muted,
              marginTop: 2,
            }}
          >
            Assign programs
          </div>
        </button>
      </div>

      {/* Welcome card — context-aware */}
      <div style={s.welcomeCard}>
        <h2 style={s.welcomeTitle}>
          {hasPrograms ? (
            <>
              {seasonIcon} You're on{" "}
              <em style={{ color: C.olive, fontStyle: "italic" }}>track.</em>
            </>
          ) : (
            <>
              One app.{" "}
              <em style={{ color: C.olive, fontStyle: "italic" }}>Zero chaos.</em>
            </>
          )}
        </h2>
        <p style={s.welcomeBody}>
          {hasPrograms ? (
            <>
              You have{" "}
              <strong style={{ color: C.ink }}>
                {enrolledPrograms.length} program
                {enrolledPrograms.length !== 1 ? "s" : ""}
              </strong>{" "}
              lined up for {season}
              {waitlistPrograms.length > 0 && (
                <>
                  , <strong style={{ color: C.ink }}>{waitlistPrograms.length}</strong> on
                  the waitlist
                </>
              )}
              {exploringPrograms.length > 0 && (
                <>
                  , and <strong style={{ color: C.ink }}>{exploringPrograms.length}</strong>{" "}
                  you're still exploring
                </>
              )}
              . You've got this!
            </>
          ) : (
            <>
              Planning starts here. Browse real Vancouver programs, save
              your favorites, and keep everything organized in one place.
            </>
          )}
        </p>
        {!hasPrograms && (
          <button
            onClick={() => onNavigateToTab("discover")}
            style={{
              ...s.primaryBtn,
              marginTop: 12,
              display: "inline-block",
              flex: "none",
              padding: "10px 20px",
              fontSize: 13,
            }}
          >
            Browse Programs
          </button>
        )}
      </div>

      {/* Seasonal Tip Card */}
      {!tipDismissed && (
        <div
          style={{
            background: C.white,
            borderRadius: 14,
            padding: "16px 18px",
            marginBottom: 16,
            border: `1px solid ${C.border}`,
            borderLeft: `4px solid ${C.olive}`,
            position: "relative",
          }}
        >
          {/* Dismiss button */}
          <button
            onClick={() => {
              setTipDismissed(true);
              try { localStorage.setItem("skeddo_tip_dismissed", JSON.stringify({ date: Date.now() })); } catch {}
            }}
            style={{
              position: "absolute",
              top: 10,
              right: 12,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              color: C.muted,
              lineHeight: 1,
              padding: 4,
            }}
            aria-label="Dismiss tip"
          >
            &times;
          </button>
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: C.olive,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Tip
          </div>
          <p
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 15,
              fontStyle: "italic",
              color: C.ink,
              lineHeight: 1.5,
              margin: 0,
              paddingRight: 16,
            }}
          >
            {currentTip.text}
          </p>
          {tips.length > 1 && (
            <button
              onClick={() => setTipIndex((i) => i + 1)}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: C.seaGreen,
                background: "none",
                border: "none",
                cursor: "pointer",
                marginTop: 10,
                padding: 0,
              }}
            >
              Next tip &rarr;
            </button>
          )}
        </div>
      )}

      {/* Stats grid */}
      <div style={s.statsGrid}>
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.seaGreen}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("programs", "Enrolled")}
          className="skeddo-card"
        >
          <div style={s.statNum}>{enrolledPrograms.length}</div>
          <div style={s.statLabel}>ENROLLED</div>
        </div>
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.olive}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("programs", "Waitlist")}
          className="skeddo-card"
        >
          <div style={s.statNum}>{waitlistPrograms.length}</div>
          <div style={s.statLabel}>WAITLIST</div>
        </div>
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.blue}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("programs", "Exploring")}
          className="skeddo-card"
        >
          <div style={s.statNum}>{exploringPrograms.length}</div>
          <div style={s.statLabel}>EXPLORING</div>
        </div>
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.lilac}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("budget")}
          className="skeddo-card"
        >
          <div style={s.statNum}>{fmt$(totalCostEnrolled)}</div>
          <div style={s.statLabel}>COMMITTED</div>
        </div>
      </div>

      {/* Deadline alerts — programs starting within 7 days */}
      <DeadlineAlert
        programs={allPrograms}
        daysThreshold={7}
        onOpenDetail={onOpenDetail}
      />

      {/* Coming Up — programs starting within 14 days */}
      {upcomingPrograms.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Coming Up</h3>
          </div>
          {upcomingPrograms.map((p) => {
            const sc = STATUS_COLORS[p.status] || STATUS_COLORS.Exploring;
            return (
              <div
                key={p.id}
                className="skeddo-card"
                onClick={() => onOpenDetail(p)}
                style={{
                  background: C.white,
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 8,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: C.ink,
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 12,
                      color: C.muted,
                      marginTop: 2,
                    }}
                  >
                    {formatUpcomingDate(p.startDate)}
                  </div>
                </div>
                <span
                  style={{
                    ...s.statusChip,
                    color: sc.color,
                    background: sc.bg,
                    marginLeft: 10,
                    flexShrink: 0,
                  }}
                >
                  {p.status}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Enrolled Programs */}
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>Enrolled Programs</h3>
        <button
          style={s.seeAll}
          onClick={() => onNavigateToTab("programs", "Enrolled")}
        >
          See all &rarr;
        </button>
      </div>
      {enrolledPrograms.length === 0 && (
        <EmptyState icon={"\u2600\uFE0F"} message="No enrolled programs yet. Start exploring!" />
      )}
      {enrolledPrograms.slice(0, 4).map((p) => (
        <ProgramCard
          key={p.id}
          p={p}
          kids={kids}
          onTap={() => onOpenDetail(p)}
          onStatusTap={() => onCycleStatus(p.id)}
        />
      ))}

      {/* Waitlist */}
      {waitlistPrograms.length > 0 && (
        <>
          <div style={{ ...s.sectionHeader, marginTop: 24 }}>
            <h3 style={s.sectionTitle}>On the Waitlist</h3>
            <button
              style={s.seeAll}
              onClick={() => onNavigateToTab("programs", "Waitlist")}
            >
              See all &rarr;
            </button>
          </div>
          {waitlistPrograms.slice(0, 3).map((p) => (
            <ProgramCard
              key={p.id}
              p={p}
              kids={kids}
              onTap={() => onOpenDetail(p)}
              onStatusTap={() => onCycleStatus(p.id)}
            />
          ))}
        </>
      )}

      {/* Exploring */}
      {exploringPrograms.length > 0 && (
        <>
          <div style={{ ...s.sectionHeader, marginTop: 24 }}>
            <h3 style={s.sectionTitle}>Exploring</h3>
            <button
              style={s.seeAll}
              onClick={() => onNavigateToTab("programs", "Exploring")}
            >
              See all &rarr;
            </button>
          </div>
          {exploringPrograms.slice(0, 2).map((p) => (
            <ProgramCard
              key={p.id}
              p={p}
              kids={kids}
              onTap={() => onOpenDetail(p)}
              onStatusTap={() => onCycleStatus(p.id)}
            />
          ))}
        </>
      )}

      {/* Kids Section */}
      {kids.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Your Kids</h3>
          </div>
          {kids.map((k) => {
            const kidPrograms = (enrolledPrograms || []).filter(
              (p) => (p.kidIds || []).includes(k.id)
            );
            const allKidPrograms = [...enrolledPrograms, ...waitlistPrograms, ...exploringPrograms].filter(
              (p) => (p.kidIds || []).includes(k.id)
            );
            const kidCost = allKidPrograms.reduce((sum, p) => sum + Number(p.cost || 0), 0);
            return (
              <div
                key={k.id}
                style={{
                  ...s.kidCard,
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 0,
                }}
              >
                {/* Top row: avatar + name + edit button */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                  className="skeddo-card"
                  onClick={() => onEditKid && onEditKid(k)}
                >
                  <div style={s.kidAvatar}>{k.name?.[0]?.toUpperCase() || "?"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={s.kidName}>{k.name}</div>
                    {k.age && <div style={s.kidAge}>Age {k.age}</div>}
                    <div style={s.kidMeta}>
                      {kidPrograms.length} enrolled · {allKidPrograms.length} total · {fmt$(kidCost)}
                    </div>
                  </div>
                  <div style={{ color: C.muted, fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}>Edit</div>
                </div>
                {/* Quick nav buttons */}
                {allKidPrograms.length > 0 && (
                  <div style={{
                    display: "flex",
                    gap: 6,
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: `1px solid ${C.border}`,
                  }}>
                    {[
                      { label: "Schedule", icon: "\uD83D\uDCC5", tab: "schedule" },
                      { label: "Programs", icon: "\u25A6", tab: "programs" },
                      { label: "Budget", icon: "$", tab: "budget" },
                    ].map(({ label, icon, tab: t }) => (
                      <button
                        key={t}
                        onClick={() => onNavigateToTab(t, null, k.id)}
                        style={{
                          flex: 1,
                          fontFamily: "'Barlow', sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.seaGreen,
                          background: `${C.seaGreen}0A`,
                          border: `1px solid ${C.seaGreen}20`,
                          borderRadius: 8,
                          padding: "7px 6px",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.12s",
                        }}
                        className="chip-btn"
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
