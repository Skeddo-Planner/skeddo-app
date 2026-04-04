import { C, STATUS_MAP, CAT_EMOJI } from "../constants/brand";
import { fmt$, fmtShortDate } from "../utils/helpers";
import { computeEligibility, getEligibilityLabel } from "../utils/ageEligibility";

/** Category -> accent color (matching DirectoryCard style) */
const CAT_ACCENT = {
  "Sports": C.seaGreen,
  "Arts": C.olive,
  "STEM": C.blue,
  "Music": C.lilac,
  "Outdoor": C.seaGreen,
  "Life Skills": C.olive,
  "Academic": C.blue,
  "Cultural": C.lilac,
  "Language": C.blue,
  "Faith-Based": C.lilac,
};

export default function ProgramCard({ p, kids, onTap, onStatusTap, currentUserId, selectedKid }) {
  const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
  const assignedKids = (p.kidIds || [])
    .map((id) => (kids || []).find((k) => k.id === id))
    .filter(Boolean);

  const accent = CAT_ACCENT[p.category] || C.seaGreen;
  const startFmt = fmtShortDate(p.startDate);
  const endFmt = fmtShortDate(p.endDate);
  const dateRange = startFmt && endFmt ? `${startFmt} \u2013 ${endFmt}` : startFmt || endFmt || null;

  const hasAge = p.ageMin != null || p.ageMax != null;
  const ageLabel = hasAge
    ? p.ageMin != null && p.ageMax != null
      ? `Ages ${p.ageMin}\u2013${p.ageMax}`
      : p.ageMin != null
        ? `Ages ${p.ageMin}+`
        : `Up to ${p.ageMax}`
    : null;

  const locationText = p.location || p.neighbourhood || null;

  const hasEarlyBird = p.earlyBirdCost != null && p.earlyBirdDeadline;
  const earlyBirdActive = hasEarlyBird && new Date(p.earlyBirdDeadline) >= new Date();

  return (
    <div
      className="skeddo-card"
      style={{
        background: C.white,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 10,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${accent}`,
        cursor: "pointer",
        position: "relative",
        transition: "box-shadow 0.2s, transform 0.15s",
      }}
      onClick={() => onTap && onTap(p)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${p.name}`}
    >
      {/* Category header */}
      <div style={{
        fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
        color: accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4,
      }}>
        {CAT_EMOJI[p.category] || ""} {p.category}
      </div>

      {/* Name + provider + status */}
      <div style={{ paddingRight: 8 }}>
        <div style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 700,
          color: C.ink, lineHeight: 1.3, marginBottom: 2,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>{p.name}</div>
        <div style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted,
          marginBottom: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
        }}>
          <span>{p.provider}</span>
          {p.addedByName && p.addedBy && currentUserId && p.addedBy !== currentUserId && (
            <span style={{ fontSize: 11, fontWeight: 700, background: C.blue + "18", color: C.blue, padding: "2px 8px", borderRadius: 10 }}>
              Added by {p.addedByName}
            </span>
          )}
          <button
            style={{
              fontSize: 11, fontWeight: 700,
              background: st.bg, color: st.color,
              padding: "2px 8px", borderRadius: 10,
              border: "none", cursor: "pointer",
              fontFamily: "'Barlow', sans-serif",
              whiteSpace: "nowrap",
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
      </div>

      {/* Schedule info */}
      {(dateRange || (p.days && p.startTime)) && (
        <div style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginTop: 6,
        }}>
          {dateRange}
          {p.days && p.startTime && (
            <span> · {p.days} · {p.startTime}–{p.endTime || ""}</span>
          )}
          {!p.days && p.times && <span> · {p.times}</span>}
        </div>
      )}

      {/* Borderline age eligibility badge */}
      {selectedKid && selectedKid.birthMonth && selectedKid.birthYear && (() => {
        const startDate = p.startDate || new Date().toISOString().split("T")[0];
        const result = computeEligibility(selectedKid.birthMonth, selectedKid.birthYear, p.ageMin, p.ageMax, startDate);
        if (result.eligibilityTier === "borderline") {
          const label = getEligibilityLabel(selectedKid.name, selectedKid.birthMonth, selectedKid.birthYear, p.ageMin, p.ageMax, startDate);
          return (
            <div style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
              color: "#F4A261", background: "rgba(244, 162, 97, 0.10)",
              borderRadius: 10, padding: "2px 8px", marginTop: 6, display: "inline-block",
            }}>
              {label}
            </div>
          );
        }
        return null;
      })()}

      {/* Spots remaining urgency */}
      {p.spotsRemaining && (
        <div style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
          color: "#C0392B", background: "rgba(192, 57, 43, 0.08)",
          borderRadius: 10, padding: "2px 8px", marginTop: 6, display: "inline-block",
        }}>
          ⚡ {p.spotsRemaining}
        </div>
      )}

      {/* Bottom row: badges + price */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", flex: 1 }}>
          {earlyBirdActive && (
            <span style={pillStyle(C.olive + "18", C.olive)}>
              {"\uD83D\uDC26"} Early Bird until {fmtShortDate(p.earlyBirdDeadline)}
            </span>
          )}
          {ageLabel && (
            <span style={pillStyle(C.blue + "14", C.blue)}>
              {ageLabel}
            </span>
          )}
          {locationText && (
            <span style={pillStyle("rgba(27,36,50,0.05)", C.blue)}>
              {locationText}
            </span>
          )}
          {p.seasonType && (
            <span style={pillStyle(C.seaGreen + "18", C.seaGreen)}>
              {p.seasonType}
            </span>
          )}
          {p.dayLength && (
            <span style={pillStyle(C.seaGreen + "18", C.seaGreen)}>
              {p.dayLength}
            </span>
          )}
          {p.indoorOutdoor && (
            <span style={pillStyle("rgba(27,36,50,0.05)", C.muted)}>
              {p.indoorOutdoor === "Indoor" ? "🏠" : p.indoorOutdoor === "Outdoor" ? "🌿" : "🏟️"} {p.indoorOutdoor}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginLeft: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{
              fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700,
              color: C.ink, whiteSpace: "nowrap",
            }}>
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
                fontFamily: "'Barlow', sans-serif", fontSize: 11,
                color: C.muted, textDecoration: "line-through",
              }}>
                {fmt$(p.cost)}
              </span>
            )}
            {p.costNote && (
              <span style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 10,
                color: C.muted, fontStyle: "italic",
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
                fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
                color: C.seaGreen, textDecoration: "none",
                background: "#E8F5EE", borderRadius: 6,
                padding: "8px 12px", minHeight: 44,
                display: "inline-flex", alignItems: "center",
              }}
            >
              Register &rarr;
            </a>
          )}
        </div>
      </div>

      {/* Assigned kids */}
      {assignedKids.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {assignedKids.map((k) => (
            <span
              key={k.id}
              style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
                color: C.blue, background: "#EAF0F6",
                borderRadius: 10, padding: "2px 8px",
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

/** Pill badge style helper (matching DirectoryCard) */
function pillStyle(bg, color) {
  return {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    color,
    background: bg,
    borderRadius: 10,
    padding: "2px 8px",
    whiteSpace: "nowrap",
  };
}
