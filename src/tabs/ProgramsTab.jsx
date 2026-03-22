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

      {/* Category filter chips */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            className="chip-btn"
            onClick={() => onCatFilter(cat)}
            aria-label={`Filter by category: ${cat}`}
            aria-pressed={catFilter === cat}
            style={{
              ...s.filterChip,
              fontSize: 13,
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
