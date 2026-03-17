import { C, STATUS_MAP, CAT_EMOJI } from "../constants/brand";
import { s } from "../styles/shared";
import Modal from "../components/Modal";

export default function ProgramDetail({ program, kids, onCycleStatus, onEdit, onDelete, onClose, fmt$ }) {
  const p = program;
  const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
  const assignedKids = (kids || []).filter((k) => (p.kidIds || []).includes(k.id));

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

      {/* Program name */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h3 style={s.modalTitle}>{p.name}</h3>
        <div
          className="status-chip"
          style={{ ...s.statusChip, background: st.bg, color: st.color, cursor: "pointer" }}
          onClick={onCycleStatus}
        >
          {st.icon} {p.status}
        </div>
      </div>

      {/* Detail grid */}
      <div style={s.detailGrid}>
        <div>
          <div style={s.detailLabel}>PROVIDER</div>
          <div style={s.detailValue}>{p.provider || "\u2014"}</div>
        </div>
        <div>
          <div style={s.detailLabel}>COST</div>
          <div style={{ ...s.detailValue, fontFamily: "'Instrument Serif', serif", fontSize: 20 }}>
            {fmt$(p.cost)}
          </div>
        </div>
        <div>
          <div style={s.detailLabel}>DAYS</div>
          <div style={s.detailValue}>{p.days || "\u2014"}</div>
        </div>
        <div>
          <div style={s.detailLabel}>TIMES</div>
          <div style={s.detailValue}>{p.times || "\u2014"}</div>
        </div>
        <div>
          <div style={s.detailLabel}>START DATE</div>
          <div style={s.detailValue}>{p.startDate || "\u2014"}</div>
        </div>
        <div>
          <div style={s.detailLabel}>END DATE</div>
          <div style={s.detailValue}>{p.endDate || "\u2014"}</div>
        </div>
        <div>
          <div style={s.detailLabel}>AGE RANGE</div>
          <div style={s.detailValue}>
            {p.ageMin != null && p.ageMax != null ? `${p.ageMin}\u2013${p.ageMax}` : "\u2014"}
          </div>
        </div>
        <div>
          <div style={s.detailLabel}>LOCATION</div>
          <div style={s.detailValue}>{p.location || "\u2014"}</div>
        </div>
        <div>
          <div style={s.detailLabel}>NEIGHBOURHOOD</div>
          <div style={s.detailValue}>{p.neighbourhood || "\u2014"}</div>
        </div>
        <div>
          <div style={s.detailLabel}>SEASON TYPE</div>
          <div style={s.detailValue}>{p.seasonType || "\u2014"}</div>
        </div>
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
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Register &rarr;
          </a>
        </div>
      )}

      {/* Notes */}
      {p.notes && (
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            color: C.muted,
            marginTop: 12,
            padding: 12,
            background: C.cream,
            borderRadius: 8,
            lineHeight: 1.6,
          }}
        >
          {p.notes}
        </div>
      )}

      {/* Assigned kids */}
      {assignedKids.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
          {assignedKids.map((k) => (
            <span
              key={k.id}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                background: C.lilac + "22",
                color: C.lilac,
                padding: "3px 10px",
                borderRadius: 10,
              }}
            >
              {k.name}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <button style={s.secondaryBtn} onClick={onClose}>
          Close
        </button>
        <button style={s.primaryBtn} onClick={onEdit}>
          Edit
        </button>
        <button className="del-btn" style={s.dangerBtn} onClick={onDelete}>
          Delete
        </button>
      </div>
    </Modal>
  );
}
