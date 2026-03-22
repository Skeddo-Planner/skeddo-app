import { C } from "../constants/brand";

const F = "'Barlow', sans-serif";

export default function FilterOptions({ options, selected, onToggle, locked }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const on = selected.has ? selected.has(opt.id) : Array.isArray(selected) ? selected.includes(opt.id) : false;
        return (
          <button
            key={opt.id}
            onClick={() => {
              if (locked) return;
              onToggle(opt.id);
            }}
            style={{
              padding: "10px 16px", borderRadius: 10,
              border: on ? `1.5px solid ${C.ink}` : "1.5px solid rgba(27,36,50,0.12)",
              background: on ? C.ink : "#FFF",
              color: on ? "#FFF" : C.ink,
              fontFamily: F, fontSize: 14, fontWeight: on ? 600 : 400,
              cursor: locked ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              opacity: locked ? 0.5 : 1,
              minHeight: 44,
            }}
          >
            {opt.icon && <span style={{ marginRight: 5 }}>{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
