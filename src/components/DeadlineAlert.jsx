import { useState } from "react";
import { C } from "../constants/brand";

/**
 * Shows alerts for programs starting within `daysThreshold` days.
 * Each banner shows the program name, which kid it's for, and how soon it starts.
 * Users can dismiss individual alerts for the session.
 */
export default function DeadlineAlert({ programs = [], kids = [], daysThreshold = 5, onOpenDetail }) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const [dismissedIds, setDismissedIds] = useState(new Set());

  const upcoming = programs
    .filter((p) => {
      if (!p.startDate) return false;
      const start = new Date(p.startDate + "T00:00:00");
      if (isNaN(start)) return false;
      const diffDays = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= daysThreshold;
    })
    .map((p) => {
      const start = new Date(p.startDate + "T00:00:00");
      const daysLeft = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
      // Find assigned kid names
      const kidNames = (p.kidIds || [])
        .map((id) => (kids || []).find((k) => k.id === id))
        .filter(Boolean)
        .map((k) => k.name);
      return { ...p, _daysLeft: daysLeft, _kidNames: kidNames };
    })
    .sort((a, b) => a._daysLeft - b._daysLeft)
    .filter((p) => !dismissedIds.has(p.id));

  if (upcoming.length === 0) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      {upcoming.map((p) => {
        const timeLabel =
          p._daysLeft === 0
            ? "starts today!"
            : p._daysLeft === 1
              ? "starts tomorrow!"
              : `starts in ${p._daysLeft} days`;

        const kidLabel = p._kidNames.length > 0
          ? ` for ${p._kidNames.join(" & ")}`
          : "";

        return (
          <div
            key={p.id}
            style={{
              background: "#FBF6E6",
              border: `1px solid ${C.olive}33`,
              borderRadius: 12,
              padding: "10px 14px",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
              position: "relative",
            }}
          >
            <span
              role="button"
              tabIndex={0}
              onClick={() => onOpenDetail && onOpenDetail(p)}
              style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, cursor: "pointer" }}
            >
              <span style={{ fontSize: 15, flexShrink: 0 }}>{"\u26A1"}</span>
              <span
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.ink,
                  lineHeight: 1.3,
                }}
              >
                <strong>{p.name}</strong>{kidLabel} {timeLabel}
              </span>
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setDismissedIds((prev) => new Set(prev).add(p.id)); }}
              aria-label={`Dismiss alert for ${p.name}`}
              style={{
                background: "none",
                border: "none",
                color: C.muted,
                fontSize: 18,
                cursor: "pointer",
                padding: "0 4px",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {"\u00D7"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
