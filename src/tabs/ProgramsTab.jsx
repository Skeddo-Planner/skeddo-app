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
}) {
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
        >
          + Add
        </button>
      </div>

      {/* Kid filter */}
      <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />

      {/* Status filter chips */}
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        {["All", "Enrolled", "Waitlist", "Exploring"].map((st) => (
          <button
            key={st}
            className="chip-btn"
            onClick={() => onStatusFilter(st)}
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

      {/* Category filter chips */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            className="chip-btn"
            onClick={() => onCatFilter(cat)}
            style={{
              ...s.filterChip,
              fontSize: 12,
              background: catFilter === cat ? C.blue : "transparent",
              color: catFilter === cat ? C.cream : C.muted,
              borderColor: catFilter === cat ? C.blue : C.border,
            }}
          >
            {cat !== "All" && (CAT_EMOJI[cat] || "") + " "}
            {cat}
          </button>
        ))}
      </div>

      {/* Program list */}
      {filteredPrograms.length === 0 && (
        <EmptyState icon={"\uD83D\uDD0D"} message="No programs match your filters." />
      )}
      {filteredPrograms.map((p) => (
        <ProgramCard
          key={p.id}
          p={p}
          kids={kids}
          onTap={() => onOpenDetail(p)}
          onStatusTap={() => onCycleStatus(p.id)}
        />
      ))}
    </div>
  );
}
