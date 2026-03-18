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
            style={{
              ...s.filterChip,
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              flexShrink: 0,
              background: isActive
                ? `linear-gradient(135deg, ${C.seaGreen}, ${C.blue})`
                : "transparent",
              color: isActive ? C.cream : C.ink,
              borderColor: isActive ? C.seaGreen : C.border,
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
                  : `linear-gradient(135deg, ${C.seaGreen}, ${C.blue})`,
                color: C.cream,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Instrument Serif', serif",
                fontSize: 11,
                fontWeight: 400,
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
