import { useState } from "react";
import { C, STATUS_MAP, CAT_EMOJI } from "../constants/brand";
import { s } from "../styles/shared";
import Modal from "../components/Modal";
import {
  fmtDate, fmt$,
  REGISTRATION_STATUSES, getRegistrationStatus,
  isMunicipalProvider, downloadICS,
} from "../utils/helpers";

export default function DirectoryDetail({ program, userPrograms, kids, onAddToSchedule, onClose }) {
  const p = program;
  const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
  const regStatus = getRegistrationStatus(p);
  const regInfo = REGISTRATION_STATUSES.find((s) => s.key === regStatus) || REGISTRATION_STATUSES[0];

  // Check if this program is already in the user's list (match by name + provider)
  const alreadyAdded = (userPrograms || []).some(
    (up) => up.name === p.name && up.provider === p.provider
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Exploring");
  const [selectedKidIds, setSelectedKidIds] = useState([]);
  const [customCost, setCustomCost] = useState(
    p.cost === "TBD" ? "" : (typeof p.cost === "number" ? String(p.cost) : "")
  );

  // Price is approximate if explicitly flagged or if provider is not verified
  const isApproxPrice = (p.priceVerified === false || !isMunicipalProvider(p.provider)) && typeof p.cost === "number" && p.cost > 0;

  const toggleKid = (kidId) => {
    setSelectedKidIds((prev) =>
      prev.includes(kidId) ? prev.filter((id) => id !== kidId) : [...prev, kidId]
    );
  };

  const handleConfirmAdd = () => {
    onAddToSchedule({
      ...p,
      cost: customCost !== "" ? Number(customCost) : (p.cost === "TBD" ? 0 : Number(p.cost) || 0),
      status: selectedStatus,
      kidIds: selectedKidIds,
    });
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
              fontSize: 10,
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
      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginBottom: p.confirmed2026 === false ? 8 : 12 }}>
        {p.provider}
      </div>

      {/* Estimated program warning */}
      {p.confirmed2026 === false && (
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 12,
            color: "#8B6914",
            background: "#FFF8E1",
            border: "1px solid #F0E0A0",
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

      {/* Key info highlights */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        {p.cost != null && (
          <span style={{
            fontFamily: "'Poppins', sans-serif", fontSize: 16,
            color: C.ink, background: C.cream, padding: "4px 12px", borderRadius: 8,
          }}>
            {isApproxPrice ? "~" : ""}{fmt$(p.cost)}
          </span>
        )}
        {isApproxPrice && (
          <span style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 11,
            color: C.muted, fontStyle: "italic",
          }}>
            approx.
          </span>
        )}
        {p.ageMin != null && p.ageMax != null && (
          <span style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
            color: C.blue, background: C.blue + "14", padding: "4px 12px", borderRadius: 8,
          }}>
            Ages {p.ageMin}&ndash;{p.ageMax}
          </span>
        )}
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
          <div style={s.detailLabel}>DAYS</div>
          <div style={s.detailValue}>{p.days || "\u2014"}</div>
        </div>
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
          {(kids || []).length > 0 && (
            <>
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
                ASSIGN KIDS
              </div>
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
                        background: sel ? C.seaGreen : "transparent",
                        color: sel ? "#fff" : C.ink,
                        borderColor: sel ? C.seaGreen : C.border,
                      }}
                    >
                      {k.name}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Confirm / Cancel */}
          <div style={{ display: "flex", gap: 8 }}>
            <button style={s.secondaryBtn} onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button style={s.primaryBtn} onClick={handleConfirmAdd}>
              Confirm
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
