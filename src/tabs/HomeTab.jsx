import { useMemo } from "react";
import directoryPrograms from "../data/programs.json";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import ProgramCard from "../components/ProgramCard";
import EmptyState from "../components/EmptyState";
import DeadlineAlert from "../components/DeadlineAlert";
import { fmt$ } from "../utils/helpers";

/* ─── Seasonal greeting ─── */
function getSeasonalGreeting() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return { icon: "\ud83c\udf31", season: "spring" };
  if (month >= 6 && month <= 8) return { icon: "\u2600\ufe0f", season: "summer" };
  if (month >= 9 && month <= 11) return { icon: "\ud83c\udf42", season: "fall" };
  return { icon: "\u2744\ufe0f", season: "winter" };
}


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
  const allPrograms = [...enrolledPrograms, ...waitlistPrograms, ...exploringPrograms];
  const totalPrograms = allPrograms.length;
  const { icon: seasonIcon, season } = getSeasonalGreeting();
  const hasPrograms = totalPrograms > 0;

  // Derive camp types from the user's actual enrolled programs
  const enrolledCampTypes = useMemo(() => {
    const types = new Set();
    enrolledPrograms.forEach((p) => {
      let ct = p.campType;
      // If campType is missing, look it up from directory by name + provider
      if (!ct) {
        const match = directoryPrograms.find(
          (dp) => dp.name === p.name && dp.provider === p.provider
        );
        if (match) ct = match.campType;
      }
      if (ct) types.add(ct.replace(/^day camp$/i, "Day Camp"));
    });
    const arr = [...types].sort();
    if (arr.length === 0) return season;
    if (arr.length === 1) return arr[0].toLowerCase();
    if (arr.length === 2) return `${arr[0]} and ${arr[1]}`.toLowerCase();
    return (arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1]).toLowerCase();
  }, [enrolledPrograms, season]);

  return (
    <div>
      {/* Kids row + Add button inline */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {kids.map((k) => {
          const kidPrograms = (enrolledPrograms || []).filter(
            (p) => (p.kidIds || []).includes(k.id)
          );
          return (
            <div
              key={k.id}
              onClick={() => onEditKid && onEditKid(k)}
              role="button"
              tabIndex={0}
              aria-label={`Edit ${k.name}`}
              className="skeddo-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "8px 12px",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <div style={{ ...s.kidAvatar, width: 32, height: 32, fontSize: 14, borderRadius: 10, background: k.color || s.kidAvatar.background }}>{k.name?.[0]?.toUpperCase() || "?"}</div>
              <div>
                <div style={{ ...s.kidName, fontSize: 13 }}>{k.name}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>{kidPrograms.length} enrolled</div>
              </div>
            </div>
          );
        })}
        <button
          onClick={onOpenAddKid}
          aria-label="Add a new kid"
          className="skeddo-card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: C.white,
            border: `1.5px dashed ${C.border}`,
            borderRadius: 12,
            padding: "8px 14px",
            cursor: "pointer",
            flexShrink: 0,
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: C.seaGreen,
          }}
        >
          + Add kid
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
              lined up for {enrolledCampTypes}
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


      {/* Stats grid */}
      <div style={s.statsGrid}>
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.seaGreen}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("programs", "Enrolled")}
          className="skeddo-card"
          role="button"
          tabIndex={0}
          aria-label={`${enrolledPrograms.length} enrolled programs. Tap to view.`}
        >
          <div style={s.statNum}>{enrolledPrograms.length}</div>
          <div style={s.statLabel}>ENROLLED</div>
        </div>
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.olive}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("programs", "Waitlist")}
          className="skeddo-card"
          role="button"
          tabIndex={0}
          aria-label={`${waitlistPrograms.length} waitlisted programs. Tap to view.`}
        >
          <div style={s.statNum}>{waitlistPrograms.length}</div>
          <div style={s.statLabel}>WAITLIST</div>
        </div>
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.blue}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("programs", "Exploring")}
          className="skeddo-card"
          role="button"
          tabIndex={0}
          aria-label={`${exploringPrograms.length} programs being explored. Tap to view.`}
        >
          <div style={s.statNum}>{exploringPrograms.length}</div>
          <div style={s.statLabel}>EXPLORING</div>
        </div>
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.lilac}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("budget")}
          className="skeddo-card"
          role="button"
          tabIndex={0}
          aria-label={`${fmt$(totalCostEnrolled)} committed. Tap to view budget.`}
        >
          <div style={s.statNum}>{fmt$(totalCostEnrolled)}</div>
          <div style={s.statLabel}>COMMITTED</div>
        </div>
      </div>

      {/* Deadline alerts — programs starting within 5 days, showing kid names */}
      <DeadlineAlert
        programs={allPrograms}
        kids={kids}
        daysThreshold={5}
        onOpenDetail={onOpenDetail}
      />


      {/* Enrolled Programs */}
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>Enrolled Programs</h3>
        <button
          style={s.seeAll}
          onClick={() => onNavigateToTab("programs", "Enrolled")}
          aria-label="See all enrolled programs"
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
              aria-label="See all waitlisted programs"
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
              aria-label="See all programs being explored"
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

    </div>
  );
}
