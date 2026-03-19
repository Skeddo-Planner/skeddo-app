import { useState } from "react";
import { C, STATUS_MAP, CAT_EMOJI } from "../constants/brand";
import { s } from "../styles/shared";
import Modal from "../components/Modal";

/** Format "2026-07-06" as "Jul 6, 2026" */
function fmtDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return dateStr;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function DirectoryDetail({ program, userPrograms, kids, onAddToSchedule, onClose, fmt$ }) {
  const p = program;
  const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;

  // Check if this program is already in the user's list (match by name + provider)
  const alreadyAdded = (userPrograms || []).some(
    (up) => up.name === p.name && up.provider === p.provider
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Exploring");
  const [selectedKidIds, setSelectedKidIds] = useState([]);

  const toggleKid = (kidId) => {
    setSelectedKidIds((prev) =>
      prev.includes(kidId) ? prev.filter((id) => id !== kidId) : [...prev, kidId]
    );
  };

  const handleConfirmAdd = () => {
    onAddToSchedule({
      ...p,
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
      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginBottom: 12 }}>
        {p.provider}
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
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {p.cost != null && (
          <span style={{
            fontFamily: "'Instrument Serif', serif", fontSize: 16,
            color: C.ink, background: C.cream, padding: "4px 12px", borderRadius: 8,
          }}>
            {fmt$(p.cost)}
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
          <div style={s.detailLabel}>TIMES</div>
          <div style={s.detailValue}>
            {p.startTime && p.endTime ? `${p.startTime}\u2013${p.endTime}` : p.times || "\u2014"}
          </div>
        </div>
        <div>
          <div style={s.detailLabel}>DATES</div>
          <div style={s.detailValue}>
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

      {/* Registration URL */}
      {p.registrationUrl && (
        <div style={{ marginTop: 16 }}>
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
        </div>
      )}

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
