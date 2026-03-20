import { C } from "../constants/brand";
import { s } from "../styles/shared";

/**
 * Horizontal chip bar for filtering by kid.
 * Shows "All" plus each kid's name with their avatar initial.
 * `kidFilter` is null (all kids) or a kid ID string.
 */
export default function KidFilterBar({ kids, kidFilter, onKidFilter }) {
  if (!kids || kids.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        marginBottom: 12,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        paddingBottom: 2,
      }}
    >
      {/* All chip */}
      <button
        className="chip-btn"
        onClick={() => onKidFilter(null)}
        aria-label="Show programs for all kids"
        aria-pressed={!kidFilter}
        style={{
          ...s.filterChip,
          display: "flex",
          alignItems: "center",
          gap: 6,
          whiteSpace: "nowrap",
          flexShrink: 0,
          background: !kidFilter ? C.ink : "transparent",
          color: !kidFilter ? C.cream : C.ink,
          borderColor: !kidFilter ? C.ink : C.border,
        }}
      >
        All Kids
      </button>

      {kids.map((k) => {
        const isActive = kidFilter === k.id;
        return (
          <button
            key={k.id}
            className="chip-btn"
            onClick={() => onKidFilter(k.id)}
            aria-label={`Show programs for ${k.name}`}
            aria-pressed={isActive}
            style={{
              ...s.filterChip,
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              flexShrink: 0,
              background: isActive
                ? (k.color || C.seaGreen)
                : "transparent",
              color: isActive ? C.cream : C.ink,
              borderColor: isActive ? (k.color || C.seaGreen) : C.border,
            }}
          >
            {/* Mini avatar */}
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                background: isActive
                  ? "rgba(255,255,255,0.25)"
                  : (k.color || C.seaGreen),
                color: C.cream,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Poppins', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {k.name?.[0]?.toUpperCase() || "?"}
            </span>
            {k.name}
          </button>
        );
      })}
    </div>
  );
}
