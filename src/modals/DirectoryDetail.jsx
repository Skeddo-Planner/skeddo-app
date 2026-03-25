import { useState } from "react";
import { C, STATUS_MAP, CAT_EMOJI } from "../constants/brand";
import { s } from "../styles/shared";
import Modal from "../components/Modal";
import {
  fmtDate, fmt$,
  REGISTRATION_STATUSES, getRegistrationStatus,
  isMunicipalProvider, downloadICS,
} from "../utils/helpers";
import { computeEligibility, getEligibilityLabel } from "../utils/ageEligibility";
import { trackEvent } from "../utils/analytics";

export default function DirectoryDetail({ program, userPrograms, kids, onAddToSchedule, onClose, selectedKid }) {
  const p = program;
  const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
  const regStatus = getRegistrationStatus(p);
  const regInfo = REGISTRATION_STATUSES.find((s) => s.key === regStatus) || REGISTRATION_STATUSES[0];

  // Check if this program is already in the user's list (match by name + provider)
  const alreadyAdded = (userPrograms || []).some(
    (up) => up.name === p.name && up.provider === p.provider
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [addedKidNames, setAddedKidNames] = useState([]);
  const [copied, setCopied] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Exploring");
  const [selectedKidIds, setSelectedKidIds] = useState([]);
  const [kidError, setKidError] = useState(false);
  const [customCost, setCustomCost] = useState(
    p.cost === "TBD" ? "" : (typeof p.cost === "number" ? String(p.cost) : "")
  );

  // Price is approximate if explicitly flagged or if provider is not verified
  const isApproxPrice = p.priceVerified === false && typeof p.cost === "number" && p.cost > 0;

  const hasEarlyBird = p.earlyBirdCost != null && p.earlyBirdDeadline;
  const earlyBirdActive = hasEarlyBird && new Date(p.earlyBirdDeadline) >= new Date();

  const toggleKid = (kidId) => {
    setKidError(false);
    setSelectedKidIds((prev) =>
      prev.includes(kidId) ? prev.filter((id) => id !== kidId) : [...prev, kidId]
    );
  };

  const [ageWarning, setAgeWarning] = useState(null);

  const doAdd = () => {
    const kidNames = selectedKidIds.map((id) => (kids || []).find((k) => k.id === id)?.name).filter(Boolean);
    setAddedKidNames(kidNames);
    onAddToSchedule({
      ...p,
      cost: customCost !== "" ? Number(customCost) : (p.cost === "TBD" ? 0 : Number(p.cost) || 0),
      status: selectedStatus,
      kidIds: selectedKidIds,
    });
    setShowAddForm(false);
    setJustAdded(true);
    setAgeWarning(null);
  };

  const handleConfirmAdd = () => {
    if (kids && kids.length > 0 && selectedKidIds.length === 0) {
      setKidError(true);
      return;
    }
    setKidError(false);

    // Check age eligibility for each selected kid
    if (p.ageMin != null || p.ageMax != null) {
      const startDate = p.startDate || new Date().toISOString().split("T")[0];
      const ineligibleKids = [];
      selectedKidIds.forEach((kidId) => {
        const kid = (kids || []).find((k) => k.id === kidId);
        if (kid && kid.birthMonth && kid.birthYear) {
          const result = computeEligibility(kid.birthMonth, kid.birthYear, p.ageMin, p.ageMax, startDate);
          if (result.eligibilityTier === "ineligible" || result.eligibilityTier === "borderline") {
            ineligibleKids.push(kid.name);
          }
        }
      });
      if (ineligibleKids.length > 0) {
        setAgeWarning(ineligibleKids);
        return;
      }
    }
    doAdd();
  };

  const shareText = addedKidNames.length > 0
    ? `${addedKidNames.join(" & ")} ${addedKidNames.length > 1 ? "are" : "is"} signed up for ${p.name}! Check it out on Skeddo`
    : `Just added ${p.name} to our summer plan! Check it out on Skeddo`;
  const shareUrl = "https://skeddo.ca";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText + "\n" + shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <Modal onClose={onClose}>
      {/* Category label */}
      <div
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: C.muted,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 2,
        }}
      >
        {CAT_EMOJI[p.category] || ""} {p.category}
      </div>

      {/* Program name with "already added" badge */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
        <h3 style={s.modalTitle}>{p.name}</h3>
        {alreadyAdded && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: C.seaGreen,
              background: STATUS_MAP.Enrolled.bg,
              padding: "3px 8px",
              borderRadius: 8,
              whiteSpace: "nowrap",
              marginTop: 4,
            }}
          >
            &#10003; Added
          </span>
        )}
      </div>

      {/* Provider */}
      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: p.confirmed2026 === false ? 8 : 12 }}>
        {p.provider}
      </div>

      {/* Estimated program warning */}
      {p.confirmed2026 === false && (
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            color: "#8B6914",
            background: "#FFF8E1",
            boxShadow: "inset 0 0 0 1px #F0E0A0",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 12,
            lineHeight: 1.5,
          }}
        >
          <strong>2026 programs not yet released</strong>
          <br />
          Dates, prices, and details shown are estimates based on this provider's prior year offerings. We'll update this listing once 2026 registration opens.
        </div>
      )}

      {/* Registration status banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 10,
          background: regInfo.color + "14",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: regInfo.color,
          }}
        >
          {regInfo.icon} {regInfo.label}
        </span>
        {regStatus === "opening-soon" && p.registrationDateLabel && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: regInfo.color,
            }}
          >
            &mdash; {p.registrationDateLabel}
          </span>
        )}
        {regStatus === "open" && p.registrationDateLabel && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 12,
              fontWeight: 400,
              color: C.muted,
            }}
          >
            (opened {p.registrationDateLabel})
          </span>
        )}
      </div>

      {/* Description */}
      {p.description && (
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            color: C.ink,
            lineHeight: 1.7,
            marginBottom: 16,
          }}
        >
          {p.description}
        </div>
      )}

      {/* Early bird pricing banner */}
      {earlyBirdActive && (
        <div style={{
          background: "#E8F5EE",
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>{"\uD83D\uDC26"}</span>
          <div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.seaGreen }}>
              Early bird: {fmt$(p.earlyBirdCost)}
              {p.cost > 0 && (
                <span style={{ fontWeight: 400, color: C.muted, textDecoration: "line-through", marginLeft: 6 }}>
                  {fmt$(p.cost)}
                </span>
              )}
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>
              Register by {new Date(p.earlyBirdDeadline).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })} to save
            </div>
          </div>
        </div>
      )}

      {/* Before/After care */}
      {(p.beforeCare?.available || p.afterCare?.available) && (
        <div style={{
          background: C.blue + "0A", borderRadius: 10, padding: "10px 14px", marginBottom: 12,
          fontFamily: "'Barlow', sans-serif",
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 6 }}>
            Extended Care Available
          </div>
          {p.beforeCare?.available && (
            <div style={{ fontSize: 14, color: C.ink, marginBottom: 4 }}>
              Before care: {p.beforeCare.time} — ${p.beforeCare.cost}/wk
              {p.beforeCare.costFourDay != null && <span style={{ color: C.muted }}> (${p.beforeCare.costFourDay}/4-day wk)</span>}
            </div>
          )}
          {p.afterCare?.available && (
            <div style={{ fontSize: 14, color: C.ink }}>
              After care: {p.afterCare.time} — ${p.afterCare.cost}/wk
              {p.afterCare.costFourDay != null && <span style={{ color: C.muted }}> (${p.afterCare.costFourDay}/4-day wk)</span>}
            </div>
          )}
        </div>
      )}

      {/* Key info highlights */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        {p.cost != null && (
          <span style={{
            fontFamily: "'Poppins', sans-serif", fontSize: 16,
            color: C.ink, background: C.cream, padding: "4px 12px", borderRadius: 8,
          }}>
            {earlyBirdActive ? fmt$(p.earlyBirdCost) : isApproxPrice ? `~${fmt$(p.cost)}` : fmt$(p.cost)}
          </span>
        )}
        {!earlyBirdActive && isApproxPrice && (
          <span style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 11,
            color: C.muted, fontStyle: "italic",
          }}>
            approx.
          </span>
        )}
        {(p.ageMin != null || p.ageMax != null) && (
          <span style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
            color: C.blue, background: C.blue + "14", padding: "4px 12px", borderRadius: 8,
          }}>
            {p.ageMin != null && p.ageMax != null
              ? <>Ages {p.ageMin}&ndash;{p.ageMax}</>
              : p.ageMin != null
                ? `Ages ${p.ageMin}+`
                : `Up to ${p.ageMax}`}
          </span>
        )}
        {/* Age eligibility status for selected kid */}
        {(() => {
          if (!selectedKid || !selectedKid.birthMonth || !selectedKid.birthYear) {
            if (p.ageMin == null && p.ageMax == null) {
              return (
                <span style={{
                  fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
                  color: "#4A6FA5", padding: "4px 12px", borderRadius: 8,
                  background: "rgba(74, 111, 165, 0.08)",
                }}>
                  Age range not specified — check with provider
                </span>
              );
            }
            return null;
          }
          const startDate = p.startDate || new Date().toISOString().split("T")[0];
          const result = computeEligibility(selectedKid.birthMonth, selectedKid.birthYear, p.ageMin, p.ageMax, startDate);
          if (result.eligibilityTier === null) {
            return (
              <span style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
                color: "#4A6FA5", padding: "4px 12px", borderRadius: 8,
                background: "rgba(74, 111, 165, 0.08)",
              }}>
                Age range not specified — check with provider
              </span>
            );
          }
          const label = getEligibilityLabel(selectedKid.name, selectedKid.birthMonth, selectedKid.birthYear, p.ageMin, p.ageMax, startDate);
          if (result.eligibilityTier === "eligible") {
            return (
              <span style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
                color: "#2D9F6F", padding: "4px 12px", borderRadius: 8,
                background: "rgba(45, 159, 111, 0.10)",
              }}>
                {label}
              </span>
            );
          }
          if (result.eligibilityTier === "borderline") {
            return (
              <span style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
                color: "#F4A261", padding: "4px 12px", borderRadius: 8,
                background: "rgba(244, 162, 97, 0.10)",
              }}>
                {label}
              </span>
            );
          }
          return null;
        })()}
        {(p.seasonType || p.campType) && (
          <span style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
            color: C.olive, background: C.olive + "18", padding: "4px 12px", borderRadius: 8,
          }}>
            {p.seasonType || p.campType}
          </span>
        )}
      </div>

      {/* Detail grid */}
      <div style={s.detailGrid}>
        <div>
          <div style={s.detailLabel}>TIMES{p.confirmed2026 === false ? " (est.)" : ""}</div>
          <div style={{ ...s.detailValue, ...(p.confirmed2026 === false ? { fontStyle: "italic", color: "#B8860B" } : {}) }}>
            {p.startTime && p.endTime ? `${p.startTime}\u2013${p.endTime}` : p.times || "\u2014"}
          </div>
        </div>
        <div>
          <div style={s.detailLabel}>DATES{p.confirmed2026 === false ? " (est.)" : ""}</div>
          <div style={{ ...s.detailValue, ...(p.confirmed2026 === false ? { fontStyle: "italic", color: "#B8860B" } : {}) }}>
            {p.startDate && p.endDate
              ? `${fmtDate(p.startDate)} \u2013 ${fmtDate(p.endDate)}`
              : fmtDate(p.startDate) || "\u2014"}
          </div>
        </div>
        <div>
          <div style={s.detailLabel}>LOCATION</div>
          <div style={s.detailValue}>{p.address || p.location || "\u2014"}</div>
        </div>
        {p.neighbourhood && (
          <div>
            <div style={s.detailLabel}>NEIGHBOURHOOD</div>
            <div style={s.detailValue}>{p.neighbourhood}</div>
          </div>
        )}
      </div>

      {/* Links row — Register + Add to Calendar */}
      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
        {p.registrationUrl && (
          <a
            href={p.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("click_register", { program_name: p.name, provider: p.provider || "", url: p.registrationUrl })}
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: C.seaGreen,
              textDecoration: "none",
            }}
          >
            View registration page &rarr;
          </a>
        )}
        {p.startDate && (
          <button
            onClick={() => downloadICS(p)}
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: C.blue,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            &#128197; Add to Calendar
          </button>
        )}
      </div>

      {/* Add to schedule flow */}
      {!showAddForm ? (
        <button
          style={{
            ...s.primaryBtn,
            width: "100%",
            marginTop: 20,
            padding: "14px 16px",
            fontSize: 15,
            textAlign: "center",
            flex: "none",
          }}
          onClick={() => setShowAddForm(true)}
        >
          {alreadyAdded ? "Add Again" : "Add to My Schedule"}
        </button>
      ) : (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: C.cream,
            borderRadius: 12,
            border: `1px solid ${C.border}`,
          }}
        >
          {/* Program name reminder */}
          <div style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 700,
            color: C.ink, marginBottom: 14, lineHeight: 1.3,
          }}>
            Adding: {p.name}
          </div>

          {/* Status selector */}
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            STATUS
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {["Enrolled", "Waitlist", "Exploring"].map((status) => {
              const stMap = STATUS_MAP[status];
              const selected = selectedStatus === status;
              return (
                <button
                  key={status}
                  className="chip-btn"
                  onClick={() => setSelectedStatus(status)}
                  style={{
                    ...s.filterChip,
                    background: selected ? stMap.bg : "transparent",
                    color: selected ? stMap.color : C.muted,
                    borderColor: selected ? stMap.color : C.border,
                  }}
                >
                  {stMap.icon} {status}
                </button>
              );
            })}
          </div>

          {/* Editable price */}
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            PRICE
            {isApproxPrice && (
              <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontStyle: "italic", marginLeft: 6 }}>
                (approximate — update if you know the exact price)
              </span>
            )}
            {p.cost === "TBD" && (
              <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontStyle: "italic", marginLeft: 6 }}>
                (not yet published — enter price if known)
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: C.ink }}>$</span>
            <input
              type="number"
              min="0"
              step="1"
              value={customCost}
              onChange={(e) => setCustomCost(e.target.value)}
              placeholder={p.cost === "TBD" ? "Enter price" : "0"}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 15,
                color: C.ink,
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                width: 120,
                outline: "none",
              }}
            />
            {customCost !== "" && Number(customCost) !== (typeof p.cost === "number" ? p.cost : 0) && (
              <span style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 11,
                color: C.seaGreen,
                fontWeight: 700,
              }}>
                Updated
              </span>
            )}
          </div>

          {/* Kid assignment */}
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            ASSIGN TO KID
          </div>
          {(kids || []).length > 0 ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {kids.map((k) => {
                const sel = selectedKidIds.includes(k.id);
                return (
                  <button
                    key={k.id}
                    className="chip-btn"
                    onClick={() => toggleKid(k.id)}
                    style={{
                      ...s.filterChip,
                      background: sel ? (k.color || C.seaGreen) : "transparent",
                      color: sel ? "#fff" : C.ink,
                      borderColor: sel ? (k.color || C.seaGreen) : C.border,
                    }}
                  >
                    {k.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted,
              marginBottom: 14, lineHeight: 1.5,
            }}>
              No kids added yet. Add a kid from the Home tab to assign programs.
            </div>
          )}
          {kidError && (
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.danger, marginBottom: 10 }}>
              Please assign this program to at least one child
            </div>
          )}

          {/* Age eligibility warning */}
          {ageWarning && (
            <div style={{
              background: C.dangerBg, borderLeft: `3px solid ${C.danger}`, borderRadius: 8,
              padding: "12px 14px", marginBottom: 12,
            }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.danger, marginBottom: 6 }}>
                {ageWarning.join(" and ")} may not meet the age requirements for this program at the time of the camp.
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.ink, marginBottom: 10 }}>
                Are you sure you want to add this program?
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setAgeWarning(null)}
                  style={{ ...s.secondaryBtn, flex: 1 }}
                >Go Back</button>
                <button
                  onClick={doAdd}
                  style={{ ...s.primaryBtn, flex: 1, background: C.olive }}
                >Add Anyway</button>
              </div>
            </div>
          )}

          {/* Confirm / Cancel */}
          {!ageWarning && (
            <div style={{ display: "flex", gap: 8 }}>
              <button style={s.secondaryBtn} onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button style={s.primaryBtn} onClick={handleConfirmAdd}>
                Confirm
              </button>
            </div>
          )}
        </div>
      )}

      {/* Share buttons after adding */}
      {justAdded && (
        <div style={{
          marginTop: 20, padding: 16, background: "#ECFDF5",
          borderRadius: 12, border: `1px solid ${C.seaGreen}30`, textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 700,
            color: C.seaGreen, marginBottom: 12,
          }}>
            Added! Share with friends?
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {/* WhatsApp */}
            <button onClick={() => {
              trackEvent("share_program", { method: "whatsapp", program_name: p.name });
              window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`, "_blank");
            }} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer", padding: "6px 4px",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "#25D36614", border: "1.5px solid #25D36630",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>WhatsApp</span>
            </button>
            {/* Copy Link */}
            <button onClick={() => {
              trackEvent("share_program", { method: "copy", program_name: p.name });
              handleCopyLink();
            }} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer", padding: "6px 4px",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: C.olive + "14", border: `1.5px solid ${C.olive}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.olive} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
            {/* Text */}
            <button onClick={() => {
              trackEvent("share_program", { method: "text", program_name: p.name });
              window.open(`sms:?body=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
            }} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer", padding: "6px 4px",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: C.blue + "14", border: `1.5px solid ${C.blue}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Text</span>
            </button>
            {/* Email */}
            <button onClick={() => {
              trackEvent("share_program", { method: "email", program_name: p.name });
              window.open(`mailto:?subject=${encodeURIComponent("Check out " + p.name + " on Skeddo")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`, "_blank");
            }} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer", padding: "6px 4px",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: C.lilac + "14", border: `1.5px solid ${C.lilac}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.lilac} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Email</span>
            </button>
          </div>
        </div>
      )}

      {/* Close button (when not in add flow) */}
      {!showAddForm && (
        <button
          style={{ ...s.secondaryBtn, width: "100%", marginTop: 8, flex: "none", textAlign: "center" }}
          onClick={onClose}
        >
          Close
        </button>
      )}
    </Modal>
  );
}
