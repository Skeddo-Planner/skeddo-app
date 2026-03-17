import { C, STATUS_MAP, CAT_EMOJI } from "../constants/brand";
import { s } from "../styles/shared";
import { fmt$ } from "../hooks/useAppData";

export default function ProgramCard({ p, kids, onTap, onStatusTap }) {
  const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
  const assignedKids = (p.kidIds || [])
    .map((id) => (kids || []).find((k) => k.id === id))
    .filter(Boolean);

  return (
    <div
      style={s.programCard}
      onClick={() => onTap && onTap(p)}
      role="button"
      tabIndex={0}
    >
      {/* Top row: category + status chip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 4,
        }}
      >
        <span style={s.cardCategory}>
          {CAT_EMOJI[p.category] || ""} {p.category}
        </span>
        <button
          style={{
            ...s.statusChip,
            color: st.color,
            background: st.bg,
            border: "none",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onStatusTap && onStatusTap(p.id);
          }}
          aria-label={`Status: ${p.status}. Tap to change.`}
        >
          {st.icon} {p.status}
        </button>
      </div>

      {/* Name + provider */}
      <div style={s.cardName}>{p.name}</div>
      <div style={s.cardProvider}>{p.provider}</div>

      {/* Bottom row: days/times + cost */}
      <div style={s.cardBottom}>
        <span style={s.cardMeta}>
          {p.days} &middot; {p.times}
        </span>
        <span
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 16,
            color: C.ink,
          }}
        >
          {fmt$(p.cost)}
        </span>
      </div>

      {/* Assigned kids */}
      {assignedKids.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          {assignedKids.map((k) => (
            <span
              key={k.id}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: C.blue,
                background: "#EAF0F6",
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              {k.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
