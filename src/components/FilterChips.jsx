import { C } from "../constants/brand";
import { s } from "../styles/shared";

export default function FilterChips({ options, selected, onSelect, color }) {
  const activeColor = color || C.ink;

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 4,
        marginBottom: 12,
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}
    >
      {options.map((opt) => {
        const active = selected === opt;
        return (
          <button
            key={opt}
            style={{
              ...s.filterChip,
              color: active ? C.cream : C.muted,
              background: active ? activeColor : "transparent",
              borderColor: active ? activeColor : C.border,
              flexShrink: 0,
            }}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
