import { C } from "../constants/brand";
import { s } from "../styles/shared";
import ProgramCard from "../components/ProgramCard";
import EmptyState from "../components/EmptyState";

export default function HomeTab({
  enrolledPrograms,
  waitlistPrograms,
  exploringPrograms,
  totalCostEnrolled,
  kids,
  fmt$,
  onOpenDetail,
  onCycleStatus,
  onNavigateToTab,
  onOpenAddProgram,
  onOpenAddKid,
  onEditKid,
}) {
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

      {/* Welcome card */}
      <div style={s.welcomeCard}>
        <h2 style={s.welcomeTitle}>
          One app.{" "}
          <em style={{ color: C.olive, fontStyle: "italic" }}>Zero chaos.</em>
        </h2>
        <p style={s.welcomeBody}>
          {enrolledPrograms.length + waitlistPrograms.length + exploringPrograms.length === 0
            ? "Start by adding your first program or browsing the directory."
            : <>You have <strong>{enrolledPrograms.length}</strong> enrolled program
              {enrolledPrograms.length !== 1 && "s"},{" "}
              <strong>{waitlistPrograms.length}</strong> on waitlist, and{" "}
              <strong>{exploringPrograms.length}</strong> you're exploring.</>
          }
        </p>
      </div>

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
            return (
              <div
                key={k.id}
                className="skeddo-card"
                style={s.kidCard}
                onClick={() => onEditKid && onEditKid(k)}
              >
                <div style={s.kidAvatar}>{k.name?.[0]?.toUpperCase() || "?"}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.kidName}>{k.name}</div>
                  {k.age && <div style={s.kidAge}>Age {k.age}</div>}
                  <div style={s.kidMeta}>
                    {kidPrograms.length} program{kidPrograms.length !== 1 && "s"} enrolled
                  </div>
                </div>
                <div style={{ color: C.muted, fontSize: 18 }}>&rsaquo;</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
