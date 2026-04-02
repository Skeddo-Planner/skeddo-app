import { useState } from "react";
import { C, STATUS_MAP } from "../constants/brand";
import { s } from "../styles/shared";
import ProgramCard from "../components/ProgramCard";
import EmptyState from "../components/EmptyState";
import KidFilterBar from "../components/KidFilterBar";
import useIsDesktop from "../hooks/useIsDesktop";
import { calcCostPerHour, fmtShortDate } from "../utils/helpers";

/* ─── Desktop sort arrow icon ─── */
function SortArrow({ direction, active }) {
  const opacity = active ? 1 : 0.3;
  return (
    <span style={{ marginLeft: 4, fontSize: 10, opacity, color: active ? C.ink : C.muted }}>
      {direction === "asc" ? "\u25B2" : "\u25BC"}
    </span>
  );
}

/* ─── Status badge ─── */
function StatusBadge({ status }) {
  const st = STATUS_MAP[status] || STATUS_MAP.Exploring;
  return (
    <span style={{
      fontFamily: "'Barlow', sans-serif",
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 8px",
      borderRadius: 6,
      color: st.color,
      background: st.bg,
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

/* ─── Desktop detail panel ─── */
function DetailPanel({ program, kids, onClose, onCycleStatus, onSetStatus }) {
  const kidNames = (program.kidIds || []).map((id) => kids.find((k) => k.id === id)?.name).filter(Boolean);
  const cph = calcCostPerHour(program);
  const st = STATUS_MAP[program.status] || STATUS_MAP.Exploring;

  return (
    <div className="skeddo-detail-panel">
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 16, right: 16,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 20, color: C.muted, width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        aria-label="Close detail panel"
      >
        &times;
      </button>

      {/* Program name */}
      <div style={{
        fontFamily: "'Barlow', sans-serif", fontSize: 18, fontWeight: 600,
        color: C.ink, marginBottom: 4, paddingRight: 36,
      }}>
        {program.name}
      </div>
      {program.provider && (
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 12 }}>
          {program.provider}
        </div>
      )}

      {/* Status picker */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
          color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8,
        }}>
          YOUR STATUS
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["Exploring", "Waitlist", "Enrolled"].map((s_) => {
            const sm = STATUS_MAP[s_];
            const active = program.status === s_;
            return (
              <button
                key={s_}
                onClick={() => {
                  if (!active) {
                    if (onSetStatus) onSetStatus(program.id, s_);
                    else onCycleStatus && onCycleStatus(program.id);
                  }
                }}
                aria-pressed={active}
                style={{
                  fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
                  padding: "6px 12px", borderRadius: 8,
                  border: active ? `2px solid ${sm.color}` : `2px solid rgba(27,36,50,0.12)`,
                  background: active ? sm.bg : "transparent",
                  color: active ? sm.color : C.muted,
                  cursor: active ? "default" : "pointer",
                  transition: "all 0.15s",
                }}
              >
                {sm.icon} {s_}
              </button>
            );
          })}
        </div>
        {/* Contextual next-step hint */}
        {program.status === "Exploring" && (
          <div style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted,
            marginTop: 8, lineHeight: 1.5,
          }}>
            Register on the provider's site, then mark as Enrolled.
          </div>
        )}
        {program.status === "Waitlist" && (
          <div style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted,
            marginTop: 8, lineHeight: 1.5,
          }}>
            When a spot opens and you register, mark as Enrolled.
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: `1px solid rgba(27,36,50,0.06)`, margin: "0 0 16px" }} />

      {/* Details grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
        {[
          { label: "Dates", value: program.startDate ? `${fmtShortDate(program.startDate) || ""} \u2013 ${fmtShortDate(program.endDate) || ""}` : "\u2014" },
          { label: "Days", value: program.days || "\u2014" },
          { label: "Time", value: program.times || "\u2014" },
          { label: "Age range", value: program.ageMin || program.ageMax ? `${program.ageMin || "?"}\u2013${program.ageMax || "?"}` : "\u2014" },
          { label: "Location", value: program.location || "\u2014" },
          { label: "Cost", value: program.cost ? `$${Number(program.cost).toLocaleString()}` : "\u2014" },
          { label: "Cost/hr", value: cph ? `$${cph.toFixed(2)}` : "\u2014" },
        ].map((d) => (
          <div key={d.label}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>{d.label}</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.ink, marginTop: 2 }}>{d.value}</div>
          </div>
        ))}
      </div>

      {/* Assigned kids */}
      {kidNames.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginBottom: 6 }}>Assigned to</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {kidNames.map((name) => (
              <span key={name} style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 500,
                padding: "4px 10px", borderRadius: 6,
                background: C.cream, color: C.ink,
              }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: `1px solid rgba(27,36,50,0.06)`, margin: "16px 0" }} />

      {/* Actions */}
      {program.registrationUrl && (
        <a
          href={program.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block", width: "100%", padding: "10px 0",
            background: C.seaGreen, color: C.white, textAlign: "center",
            borderRadius: 8, fontFamily: "'Barlow', sans-serif",
            fontSize: 14, fontWeight: 600, textDecoration: "none",
            marginBottom: 8,
          }}
        >
          Open registration
        </a>
      )}

      {program.notes && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginBottom: 4 }}>Notes</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.ink, lineHeight: 1.5 }}>
            {program.notes}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgramsTab({
  filteredPrograms,
  statusFilter,
  catFilter,
  kids,
  kidFilter,
  onKidFilter,
  onStatusFilter,
  onCatFilter,
  onOpenDetail,
  onCycleStatus,
  onSetStatus,
  onOpenAddProgram,
  searchQuery,
  onSearchQuery,
}) {
  const isDesktop = useIsDesktop();
  const [sortCol, setSortCol] = useState("startDate");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedId, setSelectedId] = useState(null);

  // Split into active (current/upcoming) and past (completed) programs
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activePrograms = filteredPrograms.filter((p) => {
    if (p.status !== "Enrolled") return true;
    if (!p.endDate) return true;
    return new Date(p.endDate + "T00:00:00") >= today;
  });

  const pastPrograms = filteredPrograms.filter((p) => {
    if (p.status !== "Enrolled") return false;
    if (!p.endDate) return false;
    return new Date(p.endDate + "T00:00:00") < today;
  });

  const [showPast, setShowPast] = useState(false);

  /* ─── Desktop sort logic ─── */
  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const statusOrder = { Enrolled: 0, Waitlist: 1, Exploring: 2 };

  const sortedPrograms = [...filteredPrograms].sort((a, b) => {
    let cmp = 0;
    switch (sortCol) {
      case "name":
        cmp = (a.name || "").localeCompare(b.name || "");
        break;
      case "kid": {
        const aKid = (a.kidIds || []).map((id) => kids.find((k) => k.id === id)?.name || "").join(", ");
        const bKid = (b.kidIds || []).map((id) => kids.find((k) => k.id === id)?.name || "").join(", ");
        cmp = aKid.localeCompare(bKid);
        break;
      }
      case "startDate":
        cmp = (a.startDate || "").localeCompare(b.startDate || "");
        break;
      case "status":
        cmp = (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
        break;
      case "cost":
        cmp = (Number(a.cost) || 0) - (Number(b.cost) || 0);
        break;
      case "cph": {
        const aCph = calcCostPerHour(a) ?? 999;
        const bCph = calcCostPerHour(b) ?? 999;
        cmp = aCph - bCph;
        break;
      }
      default:
        cmp = 0;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const selectedProgram = selectedId ? filteredPrograms.find((p) => p.id === selectedId) : null;

  /* ─── Desktop: data table view ─── */
  if (isDesktop) {
    const columns = [
      { key: "name", label: "Program", flex: "2" },
      { key: "kid", label: "Kid", width: "80px" },
      { key: "startDate", label: "Dates", width: "140px" },
      { key: "days", label: "Days", width: "100px", sortable: false },
      { key: "status", label: "Status", width: "100px" },
      { key: "cost", label: "Cost", width: "80px" },
      { key: "cph", label: "$/hr", width: "70px" },
    ];

    const subtitle = kidFilter
      ? `${filteredPrograms.length} programs for ${kids.find((k) => k.id === kidFilter)?.name || "selected kid"}`
      : `${filteredPrograms.length} programs across ${kids.length} kid${kids.length !== 1 ? "s" : ""}`;

    const title = statusFilter !== "All"
      ? `${statusFilter} programs`
      : kidFilter
        ? `${kids.find((k) => k.id === kidFilter)?.name || ""}'s programs`
        : "All programs";

    return (
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Panel header */}
          <div className="skeddo-panel-header">
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink, margin: 0 }}>
                {title}
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginTop: 2 }}>
                {subtitle}
              </p>
            </div>
            <button
              className="chip-btn"
              style={s.addButton}
              onClick={onOpenAddProgram}
              aria-label="Add a new program"
            >
              + Add
            </button>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: C.muted, pointerEvents: "none" }}>
              {"\uD83D\uDD0D"}
            </span>
            <input
              style={{ ...s.input, paddingLeft: 34, fontSize: 14, marginBottom: 0 }}
              type="text"
              placeholder="Search my programs..."
              value={searchQuery || ""}
              onChange={(e) => onSearchQuery && onSearchQuery(e.target.value)}
            />
          </div>

          {/* Data table */}
          {sortedPrograms.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              background: C.white, borderRadius: 12,
              border: `0.5px solid rgba(27,36,50,0.08)`,
            }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 500, color: C.ink, marginBottom: 8 }}>
                No programs yet
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 16 }}>
                Browse camps and classes in the Discover tab
              </div>
            </div>
          ) : (
            <div style={{ borderRadius: 12, overflow: "hidden", border: `0.5px solid rgba(27,36,50,0.08)` }}>
              <table className="skeddo-data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        onClick={() => col.sortable !== false && handleSort(col.key)}
                        style={{
                          width: col.width || "auto",
                          flex: col.flex || undefined,
                          textAlign: col.key === "cost" || col.key === "cph" ? "right" : "left",
                          cursor: col.sortable !== false ? "pointer" : "default",
                          color: sortCol === col.key ? C.ink : C.muted,
                        }}
                      >
                        {col.label}
                        {col.sortable !== false && <SortArrow direction={sortDir} active={sortCol === col.key} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedPrograms.map((p) => {
                    const kidNames = (p.kidIds || []).map((id) => kids.find((k) => k.id === id)?.name || "").filter(Boolean).join(", ");
                    const cph = calcCostPerHour(p);
                    const cphColor = cph == null ? C.muted : cph < 10 ? C.seaGreen : cph <= 20 ? C.muted : C.lilac;
                    const isSelected = selectedId === p.id;

                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedId(isSelected ? null : p.id)}
                        style={{
                          background: isSelected ? "rgba(45,159,111,0.04)" : undefined,
                        }}
                      >
                        <td>
                          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500, color: C.ink }}>
                            {p.name}
                          </div>
                          {p.provider && (
                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                              {p.provider}
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: 12 }}>{kidNames || "\u2014"}</td>
                        <td style={{ fontSize: 12, color: C.muted }}>
                          {p.startDate ? `${fmtShortDate(p.startDate) || ""} \u2013 ${fmtShortDate(p.endDate) || ""}` : "\u2014"}
                        </td>
                        <td style={{ fontSize: 12, color: C.muted }}>{p.days || "\u2014"}</td>
                        <td><StatusBadge status={p.status} /></td>
                        <td style={{ textAlign: "right", fontWeight: 500 }}>
                          {p.cost ? `$${Number(p.cost).toLocaleString()}` : "\u2014"}
                        </td>
                        <td style={{ textAlign: "right", fontSize: 12, color: cphColor }}>
                          {cph ? `$${cph.toFixed(2)}` : "\u2014"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedProgram && (
          <DetailPanel
            program={selectedProgram}
            kids={kids}
            onClose={() => setSelectedId(null)}
            onCycleStatus={onCycleStatus}
            onSetStatus={onSetStatus}
          />
        )}
      </div>
    );
  }

  /* ─── Mobile: original card layout (unchanged) ─── */
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 0,
        }}
      >
        <h2 style={s.pageTitle}>My Programs</h2>
        <button
          className="chip-btn"
          style={s.addButton}
          onClick={onOpenAddProgram}
          aria-label="Add a new program"
        >
          + Add
        </button>
      </div>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: C.muted, marginBottom: 16, marginTop: 0 }}>
        {filteredPrograms.length} program{filteredPrograms.length !== 1 ? "s" : ""} tracked
      </p>

      {/* Kid filter */}
      <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />

      {/* Search input */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14,
            color: C.muted,
            pointerEvents: "none",
          }}
        >
          {"\uD83D\uDD0D"}
        </span>
        <input
          style={{
            ...s.input,
            paddingLeft: 34,
            fontSize: 14,
            marginBottom: 0,
          }}
          type="text"
          placeholder="Search my programs..."
          value={searchQuery || ""}
          onChange={(e) => onSearchQuery && onSearchQuery(e.target.value)}
        />
      </div>

      {/* Status filter chips */}
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        {["All", "Enrolled", "Waitlist", "Exploring"].map((st) => (
          <button
            key={st}
            className="chip-btn"
            onClick={() => onStatusFilter(st)}
            aria-label={`Filter by status: ${st}`}
            aria-pressed={statusFilter === st}
            style={{
              ...s.filterChip,
              background: statusFilter === st ? C.ink : "transparent",
              color: statusFilter === st ? C.cream : C.ink,
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Active programs */}
      {activePrograms.length === 0 && pastPrograms.length === 0 && (
        <EmptyState icon={"\uD83D\uDD0D"} message="No programs match your filters." />
      )}
      {activePrograms.length === 0 && pastPrograms.length > 0 && (
        <EmptyState icon={"\u2600\uFE0F"} message="No upcoming programs. Check your past programs below." />
      )}
      {activePrograms.map((p) => (
        <ProgramCard
          key={p.id}
          p={p}
          kids={kids}
          onTap={() => onOpenDetail(p)}
          onStatusTap={() => onCycleStatus(p.id)}
        />
      ))}

      {/* Past programs — collapsible section */}
      {pastPrograms.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => setShowPast(!showPast)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "12px 0",
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{"\uD83D\uDCCB"}</span>
              <span style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: C.muted,
              }}>
                Past Programs ({pastPrograms.length})
              </span>
            </div>
            <span style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 14,
              color: C.muted,
              transform: showPast ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}>
              {"\u25BC"}
            </span>
          </button>

          {showPast && (
            <div style={{ opacity: 0.75 }}>
              <p style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 14,
                color: C.muted,
                marginBottom: 12,
                lineHeight: 1.5,
              }}>
                These programs have ended. They're kept here for your reference.
              </p>
              {pastPrograms.map((p) => (
                <ProgramCard
                  key={p.id}
                  p={p}
                  kids={kids}
                  onTap={() => onOpenDetail(p)}
                  onStatusTap={() => onCycleStatus(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
