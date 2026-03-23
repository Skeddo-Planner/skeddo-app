import { useState } from "react";
import { C, CATEGORIES, CAT_EMOJI } from "../constants/brand";
import { s } from "../styles/shared";
import ProgramCard from "../components/ProgramCard";
import EmptyState from "../components/EmptyState";
import KidFilterBar from "../components/KidFilterBar";

export default function ProgramsTab({
  filteredPrograms,
  statusFilter,
  catFilter,
  kids,
  kidFilter,
  onKidFilter,
  onStatusFilter,
  onCatFilter,
  onOpenDetail,
  onCycleStatus,
  onOpenAddProgram,
  searchQuery,
  onSearchQuery,
}) {
  // Split into active (current/upcoming) and past (completed) programs
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activePrograms = filteredPrograms.filter((p) => {
    if (p.status !== "Enrolled") return true; // Waitlist/Exploring are always "active"
    if (!p.endDate) return true; // No end date = still active
    return new Date(p.endDate + "T00:00:00") >= today;
  });

  const pastPrograms = filteredPrograms.filter((p) => {
    if (p.status !== "Enrolled") return false;
    if (!p.endDate) return false;
    return new Date(p.endDate + "T00:00:00") < today;
  });

  const [showPast, setShowPast] = useState(false);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2 style={s.pageTitle}>My Programs</h2>
        <button
          className="chip-btn"
          style={s.addButton}
          onClick={onOpenAddProgram}
          aria-label="Add a new program"
        >
          + Add
        </button>
      </div>

      {/* Kid filter */}
      <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />

      {/* Search input */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14,
            color: C.muted,
            pointerEvents: "none",
          }}
        >
          {"\uD83D\uDD0D"}
        </span>
        <input
          style={{
            ...s.input,
            paddingLeft: 34,
            fontSize: 14,
            marginBottom: 0,
          }}
          type="text"
          placeholder="Search my programs..."
          value={searchQuery || ""}
          onChange={(e) => onSearchQuery && onSearchQuery(e.target.value)}
        />
      </div>

      {/* Status filter chips */}
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        {["All", "Enrolled", "Waitlist", "Exploring"].map((st) => (
          <button
            key={st}
            className="chip-btn"
            onClick={() => onStatusFilter(st)}
            aria-label={`Filter by status: ${st}`}
            aria-pressed={statusFilter === st}
            style={{
              ...s.filterChip,
              background: statusFilter === st ? C.ink : "transparent",
              color: statusFilter === st ? C.cream : C.ink,
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Active programs */}
      {activePrograms.length === 0 && pastPrograms.length === 0 && (
        <EmptyState icon={"\uD83D\uDD0D"} message="No programs match your filters." />
      )}
      {activePrograms.length === 0 && pastPrograms.length > 0 && (
        <EmptyState icon={"\u2600\uFE0F"} message="No upcoming programs. Check your past programs below." />
      )}
      {activePrograms.map((p) => (
        <ProgramCard
          key={p.id}
          p={p}
          kids={kids}
          onTap={() => onOpenDetail(p)}
          onStatusTap={() => onCycleStatus(p.id)}
        />
      ))}

      {/* Past programs — collapsible section */}
      {pastPrograms.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => setShowPast(!showPast)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "12px 0",
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{"\uD83D\uDCCB"}</span>
              <span style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: C.muted,
              }}>
                Past Programs ({pastPrograms.length})
              </span>
            </div>
            <span style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 14,
              color: C.muted,
              transform: showPast ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}>
              ▼
            </span>
          </button>

          {showPast && (
            <div style={{ opacity: 0.75 }}>
              <p style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 14,
                color: C.muted,
                marginBottom: 12,
                lineHeight: 1.5,
              }}>
                These programs have ended. They're kept here for your reference.
              </p>
              {pastPrograms.map((p) => (
                <ProgramCard
                  key={p.id}
                  p={p}
                  kids={kids}
                  onTap={() => onOpenDetail(p)}
                  onStatusTap={() => onCycleStatus(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
