import { useState, useMemo } from "react";
import { C, STATUS_MAP } from "../constants/brand";
import { s } from "../styles/shared";
import KidFilterBar from "../components/KidFilterBar";
import { fmt$, calcCostPerHour, costPerHourColor, fmtShortDate } from "../utils/helpers";
import { trackEvent } from "../utils/analytics";
import useIsDesktop from "../hooks/useIsDesktop";

const KID_COLORS_CHART = [C.seaGreen, C.blue, C.lilac, C.olive, C.olive, C.seaGreen];

/* ─── Break period definitions ─── */
const BREAK_PERIODS = [
  { id: "summer", label: "Summer", dateStart: "06-29", dateEnd: "09-04", color: C.seaGreen, bgColor: "rgba(45,159,111,0.08)" },
  { id: "spring", label: "Spring Break", dateStart: "03-16", dateEnd: "03-27", color: C.blue, bgColor: "rgba(74,111,165,0.08)" },
  { id: "holiday", label: "Holiday Break", dateStart: "12-22", dateEnd: "01-02", color: C.lilac, bgColor: "rgba(244,162,97,0.08)" },
];

/* ─── Helpers ─── */
function getBreakForProgram(p) {
  if (!p.startDate) return "other";
  const mmdd = p.startDate.slice(5); // "MM-DD"
  // Summer: Jun 29 – Sep 4
  if (mmdd >= "06-29" && mmdd <= "09-04") return "summer";
  // Spring break: Mar 16 – Mar 27
  if (mmdd >= "03-16" && mmdd <= "03-27") return "spring";
  // Holiday: Dec 22 – Jan 2 (Dec portion)
  if (mmdd >= "12-22" && mmdd <= "12-31") return "holiday";
  // Holiday: Jan 1–2
  if (mmdd >= "01-01" && mmdd <= "01-02") return "holiday";
  return "other";
}

function getWeekLabel(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return null;
  // Get Monday of the week
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((day + 6) % 7));
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  return { key: mon.toISOString().slice(0, 10), monDate: mon, friDate: fri };
}

function perHrColor(rate) {
  if (rate == null) return "#6B7280";
  if (rate < 10) return "#374151"; // Dark grey — great value
  if (rate <= 20) return "#6B7280"; // Mid grey — typical
  return "#9CA3AF"; // Light grey — premium
}

function perHrLabel(rate) {
  if (rate < 10) return "Great value";
  if (rate <= 20) return "Typical";
  return "Premium";
}

