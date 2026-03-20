import { C, STATUS_MAP, CAT_EMOJI } from "../constants/brand";
import { s } from "../styles/shared";
import { fmt$, fmtShortDate } from "../utils/helpers";

/** Status -> left border color */
const STATUS_BORDER = {
  Enrolled: C.seaGreen,
  Waitlist: C.olive,
  Exploring: C.blue,
};

export default function ProgramCard({ p, kids, onTap, onStatusTap }) {
  const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
  const assignedKids = (p.kidIds || [])
    .map((id) => (kids || []).find((k) => k.id === id))
    .filter(Boolean);

  const borderColor = STATUS_BORDER[p.status] || C.blue;
  const startFmt = fmtShortDate(p.startDate);
  const endFmt = fmtShortDate(p.endDate);
  const dateRange = startFmt && endFmt ? `${startFmt} \u2013 ${endFmt}` : startFmt || endFmt || null;

  const hasAge = p.ageMin != null || p.ageMax != null;
  const ageLabel = hasAge
    ? p.ageMin && p.ageMax
      ? `Ages ${p.ageMin}\u2013${p.ageMax}`
      : p.ageMin
        ? `Ages ${p.ageMin}+`
        : `Up to ${p.ageMax}`
    : null;

  const locationText = p.location || p.neighbourhood || null;

  return (
    <div
      style={{
        ...s.programCard,
        borderLeft: `3px solid ${borderColor}`,
      }}
      onClick={() => onTap && onTap(p)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${p.name}`}
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
      <div style={{ ...s.cardName, fontSize: 16 }}>{p.name}</div>
      <div style={s.cardProvider}>{p.provider}</div>

      {/* Info badges row: date range, age, season type */}
      {(dateRange || ageLabel || p.seasonType) && (
        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 6,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {dateRange && (
            <span style={badgeStyle(C.muted, "#F2F0EC")}>
              {dateRange}
            </span>
          )}
          {ageLabel && (
            <span style={badgeStyle(C.muted, "#F2F0EC")}>
              {ageLabel}
            </span>
          )}
          {p.seasonType && (
            <span style={badgeStyle(C.seaGreen, "#E8F5EE")}>
              {p.seasonType}
            </span>
          )}
        </div>
      )}

      {/* Location */}
      {locationText && (
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 12,
            color: C.muted,
            marginTop: 5,
          }}
        >
          {"\uD83D\uDCCD"} {locationText}
        </div>
      )}

      {/* Bottom row: days/times + cost + register link */}
      <div style={s.cardBottom}>
        <span style={s.cardMeta}>
          {p.days} &middot; {p.times}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 16,
              color: C.ink,
            }}
          >
            {p.priceVerified === false ? `~${fmt$(p.cost)}` : fmt$(p.cost)}
          </span>
          {p.registrationUrl && (
            <a
              href={p.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Register for ${p.name}`}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: C.seaGreen,
                textDecoration: "none",
                background: "#E8F5EE",
                borderRadius: 6,
                padding: "3px 8px",
              }}
            >
              Register &rarr;
            </a>
          )}
        </div>
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

/** Small muted badge style helper */
function badgeStyle(color, bg) {
  return {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 10,
    fontWeight: 600,
    color,
    background: bg,
    borderRadius: 6,
    padding: "2px 8px",
    whiteSpace: "nowrap",
  };
}
