import { C, STATUS_MAP, CAT_EMOJI } from "../constants/brand";
import { s } from "../styles/shared";
import { fmt$, fmtShortDate } from "../utils/helpers";
import { computeEligibility, getEligibilityLabel } from "../utils/ageEligibility";

/** Status -> left border color */
const STATUS_BORDER = {
  Enrolled: C.seaGreen,
  Waitlist: C.olive,
  Exploring: C.blue,
};

export default function ProgramCard({ p, kids, onTap, onStatusTap, currentUserId, selectedKid }) {
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

  const hasEarlyBird = p.earlyBirdCost != null && p.earlyBirdDeadline;
  const earlyBirdActive = hasEarlyBird && new Date(p.earlyBirdDeadline) >= new Date();

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
          marginBottom: 1,
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
          <span style={{ fontSize: 9, opacity: 0.55, marginLeft: 3, lineHeight: 1 }}>▾</span>
        </button>
      </div>

      {/* Name + provider */}
      <div style={s.cardName}>{p.name}</div>
      <div style={s.cardProvider}>
        {p.provider}
        {p.addedByName && p.addedBy && currentUserId && p.addedBy !== currentUserId && (
          <span style={{ color: C.blue, fontSize: 12, marginLeft: 6 }}>
            · Added by {p.addedByName}
          </span>
        )}
      </div>
      {p.activityType && p.activityType !== p.category && (
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 12,
          color: C.muted,
          marginTop: 1,
        }}>
          {p.activityType}
        </div>
      )}

      {/* Info badges row: date range, age, season type, early bird, indoor/outdoor */}
      {(dateRange || ageLabel || p.seasonType || earlyBirdActive || p.indoorOutdoor) && (
        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 6,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {earlyBirdActive && (
            <span style={badgeStyle("#B8860B", "#FFF8E1")}>
              {"\uD83D\uDC26"} Early Bird
            </span>
          )}
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
          {p.dayLength && (
            <span style={badgeStyle(C.seaGreen, "#E8F5EE")}>
              {p.dayLength}
            </span>
          )}
          {p.indoorOutdoor && (
            <span style={badgeStyle(C.muted, "#F2F0EC")}>
              {p.indoorOutdoor === "Indoor" ? "🏠" : p.indoorOutdoor === "Outdoor" ? "🌿" : "🏟️"} {p.indoorOutdoor}
            </span>
          )}
        </div>
      )}

      {/* Borderline age eligibility badge */}
      {selectedKid && selectedKid.birthMonth && selectedKid.birthYear && (() => {
        const startDate = p.startDate || new Date().toISOString().split("T")[0];
        const result = computeEligibility(selectedKid.birthMonth, selectedKid.birthYear, p.ageMin, p.ageMax, startDate);
        if (result.eligibilityTier === "borderline") {
          const label = getEligibilityLabel(selectedKid.name, selectedKid.birthMonth, selectedKid.birthYear, p.ageMin, p.ageMax, startDate);
          return (
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#F4A261",
                background: "rgba(244, 162, 97, 0.10)",
                borderRadius: 6,
                padding: "3px 8px",
                marginTop: 6,
                display: "inline-block",
              }}
            >
              {label}
            </div>
          );
        }
        return null;
      })()}

      {/* Location */}
      {locationText && (
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            color: C.muted,
            marginTop: 5,
          }}
        >
          {"\uD83D\uDCCD"} {locationText}
        </div>
      )}

      {/* Spots remaining urgency */}
      {p.spotsRemaining && (
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: "#C0392B",
          background: "rgba(192, 57, 43, 0.08)",
          borderRadius: 6,
          padding: "3px 8px",
          marginTop: 6,
          display: "inline-block",
        }}>
          ⚡ {p.spotsRemaining}
        </div>
      )}

      {/* Bottom row: days/times + cost + register link */}
      <div style={s.cardBottom}>
        <span style={s.cardMeta}>
          {p.days && p.startTime
            ? `${p.days} · ${p.startTime}–${p.endTime || ""}`
            : p.times || "\u2014"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            {earlyBirdActive && (
              <span style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: C.seaGreen,
                background: "#E8F5EE",
                padding: "2px 6px",
                borderRadius: 4,
                marginBottom: 2,
              }}>
                Early bird until {fmtShortDate(p.earlyBirdDeadline)}
              </span>
            )}
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 16,
                color: C.ink,
              }}
            >
              {earlyBirdActive
                ? fmt$(p.earlyBirdCost)
                : p.priceVerified === false ? `~${fmt$(p.cost)}` : fmt$(p.cost)
              }
              {p.costPer && (
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginLeft: 2 }}>
                  /{p.costPer}
                </span>
              )}
            </span>
            {earlyBirdActive && p.cost > 0 && (
              <span style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 11,
                color: C.muted,
                textDecoration: "line-through",
              }}>
                {fmt$(p.cost)}
              </span>
            )}
            {p.costNote && (
              <span style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                color: C.muted,
                fontStyle: "italic",
              }}>
                {p.costNote}
              </span>
            )}
          </div>
          {p.registrationUrl && (
            <a
              href={p.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Register for ${p.name}`}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: C.seaGreen,
                textDecoration: "none",
                background: "#E8F5EE",
                borderRadius: 6,
                padding: "8px 12px",
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
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
                fontSize: 12,
                fontWeight: 600,
                color: C.blue,
                background: "#EAF0F6",
                borderRadius: 6,
                padding: "3px 8px",
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
    fontSize: 11,
    fontWeight: 600,
    color,
    background: bg,
    borderRadius: 6,
    padding: "2px 8px",
    whiteSpace: "nowrap",
  };
}