/* ─── Export helpers ─── */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function BudgetTab({
  programs, kids, kidFilter, onKidFilter,
  enrolledPrograms, waitlistPrograms, exploringPrograms,
  totalCostEnrolled, totalCostAll, budgetGoal,
  manualCosts, onAddCost, onEditCost, userId, planAccess, onSaveKid,
  onOpenDetail, onFindAlternatives,
}) {
  const isPaid = planAccess.canUseBudgetTracking;
  const isDesktop = useIsDesktop();
  const [sortBy, setSortBy] = useState("cost"); // cost | costPerHour | alpha | status
  const [editingBudget, setEditingBudget] = useState(null); // kid id
  const [budgetInput, setBudgetInput] = useState("");
  const [breakFilter, setBreakFilter] = useState("all"); // "all" | "summer" | "spring" | "holiday"
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "committed" | "potential"
  const [showExport, setShowExport] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  /* ─── Filter by kid ─── */
  const filterByKid = (list) =>
    kidFilter ? list.filter((p) => (p.kidIds || []).includes(kidFilter)) : list;

  const visiblePrograms = filterByKid(programs);
  const visibleEnrolled = filterByKid(enrolledPrograms);
  const visibleWaitlist = filterByKid(waitlistPrograms);
  const visibleExploring = filterByKid(exploringPrograms);
  const visibleManualCosts = kidFilter
    ? (manualCosts || []).filter((c) => c.kidId === kidFilter)
    : (manualCosts || []);

  const enrolledCost = visibleEnrolled.reduce((a, p) => a + Number(p.cost || 0), 0);
  const waitlistCost = visibleWaitlist.reduce((a, p) => a + Number(p.cost || 0), 0);
  const exploringCost = visibleExploring.reduce((a, p) => a + Number(p.cost || 0), 0);
  const manualCostTotal = visibleManualCosts.reduce((a, c) => a + Number(c.amount || 0), 0);

  const committedCost = enrolledCost + manualCostTotal;
  const potentialCost = waitlistCost + exploringCost;
  const grandTotal = committedCost + potentialCost;

  const selectedKid = kidFilter ? kids.find((k) => k.id === kidFilter) : null;

  // Per-kid budget: use kid's budgetGoal if set, otherwise fall back to overall
  const effectiveBudget = selectedKid
    ? (Number(selectedKid.budgetGoal) || 0)
    : kids.reduce((sum, k) => sum + (Number(k.budgetGoal) || 0), 0) || budgetGoal;

  const remaining = effectiveBudget > 0 ? effectiveBudget - committedCost : 0;
  const pctUsed = effectiveBudget > 0 ? Math.min((committedCost / effectiveBudget) * 100, 100) : 0;
  const pctPotential = effectiveBudget > 0 ? Math.min((potentialCost / effectiveBudget) * 100, 100 - pctUsed) : 0;

  /* ─── Per-break totals ─── */
  const breakTotals = useMemo(() => {
    return BREAK_PERIODS.map((bp) => {
      const bProgs = visiblePrograms.filter((p) => getBreakForProgram(p) === bp.id);
      const comm = bProgs.filter((p) => p.status === "Enrolled").reduce((s, p) => s + Number(p.cost || 0), 0);
      const pot = bProgs.filter((p) => p.status !== "Enrolled").reduce((s, p) => s + Number(p.cost || 0), 0);
      return { ...bp, committed: comm, potential: pot, total: comm + pot, count: bProgs.length };
    });
  }, [visiblePrograms]);

  /* ─── Per-kid totals ─── */
  const kidTotals = useMemo(() => {
    return kids.map((k) => {
      const kProgs = programs.filter((p) => (p.kidIds || []).includes(k.id));
      const kManual = (manualCosts || []).filter((c) => c.kidId === k.id);
      const comm = kProgs.filter((p) => p.status === "Enrolled").reduce((s, p) => s + Number(p.cost || 0), 0) + kManual.reduce((s, m) => s + Number(m.amount || 0), 0);
      const pot = kProgs.filter((p) => p.status !== "Enrolled").reduce((s, p) => s + Number(p.cost || 0), 0);
      return { ...k, committed: comm, potential: pot, total: comm + pot, count: kProgs.length };
    });
  }, [programs, kids, manualCosts]);

  /* ─── Week-by-week breakdown for active break ─── */
  const weekBreakdown = useMemo(() => {
    if (breakFilter === "all") return [];
    const bProgs = visiblePrograms.filter((p) => getBreakForProgram(p) === breakFilter);
    const weekMap = {};
    bProgs.forEach((p) => {
      const wk = getWeekLabel(p.startDate);
      if (!wk) return;
      if (!weekMap[wk.key]) weekMap[wk.key] = { ...wk, programs: [], total: 0, kidBreakdown: {} };
      weekMap[wk.key].programs.push(p);
      weekMap[wk.key].total += Number(p.cost || 0);
      // Per-kid within week
      (p.kidIds || []).forEach((kidId) => {
        if (!weekMap[wk.key].kidBreakdown[kidId]) weekMap[wk.key].kidBreakdown[kidId] = 0;
        weekMap[wk.key].kidBreakdown[kidId] += Number(p.cost || 0);
      });
      // Unassigned
      if (!p.kidIds || p.kidIds.length === 0) {
        if (!weekMap[wk.key].kidBreakdown["_unassigned"]) weekMap[wk.key].kidBreakdown["_unassigned"] = 0;
        weekMap[wk.key].kidBreakdown["_unassigned"] += Number(p.cost || 0);
      }
    });
    return Object.values(weekMap).sort((a, b) => a.key.localeCompare(b.key));
  }, [visiblePrograms, breakFilter]);

  /* ─── Program list with cost-per-hour and filters ─── */
  const programsWithCPH = useMemo(() =>
    visiblePrograms.map((p) => ({ ...p, cph: calcCostPerHour(p) })),
    [visiblePrograms]
  );

  const filteredPrograms = useMemo(() => {
    let list = [...programsWithCPH];
    if (breakFilter !== "all") list = list.filter((p) => getBreakForProgram(p) === breakFilter);
    if (statusFilter === "committed") list = list.filter((p) => p.status === "Enrolled");
    if (statusFilter === "potential") list = list.filter((p) => p.status !== "Enrolled");

    const STATUS_ORDER = { Enrolled: 0, Waitlist: 1, Exploring: 2 };
    if (sortBy === "cost") list.sort((a, b) => Number(b.cost || 0) - Number(a.cost || 0));
    else if (sortBy === "costPerHour") list.sort((a, b) => (a.cph || Infinity) - (b.cph || Infinity));
    else if (sortBy === "alpha") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    else if (sortBy === "status") list.sort((a, b) => (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3) || Number(b.cost || 0) - Number(a.cost || 0));
    return list;
  }, [programsWithCPH, breakFilter, statusFilter, sortBy]);

  /* ─── Export ─── */
  function buildExportRows() {
    const rows = [];
    const progs = filteredPrograms;
    progs.forEach((p) => {
      const kidNames = (p.kidIds || []).map((id) => kids.find((k) => k.id === id)?.name || "").filter(Boolean).join(", ");
      const fmtDateRange = p.startDate && p.endDate ? `${p.startDate} to ${p.endDate}` : p.startDate || "";
      rows.push({
        "Date(s)": fmtDateRange,
        "Child": kidNames,
        "Activity Name": p.name || "",
        "Provider": p.provider || "",
        "Cost": Number(p.cost || 0),
        "Status": p.status || "",
        "Cost/Hr": p.cph != null ? `$${p.cph.toFixed(2)}` : "—",
        "Break": getBreakForProgram(p),
        "Type": "Program",
      });
    });
    visibleManualCosts.forEach((m) => {
      const kid = kids.find((k) => k.id === m.kidId);
      rows.push({
        "Date(s)": m.date || "",
        "Child": kid?.name || "",
        "Activity Name": m.description || "",
        "Provider": "—",
        "Cost": Number(m.amount || 0),
        "Status": "—",
        "Cost/Hr": "—",
        "Break": "—",
        "Type": m.category || "Expense",
      });
    });
    return rows;
  }

  function doExport(format) {
    const rows = buildExportRows();
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    if (format === "csv") {
      const escape = (v) => {
        const str = String(v ?? "");
        return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str.replace(/"/g, '""')}"` : str;
      };
      const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      triggerDownload(blob, "skeddo-budget-export.csv");
    } else {
      let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:spreadsheet" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Skeddo Budget</x:Name></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">';
      html += "<tr>" + headers.map((h) => `<th style="font-weight:bold;background:${C.seaGreen};color:white;padding:8px">${h}</th>`).join("") + "</tr>";
      rows.forEach((r) => {
        html += "<tr>" + headers.map((h) => `<td style="padding:6px">${r[h] ?? ""}</td>`).join("") + "</tr>";
      });
      html += "</table></body></html>";
      const blob = new Blob([html], { type: "application/vnd.ms-excel" });
      triggerDownload(blob, "skeddo-budget-export.xls");
    }
    trackEvent("export_budget", { format, rows: rows.length });
    setExportDone(true);
    setTimeout(() => { setExportDone(false); setShowExport(false); }, 1500);
  }

  /* ─── Average cost per hour ─── */
  const avgCPH = useMemo(() => {
    const cphs = programsWithCPH.filter((p) => p.cph != null).map((p) => p.cph);
    if (cphs.length === 0) return null;
    return cphs.reduce((a, b) => a + b, 0) / cphs.length;
  }, [programsWithCPH]);

  /* ─── Shared styles ─── */
  const cardStyle = {
    background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)",
  };
  const labelStyle = {
    fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.muted,
    textTransform: "uppercase", letterSpacing: 0.5,
  };

  /* ═══════════════════════════════════════
     DESKTOP DASHBOARD VIEW
     ═══════════════════════════════════════ */
  if (isDesktop) {
    const statCards = [
      { label: "Committed", value: `$${committedCost.toLocaleString()}`, color: C.seaGreen },
      { label: "Potential", value: `$${potentialCost.toLocaleString()}`, color: C.lilac },
      { label: "Remaining", value: `$${Math.abs(remaining).toLocaleString()}`, color: remaining >= 0 ? C.ink : C.olive },
      { label: "Avg cost/hr", value: avgCPH != null ? `$${avgCPH.toFixed(2)}` : "\u2014", color: C.muted },
    ];

    return (
      <div>
        {/* Panel header */}
        <div className="skeddo-panel-header">
          <div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink, margin: 0 }}>
              Budget
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginTop: 2 }}>
              {effectiveBudget > 0 ? `$${effectiveBudget.toLocaleString()} goal` : "No budget set"}
            </p>
          </div>
          <button
            onClick={() => {
              if (selectedKid) {
                setEditingBudget(selectedKid.id);
                setBudgetInput(String(selectedKid.budgetGoal || ""));
              } else if (kids.length === 1) {
                setEditingBudget(kids[0].id);
                setBudgetInput(String(kids[0].budgetGoal || ""));
              } else if (kids.length > 1) {
                const target = kids.find((k) => !k.budgetGoal) || kids[0];
                setEditingBudget(target.id);
                setBudgetInput(String(target.budgetGoal || ""));
              }
            }}
            style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
              color: effectiveBudget > 0 ? C.seaGreen : C.white,
              background: effectiveBudget > 0 ? "transparent" : C.seaGreen,
              border: `1.5px solid ${C.seaGreen}`,
              borderRadius: 8, padding: "7px 16px", cursor: "pointer",
            }}
          >
            {effectiveBudget > 0 ? "Edit Budget Goal" : "Set Budget Goal"}
          </button>
        </div>

        {/* Inline budget editor */}
        {editingBudget && (
          <div style={{ ...cardStyle, marginBottom: 16, padding: 16, border: `1px solid ${C.seaGreen}40` }}>
            <div style={{ ...labelStyle, marginBottom: 10 }}>Set Budget by Kid</div>
            {kids.map((k) => {
              const isEditing = editingBudget === k.id;
              return (
                <div key={k.id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  <div style={{ ...s.kidAvatar, width: 28, height: 28, fontSize: 12, borderRadius: 8, background: k.color || s.kidAvatar.background }}>
                    {k.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink, flex: 1 }}>
                    {k.name}
                  </span>
                  {isEditing ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.ink }}>$</span>
                      <input
                        type="number"
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                        autoFocus
                        style={{ ...s.input, width: 80, padding: "6px 8px", fontSize: 14, textAlign: "right" }}
                      />
                      <button
                        onClick={() => {
                          if (onSaveKid) {
                            const goal = Number(budgetInput) || 0;
                            trackEvent("set_budget", { kid_name: k.name, budget_goal: goal });
                            onSaveKid({ ...k, budgetGoal: goal });
                          }
                          setEditingBudget(null);
                        }}
                        style={{
                          background: C.seaGreen, color: "#fff", border: "none",
                          borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 700,
                          fontFamily: "'Barlow', sans-serif", cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingBudget(k.id); setBudgetInput(String(k.budgetGoal || "")); }}
                      style={{
                        background: "none", border: `1px solid ${C.border}`, borderRadius: 6,
                        padding: "4px 10px", fontSize: 14, fontWeight: 600, color: k.budgetGoal ? C.ink : C.muted,
                        fontFamily: "'Barlow', sans-serif", cursor: "pointer",
                      }}
                    >
                      {k.budgetGoal ? fmt$(k.budgetGoal) : "Set"}
                    </button>
                  )}
                </div>
              );
            })}
            <button
              onClick={() => setEditingBudget(null)}
              style={{
                background: "none", border: "none", fontFamily: "'Barlow', sans-serif",
                fontSize: 12, fontWeight: 600, color: C.muted, cursor: "pointer", marginTop: 8, padding: 0,
              }}
            >
              Done
            </button>
          </div>
        )}

        {/* Row 1: Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {statCards.map((card) => (
            <div key={card.label} className="skeddo-stat-card">
              <div className="skeddo-stat-card-label">{card.label}</div>
              <div className="skeddo-stat-card-value" style={{ color: card.color }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Budget progress bar */}
        {effectiveBudget > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              height: 28, borderRadius: 8, background: C.cream,
              overflow: "hidden", display: "flex",
            }}>
              {pctUsed > 0 && (
                <div style={{
                  width: `${pctUsed}%`, background: C.seaGreen,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: C.white, fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 500,
                  minWidth: pctUsed > 8 ? "auto" : 0,
                  overflow: "hidden", whiteSpace: "nowrap",
                }}>
                  {pctUsed > 8 && `$${committedCost.toLocaleString()}`}
                </div>
              )}
              {pctPotential > 0 && (
                <div style={{
                  width: `${pctPotential}%`, background: C.lilac,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: C.white, fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 500,
                  minWidth: pctPotential > 8 ? "auto" : 0,
                  overflow: "hidden", whiteSpace: "nowrap",
                }}>
                  {pctPotential > 8 && `$${potentialCost.toLocaleString()}`}
                </div>
              )}
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between", marginTop: 6,
              fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted,
            }}>
              <span>{Math.round(pctUsed)}% committed</span>
              <span>{Math.round(pctPotential)}% potential</span>
              <span>{Math.round(100 - pctUsed - pctPotential)}% remaining</span>
            </div>
          </div>
        )}

        {/* Row 3: Two-up — Spend by kid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {/* Chart A: Spend by kid */}
          <div style={{
            background: C.white, borderRadius: 12,
            border: `0.5px solid rgba(27,36,50,0.08)`,
            padding: 14,
          }}>
            <div style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 500,
              color: C.ink, marginBottom: 12,
            }}>
              Spend by kid
            </div>
            {kidTotals.map((kt) => {
              const kidColor = kt.color || KID_COLORS_CHART[kids.indexOf(kt) % KID_COLORS_CHART.length] || C.seaGreen;
              const barPct = effectiveBudget > 0
                ? Math.min((kt.committed / effectiveBudget) * 100, 100)
                : (kt.committed / Math.max(grandTotal, 1)) * 100;

              return (
                <div key={kt.id} style={{ marginBottom: 12 }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.ink,
                    marginBottom: 4,
                  }}>
                    <span>{kt.name}</span>
                    <span>${kt.committed.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: C.cream, overflow: "hidden" }}>
                    <div style={{ width: `${barPct}%`, height: "100%", background: kidColor, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart B: Spend by status */}
          <div style={{
            background: C.white, borderRadius: 12,
            border: `0.5px solid rgba(27,36,50,0.08)`,
            padding: 14,
          }}>
            <div style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 500,
              color: C.ink, marginBottom: 12,
            }}>
              Spend by status
            </div>
            {[
              { label: "Enrolled", cost: enrolledCost, color: C.seaGreen },
              { label: "Waitlist", cost: waitlistCost, color: C.olive },
              { label: "Exploring", cost: exploringCost, color: C.blue },
              { label: "Other expenses", cost: manualCostTotal, color: C.lilac },
            ].filter((s) => s.cost > 0).map((st) => {
              const barPct = (st.cost / Math.max(grandTotal, 1)) * 100;
              return (
                <div key={st.label} style={{ marginBottom: 12 }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.ink,
                    marginBottom: 4,
                  }}>
                    <span>{st.label}</span>
                    <span>${st.cost.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: C.cream, overflow: "hidden" }}>
                    <div style={{ width: `${barPct}%`, height: "100%", background: st.color, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 4: Cost table */}
        {filteredPrograms.length > 0 && (
          <div style={{ borderRadius: 12, overflow: "hidden", border: `0.5px solid rgba(27,36,50,0.08)` }}>
            <table className="skeddo-data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }} onClick={() => setSortBy("alpha")}>Program</th>
                  <th style={{ width: 80, textAlign: "left" }}>Kid</th>
                  <th style={{ width: 100, textAlign: "left" }} onClick={() => setSortBy("status")}>Status</th>
                  <th style={{ width: 80, textAlign: "right" }} onClick={() => setSortBy("cost")}>Cost</th>
                  <th style={{ width: 70, textAlign: "right" }} onClick={() => setSortBy("costPerHour")}>$/hr</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((p) => {
                  const kidNames = (p.kidIds || []).map((id) => kids.find((k) => k.id === id)?.name || "").filter(Boolean).join(", ");
                  const cphColor = perHrColor(p.cph);
                  return (
                    <tr key={p.id} onClick={() => onOpenDetail && onOpenDetail(p)} style={{ cursor: "pointer" }}>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div>
                        {p.provider && <div style={{ fontSize: 11, color: C.muted }}>{p.provider}</div>}
                        {onFindAlternatives && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onFindAlternatives(p); }}
                            style={{
                              marginTop: 3, background: "none", border: "none", padding: 0,
                              fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600,
                              color: C.blue, cursor: "pointer",
                            }}
                          >
                            Find similar →
                          </button>
                        )}
                      </td>
                      <td style={{ fontSize: 12 }}>{kidNames || "\u2014"}</td>
                      <td>
                        <span style={{
                          fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600,
                          padding: "3px 8px", borderRadius: 6,
                          color: STATUS_MAP[p.status]?.color || C.muted,
                          background: STATUS_MAP[p.status]?.bg || C.cream,
                        }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 500 }}>
                        ${Number(p.cost || 0).toLocaleString()}
                      </td>
                      <td style={{ textAlign: "right", fontSize: 12, color: cphColor }}>
                        {p.cph != null ? `$${p.cph.toFixed(2)}` : "\u2014"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Add cost button */}
        <button
          onClick={onAddCost}
          style={{
            width: "100%", padding: "12px", marginTop: 16,
            background: "none", border: `1.5px dashed ${C.border}`,
            borderRadius: 8, fontFamily: "'Barlow', sans-serif",
            fontSize: 13, fontWeight: 500, color: C.muted,
            cursor: "pointer",
          }}
        >
          + Add an expense
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={s.pageTitle}>Budget</h2>

      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: C.muted, marginBottom: 16 }}>
        {selectedKid ? (
          <>Spending breakdown for <strong style={{ color: C.ink }}>{selectedKid.name || "this kid"}</strong></>
        ) : (
          <>Programs cost <em style={{ fontFamily: "'Poppins', sans-serif", color: C.olive, fontStyle: "italic" }}>HOW much?!</em> Here's your breakdown.</>
        )}
      </p>

      <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />

      {/* ═══ HERO CARD ═══ */}
      <div style={{
        background: C.seaGreen, borderRadius: 16, padding: "20px 18px", marginBottom: 14,
        boxShadow: "0 4px 16px rgba(45,159,111,0.25)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {selectedKid ? `${(selectedKid.name || "").toUpperCase()}'S TOTAL` : "SCHOOL YEAR TOTAL"}
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 400, color: "#FFFFFF", lineHeight: 1.1, marginTop: 2 }}>
              {fmt$(grandTotal)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, marginTop: 4 }}>
            <button
              onClick={() => {
                if (selectedKid) {
                  setEditingBudget(selectedKid.id);
                  setBudgetInput(String(selectedKid.budgetGoal || ""));
                } else if (kids.length === 0) return;
                else if (kids.length === 1) {
                  setEditingBudget(kids[0].id);
                  setBudgetInput(String(kids[0].budgetGoal || ""));
                } else {
                  const kidWithout = kids.find((k) => !k.budgetGoal);
                  const target = kidWithout || kids[0];
                  setEditingBudget(target.id);
                  setBudgetInput(String(target.budgetGoal || ""));
                }
              }}
              style={{
                padding: "6px 12px", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.1)",
                fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
                color: "rgba(255,255,255,0.85)", cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              {effectiveBudget > 0 ? `Goal: ${fmt$(effectiveBudget)}` : "Set Budget"}
            </button>
            <button
              onClick={() => { onAddCost(); }}
              style={{
                padding: "6px 12px", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.15)",
                fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
                color: "rgba(255,255,255,0.85)", cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Budget bar */}
        {effectiveBudget > 0 && (
          <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.15)", overflow: "hidden", display: "flex", marginBottom: 10 }}>
            <div style={{
              width: `${pctUsed}%`, background: "#FFFFFF",
              borderRadius: pctUsed >= 100 ? 6 : "6px 0 0 6px",
              transition: "width 0.5s ease",
            }} />
            {pctPotential > 0 && (
              <div style={{
                width: `${pctPotential}%`, background: "rgba(255,255,255,0.4)",
                borderRight: "2px dashed rgba(255,255,255,0.3)",
                transition: "width 0.5s ease",
              }} />
            )}
          </div>
        )}

        {/* Legend */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Committed</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
              {fmt$(committedCost)}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Potential</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
              {fmt$(potentialCost)}
            </div>
          </div>
          {effectiveBudget > 0 && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Remaining</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 700, color: remaining >= 0 ? "rgba(255,255,255,0.9)" : "#FFB4A2" }}>
                {remaining >= 0 ? fmt$(remaining) : `-${fmt$(Math.abs(remaining))}`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ SET BUDGET PER KID (inline editor) ═══ */}
      {editingBudget && (
        <div style={{ ...cardStyle, marginBottom: 14, padding: 16 }}>
          <div style={{ ...labelStyle, marginBottom: 10 }}>Set Budget by Kid</div>
          {kids.map((k) => {
            const isEditing = editingBudget === k.id;
            return (
              <div key={k.id} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{ ...s.kidAvatar, width: 28, height: 28, fontSize: 12, borderRadius: 8, background: k.color || s.kidAvatar.background }}>
                  {k.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink, flex: 1 }}>
                  {k.name}
                </span>
                {isEditing ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.ink }}>$</span>
                    <input
                      type="number"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      autoFocus
                      style={{ ...s.input, width: 80, padding: "6px 8px", fontSize: 14, textAlign: "right" }}
                    />
                    <button
                      onClick={() => {
                        if (onSaveKid) {
                          const goal = Number(budgetInput) || 0;
                          trackEvent("set_budget", { kid_name: k.name, budget_goal: goal });
                          onSaveKid({ ...k, budgetGoal: goal });
                        }
                        setEditingBudget(null);
                      }}
                      style={{
                        background: C.seaGreen, color: "#fff", border: "none",
                        borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 700,
                        fontFamily: "'Barlow', sans-serif", cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingBudget(k.id); setBudgetInput(String(k.budgetGoal || "")); }}
                    style={{
                      background: "none", border: `1px solid ${C.border}`, borderRadius: 6,
                      padding: "4px 10px", fontSize: 14, fontWeight: 600, color: k.budgetGoal ? C.ink : C.muted,
                      fontFamily: "'Barlow', sans-serif", cursor: "pointer",
                    }}
                  >
                    {k.budgetGoal ? fmt$(k.budgetGoal) : "Set"}
                  </button>
                )}
              </div>
            );
          })}
          <button
            onClick={() => setEditingBudget(null)}
            style={{
              background: "none", border: "none", fontFamily: "'Barlow', sans-serif",
              fontSize: 12, fontWeight: 600, color: C.muted, cursor: "pointer", marginTop: 8, padding: 0,
            }}
          >
            Done
          </button>
        </div>
      )}

      {/* ═══ PER-BREAK BUDGET PILLS ═══ */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
        {breakTotals.map((b) => {
          const active = breakFilter === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setBreakFilter(active ? "all" : b.id)}
              style={{
                flex: "0 0 auto", minWidth: 115, padding: "12px 14px", borderRadius: 12,
                border: active ? `1.5px solid ${b.color}` : `1px solid ${C.border}`,
                background: active ? b.bgColor : C.white,
                boxShadow: "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 4, background: b.color, flexShrink: 0,
                }} />
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.ink }}>
                  {b.label}
                </span>
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: C.ink }}>
                {fmt$(b.total)}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.seaGreen }}>
                  {fmt$(b.committed)}
                </span>
                {b.potential > 0 && (
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.lilac }}>
                    {fmt$(b.potential)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ═══ WEEK-BY-WEEK BREAKDOWN (when a break is selected) ═══ */}
      {breakFilter !== "all" && weekBreakdown.length > 0 && (
        <div style={{ ...cardStyle, padding: "16px", marginBottom: 14 }}>
          <div style={{ ...labelStyle, marginBottom: 12 }}>
            Week-by-Week Breakdown
          </div>
          {weekBreakdown.map((wk, idx) => {
            const maxWeekCost = Math.max(...weekBreakdown.map((w) => w.total), 1);
            return (
              <div key={wk.key} style={{ marginBottom: idx < weekBreakdown.length - 1 ? 14 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink }}>
                    {fmtShortDate(wk.monDate.toISOString().slice(0, 10))} – {fmtShortDate(wk.friDate.toISOString().slice(0, 10))}
                  </span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: C.ink }}>
                    {fmt$(wk.total)}
                  </span>
                </div>
                {/* Per-kid mini bars */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {kids.filter((k) => wk.kidBreakdown[k.id] > 0).map((k) => {
                    const kCost = wk.kidBreakdown[k.id] || 0;
                    const barPct = (kCost / maxWeekCost) * 100;
                    return (
                      <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          ...s.kidAvatar, width: 22, height: 22, fontSize: 10, borderRadius: 6,
                          background: k.color || s.kidAvatar.background, flexShrink: 0,
                        }}>
                          {k.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: C.border, overflow: "hidden" }}>
                          <div style={{
                            width: `${Math.min(barPct, 100)}%`, height: "100%",
                            background: k.color || C.seaGreen, borderRadius: 4,
                            transition: "width 0.4s ease",
                          }} />
                        </div>
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: C.ink, minWidth: 44, textAlign: "right" }}>
                          {fmt$(kCost)}
                        </span>
                      </div>
                    );
                  })}
                  {wk.kidBreakdown["_unassigned"] > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, background: C.border,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: C.muted, flexShrink: 0,
                      }}>?</div>
                      <div style={{ flex: 1, height: 8, borderRadius: 4, background: C.border, overflow: "hidden" }}>
                        <div style={{
                          width: `${Math.min((wk.kidBreakdown["_unassigned"] / maxWeekCost) * 100, 100)}%`,
                          height: "100%", background: C.muted, borderRadius: 4, opacity: 0.5,
                          transition: "width 0.4s ease",
                        }} />
                      </div>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: C.muted, minWidth: 44, textAlign: "right" }}>
                        {fmt$(wk.kidBreakdown["_unassigned"])}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ PER-KID BREAKDOWN ═══ */}
      {isPaid && !kidFilter && kids.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Per-Kid Breakdown</div>
          <div style={{ display: "flex", gap: 8 }}>
            {kidTotals.map((k) => (
              <button
                key={k.id}
                onClick={() => onKidFilter(k.id)}
                style={{
                  flex: 1, padding: "14px 12px", borderRadius: 12,
                  background: C.white, boxShadow: "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)",
                  cursor: "pointer", border: `1px solid ${C.border}`, textAlign: "left",
                }}
                className="skeddo-card"
                role="button"
                tabIndex={0}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{
                    ...s.kidAvatar, width: 26, height: 26, fontSize: 11, borderRadius: 7,
                    background: k.color || s.kidAvatar.background,
                  }}>
                    {k.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink }}>
                    {k.name}
                  </span>
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, color: C.ink }}>
                  {fmt$(k.total)}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.seaGreen }}>
                    {fmt$(k.committed)}
                  </span>
                  {k.potential > 0 && (
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.lilac }}>
                      {fmt$(k.potential)}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>
                  {k.count} program{k.count !== 1 ? "s" : ""}
                </div>
                {/* Mini bar */}
                {k.total > 0 && (
                  <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden", marginTop: 6, display: "flex" }}>
                    {k.committed > 0 && (
                      <div style={{
                        width: `${(k.committed / k.total) * 100}%`, height: "100%",
                        background: C.seaGreen, transition: "width 0.4s ease",
                      }} />
                    )}
                    {k.potential > 0 && (
                      <div style={{
                        width: `${(k.potential / k.total) * 100}%`, height: "100%",
                        background: C.lilac, opacity: 0.6, transition: "width 0.4s ease",
                      }} />
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
          {/* Unassigned programs note */}
          {(() => {
            const unassigned = programs.filter((p) => !p.kidIds || p.kidIds.length === 0);
            if (unassigned.length === 0) return null;
            const uCost = unassigned.reduce((a, p) => a + Number(p.cost || 0), 0);
            return (
              <div style={{ ...cardStyle, padding: "12px 16px", marginTop: 8, borderLeft: `3px dashed ${C.muted}` }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted }}>
                  <strong>{unassigned.length} program{unassigned.length !== 1 ? "s" : ""}</strong> not assigned to a kid ({fmt$(uCost)})
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginTop: 2 }}>
                  Assign kids in the Programs tab to see accurate per-kid totals
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ═══ PROGRAM COST LIST ═══ */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={labelStyle}>
            Programs{breakFilter !== "all" ? ` \u00B7 ${BREAK_PERIODS.find((b) => b.id === breakFilter)?.label || breakFilter}` : ""}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { id: "all", l: "All" },
              { id: "committed", l: "Committed" },
              { id: "potential", l: "Potential" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                style={{
                  padding: "4px 10px", borderRadius: 6, border: "none",
                  background: statusFilter === f.id ? C.ink : C.border,
                  fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600,
                  color: statusFilter === f.id ? "#FFFFFF" : C.muted,
                  cursor: "pointer", minHeight: 28,
                }}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {[
            { id: "cost", l: "By cost" },
            { id: "costPerHour", l: "By $/hr" },
            { id: "alpha", l: "A\u2013Z" },
            { id: "status", l: "By status" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              style={{
                padding: "4px 10px", borderRadius: 6,
                border: sortBy === opt.id ? `1px solid rgba(27,36,50,0.15)` : "1px solid transparent",
                background: sortBy === opt.id ? C.white : "transparent",
                fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 500,
                color: C.muted, cursor: "pointer", minHeight: 28,
              }}
            >
              {opt.l}
            </button>
          ))}
        </div>

        {/* Program rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filteredPrograms.map((p) => {
            const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
            const hrColor = perHrColor(p.cph);
            const kidNames = (p.kidIds || []).map((id) => kids.find((k) => k.id === id)).filter(Boolean);
            return (
              <div
                key={p.id}
                style={{
                  ...cardStyle, padding: "12px 14px", borderLeft: `3px solid ${st.color}`,
                  cursor: "pointer",
                }}
                onClick={() => onOpenDetail && onOpenDetail(p)}
                role="button"
                tabIndex={0}
                className="skeddo-card"
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {kidNames.length > 0 && kidNames.map((k) => (
                        <div key={k.id} style={{
                          ...s.kidAvatar, width: 20, height: 20, fontSize: 9, borderRadius: 5,
                          background: k.color || s.kidAvatar.background, flexShrink: 0,
                        }}>
                          {k.name?.[0]?.toUpperCase()}
                        </div>
                      ))}
                      <span style={{
                        fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {p.name}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginTop: 2 }}>
                      {p.provider}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: C.ink }}>
                      {fmt$(p.cost)}
                    </div>
                    {isPaid && p.cph != null && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 2 }}>
                        <div style={{ width: 6, height: 6, borderRadius: 3, background: hrColor }} />
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: hrColor }}>
                          {fmt$(p.cph)}/hr
                        </span>
                      </div>
                    )}
                    {isPaid && p.cph == null && (
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                        -- no times
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, padding: "2px 8px",
                      borderRadius: 4, background: st.bg, color: st.color, textTransform: "uppercase",
                    }}>
                      {st.icon} {p.status}
                    </span>
                    {p.startDate && (
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                        {fmtShortDate(p.startDate)}{p.endDate ? ` – ${fmtShortDate(p.endDate)}` : ""}
                      </span>
                    )}
                  </div>
                  {onFindAlternatives && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onFindAlternatives(p); }}
                      style={{
                        background: "none", border: "none", padding: 0,
                        fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
                        color: C.blue, cursor: "pointer", flexShrink: 0,
                      }}
                    >
                      Find similar →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ MANUAL COSTS ═══ */}
      {isPaid && visibleManualCosts.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Additional Costs</div>
          {visibleManualCosts.map((c) => {
            const kid = kids.find((k) => k.id === c.kidId);
            const isNegative = c.amount < 0;
            return (
              <div
                key={c.id}
                style={{
                  ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", marginBottom: 4, cursor: "pointer",
                }}
                onClick={() => onEditCost && onEditCost(c)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
                    background: isNegative ? "rgba(45,159,111,0.1)" : C.border,
                    fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
                    color: isNegative ? C.seaGreen : C.muted,
                  }}>
                    {isNegative ? "-" : "$"}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: 14, color: C.ink }}>
                      {c.description}
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
                      {c.category}{kid ? ` \u00B7 ${kid.name}` : ""}
                    </div>
                  </div>
                </div>
                <span style={{
                  fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700,
                  color: isNegative ? C.seaGreen : C.ink,
                }}>
                  {isNegative ? `-${fmt$(Math.abs(c.amount))}` : fmt$(c.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ ADD COST + EXPORT BUTTONS ═══ */}
      <button
        onClick={() => onAddCost()}
        style={{
          width: "100%", padding: "14px", borderRadius: 12,
          border: `1.5px dashed rgba(27,36,50,0.15)`, background: "transparent",
          fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.muted,
          cursor: "pointer", marginBottom: 10,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
      >
        Add a cost (gear, transport, etc.)
      </button>

      <button
        onClick={() => setShowExport(true)}
        style={{
          width: "100%", padding: "14px", borderRadius: 12,
          border: `1px solid ${C.border}`, background: C.white,
          boxShadow: "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)",
          fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink,
          cursor: "pointer", marginBottom: 14,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        Export Budget to Spreadsheet
      </button>

      {/* ═══ COST-PER-HOUR SCALE LEGEND ═══ */}
      {isPaid && (
        <div style={{ ...cardStyle, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
            Cost-per-hour scale
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { color: C.seaGreen, label: "Under $10/hr", sub: "Great value" },
              { color: C.blue, label: "$10\u2013$20/hr", sub: "Typical" },
              { color: C.lilac, label: "Over $20/hr", sub: "Premium" },
            ].map((item) => (
              <div key={item.label} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: item.color, margin: "0 auto 4px" }} />
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: item.color }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, fontStyle: "italic", textAlign: "center", marginTop: 8 }}>
            For comparison only -- not a value judgment
          </div>
        </div>
      )}

      {/* ═══ SCHOOL YEAR SNAPSHOT ═══ */}
      <div style={{
        padding: 16, borderRadius: 14,
        background: `linear-gradient(135deg, rgba(45,159,111,0.04), rgba(74,111,165,0.04))`,
        border: `1px solid rgba(45,159,111,0.08)`, marginBottom: 20,
      }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
          School Year Snapshot
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { label: "Break programs (committed)", value: fmt$(committedCost), color: C.seaGreen },
            { label: "Break programs (exploring)", value: fmt$(potentialCost), color: C.lilac },
            { label: "Estimated total", value: fmt$(grandTotal), color: C.ink, bold: true },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted }}>
                {row.label}
              </span>
              <span style={{
                fontFamily: "'Poppins', sans-serif", fontSize: row.bold ? 16 : 14,
                fontWeight: row.bold ? 700 : 600, color: row.color,
              }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ EMPTY STATE ═══ */}
      {filteredPrograms.length === 0 && visibleManualCosts.length === 0 && (
        <div style={s.emptyState}>
          <p>{selectedKid ? `No programs assigned to ${selectedKid.name || "this kid"} yet.` : "Add programs to see your budget breakdown."}</p>
        </div>
      )}

      {/* ═══ EXPORT SHEET (bottom sheet modal) ═══ */}
      {showExport && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div
            onClick={() => setShowExport(false)}
            style={{ flex: 1, background: "rgba(27,36,50,0.4)" }}
          />
          <div style={{
            background: C.white, borderRadius: "20px 20px 0 0",
            padding: "8px 20px 32px", maxHeight: "80vh", overflowY: "auto",
            boxShadow: "0 -4px 24px rgba(27,36,50,0.12)",
          }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 16px" }} />

            {exportDone ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, color: C.seaGreen, marginBottom: 4 }}>
                  Exported!
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted }}>
                  Check your downloads folder
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 600, color: C.ink, margin: "0 0 4px" }}>
                  Export Budget
                </h3>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, margin: "0 0 16px", lineHeight: 1.5 }}>
                  Download your activity costs as a spreadsheet.
                  {kidFilter && ` Filtered to ${selectedKid?.name || "selected kid"}.`}
                  {breakFilter !== "all" && ` Showing ${BREAK_PERIODS.find((b) => b.id === breakFilter)?.label || breakFilter} only.`}
                </p>

                {/* Preview table */}
                {buildExportRows().length > 0 && (
                  <div style={{ borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16 }}>
                    <div style={{ padding: "8px 12px", background: "rgba(45,159,111,0.06)", display: "flex", gap: 0 }}>
                      {["Child", "Activity", "Cost", "Status"].map((h, i) => (
                        <div key={h} style={{
                          flex: i === 1 ? 1.5 : i === 2 ? 0.7 : 1,
                          fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                          color: C.seaGreen, textTransform: "uppercase", letterSpacing: 0.3,
                        }}>{h}</div>
                      ))}
                    </div>
                    {buildExportRows().slice(0, 4).map((r, i) => (
                      <div key={i} style={{ padding: "6px 12px", display: "flex", gap: 0, borderTop: `1px solid ${C.border}` }}>
                        <div style={{ flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.ink }}>{r["Child"] || "--"}</div>
                        <div style={{ flex: 1.5, fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.ink, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r["Activity Name"]}</div>
                        <div style={{ flex: 0.7, fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.ink, textAlign: "right" }}>{fmt$(r["Cost"])}</div>
                        <div style={{ flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, textAlign: "right" }}>{r["Status"]}</div>
                      </div>
                    ))}
                    {buildExportRows().length > 4 && (
                      <div style={{ padding: "6px 12px", fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, fontStyle: "italic", borderTop: `1px solid ${C.border}` }}>
                        + {buildExportRows().length - 4} more rows...
                      </div>
                    )}
                  </div>
                )}

                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 16, textAlign: "center" }}>
                  {buildExportRows().length} rows will be exported
                </div>

                {/* Format buttons */}
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <button
                    onClick={() => doExport("xls")}
                    style={{
                      flex: 1, padding: 14, borderRadius: 12, border: "none",
                      background: C.seaGreen, color: "#FFFFFF",
                      fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: "0 4px 12px rgba(45,159,111,0.2)",
                    }}
                  >
                    Export .XLS
                  </button>
                  <button
                    onClick={() => doExport("csv")}
                    style={{
                      flex: 1, padding: 14, borderRadius: 12,
                      border: `1.5px solid ${C.blue}`, background: "transparent",
                      color: C.blue, fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    Export .CSV
                  </button>
                </div>

                <button
                  onClick={() => setShowExport(false)}
                  style={{
                    width: "100%", padding: 12, borderRadius: 10, border: "none",
                    background: "transparent", fontFamily: "'Barlow', sans-serif",
                    fontSize: 14, fontWeight: 500, color: C.muted, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
