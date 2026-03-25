import { useState, useEffect } from "react";
import { C, STATUS_MAP, CAT_EMOJI } from "../constants/brand";
import { s } from "../styles/shared";
import Modal from "../components/Modal";
import { fmtDate, fmt$, downloadICS } from "../utils/helpers";
import { trackEvent } from "../utils/analytics";

/* ─── Star Rating Component ─── */
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value || 0);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star === value ? 0 : star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
              fontSize: 24,
              lineHeight: 1,
              color: filled ? "#E8913A" : C.border,
              transition: "color 0.15s, transform 0.15s",
              transform: hovered === star ? "scale(1.2)" : "scale(1)",
            }}
          >
            {filled ? "\u2605" : "\u2606"}
          </button>
        );
      })}
    </div>
  );
}

export default function ProgramDetail({ program, kids, onCycleStatus, onEdit, onDelete, onClose, onSave, activityLog }) {
  const p = program;
  const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
  const assignedKids = (kids || []).filter((k) => (p.kidIds || []).includes(k.id));

  /* ─── Rating & Review state ─── */
  const [rating, setRating] = useState(p.rating || 0);
  const [review, setReview] = useState(p.review || "");

  // Sync if program prop changes (e.g., after status cycle)
  useEffect(() => { setRating(p.rating || 0); setReview(p.review || ""); }, [p.id, p.rating, p.review]);

  // Determine if rating section should show:
  // Only for Enrolled programs where startDate is today or in the past (on-going or completed)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startParsed = p.startDate ? new Date(p.startDate + "T00:00:00") : null;
  const showRating = p.status === "Enrolled" && startParsed && startParsed <= today;

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    trackEvent("rate_program", { program_name: p.name, rating: newRating });
    if (onSave) onSave({ ...p, rating: newRating, review });
  };

  const handleReviewBlur = () => {
    if (review !== (p.review || "") && onSave) {
      onSave({ ...p, rating, review });
    }
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
          <div style={{ ...s.detailValue, fontFamily: "'Poppins', sans-serif", fontSize: 20 }}>
            {fmt$(p.cost)}
          </div>
        </div>
        <div>
          <div style={s.detailLabel}>TIMES</div>
          <div style={s.detailValue}>{p.times || "\u2014"}</div>
        </div>
        <div>
          <div style={s.detailLabel}>START DATE</div>
          <div style={s.detailValue}>{fmtDate(p.startDate)}</div>
        </div>
        <div>
          <div style={s.detailLabel}>END DATE</div>
          <div style={s.detailValue}>{fmtDate(p.endDate)}</div>
        </div>
        <div>
          <div style={s.detailLabel}>AGE RANGE</div>
          <div style={s.detailValue}>
            {p.ageMin != null && p.ageMax != null
              ? `${p.ageMin}\u2013${p.ageMax}`
              : p.ageMin != null
                ? `${p.ageMin}+`
                : p.ageMax != null
                  ? `Up to ${p.ageMax}`
                  : "\u2014"}
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
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Register &rarr;
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

      {/* Notes */}
      {p.notes && (
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
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

      {/* Rating & Review — only for enrolled, on-going or completed programs */}
      {showRating && (
        <div style={{
          marginTop: 16,
          padding: 14,
          background: C.cream,
          borderRadius: 10,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: C.muted,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 8,
          }}>
            Your Rating
          </div>
          <StarRating value={rating} onChange={handleRatingChange} />
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: C.muted,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginTop: 12,
            marginBottom: 6,
          }}>
            How was the experience?
          </div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            onBlur={handleReviewBlur}
            placeholder="Share your thoughts for future reference..."
            rows={3}
            style={{
              width: "100%",
              fontFamily: "'Barlow', sans-serif",
              fontSize: 14,
              color: C.ink,
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "10px 12px",
              lineHeight: 1.6,
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
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
                fontSize: 12,
                fontWeight: 700,
                background: C.lilac + "22",
                color: C.lilac,
                padding: "4px 10px",
                borderRadius: 10,
              }}
            >
              {k.name}
            </span>
          ))}
        </div>
      )}

      {/* Activity log */}
      {activityLog && activityLog.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
            color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8,
          }}>
            Activity
          </div>
          {activityLog.map((log) => (
            <div key={log.id} style={{
              display: "flex", gap: 8, alignItems: "baseline",
              padding: "6px 0", borderBottom: `1px solid ${C.border}`,
              fontFamily: "'Barlow', sans-serif", fontSize: 13,
            }}>
              <span style={{ color: C.ink, fontWeight: 600 }}>{log.user_name}</span>
              <span style={{ color: C.muted }}>{log.action}</span>
              <span style={{ color: C.muted, marginLeft: "auto", fontSize: 11 }}>
                {new Date(log.created_at).toLocaleDateString()}
              </span>
            </div>
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
        <button className="del-btn" style={s.dangerBtn} onClick={() => {
          if (window.confirm(`Delete "${p.name}"? This can't be undone.`)) onDelete();
        }}>
          Delete
        </button>
      </div>
    </Modal>
  );
}
