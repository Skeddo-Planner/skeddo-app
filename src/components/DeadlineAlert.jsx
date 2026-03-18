import { C } from "../constants/brand";

/**
 * Shows alerts for programs starting within `daysThreshold` days.
 * Tapping an alert opens that program's detail view.
 */
export default function DeadlineAlert({ programs = [], daysThreshold = 7, onOpenDetail }) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = programs
    .filter((p) => {
      if (!p.startDate) return false;
      const start = new Date(p.startDate);
      if (isNaN(start)) return false;
      start.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= daysThreshold;
    })
    .map((p) => {
      const start = new Date(p.startDate);
      start.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
      return { ...p, _daysLeft: daysLeft };
    })
    .sort((a, b) => a._daysLeft - b._daysLeft);

  if (upcoming.length === 0) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      {upcoming.map((p) => (
        <div
          key={p.id}
          role="button"
          tabIndex={0}
          onClick={() => onOpenDetail && onOpenDetail(p)}
          style={{
            background: "#FBF6E6",
            border: `1px solid ${C.olive}33`,
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 15, flexShrink: 0 }}>{"\u26A1"}</span>
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: C.ink,
              lineHeight: 1.3,
            }}
          >
            <strong>{p.name}</strong>{" "}
            {p._daysLeft === 0
              ? "starts today!"
              : p._daysLeft === 1
                ? "starts tomorrow!"
                : `starts in ${p._daysLeft} days`}
          </span>
        </div>
      ))}
    </div>
  );
}
