import { useState, useMemo } from "react";
import { C, STATUS_MAP } from "../constants/brand";
import { s } from "../styles/shared";
import KidFilterBar from "../components/KidFilterBar";
import PromoBanner from "../components/PromoBanner";
import { fmt$, calcCostPerHour, costPerHourColor } from "../utils/helpers";

export default function BudgetTab({
  programs, kids, kidFilter, onKidFilter,
  enrolledPrograms, waitlistPrograms, exploringPrograms,
  totalCostEnrolled, totalCostAll, budgetGoal,
  manualCosts, onAddCost, onEditCost, userId, userPlan,
}) {
  const isPaid = userPlan === "plus" || userPlan === "pro";
  const [showBanner, setShowBanner] = useState(true);
  const [sortBy, setSortBy] = useState("cost"); // cost | costPerHour | alpha

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

  // Budget goal progress colour
  const budgetPct = budgetGoal > 0 ? (committedCost / budgetGoal) * 100 : 0;
  const budgetBarColor = budgetPct > 90 ? "#E76F51" : budgetPct > 75 ? "#F4A261" : "#2D9F6F";

  // Program list with cost-per-hour
  const programsWithCPH = useMemo(() =>
    visiblePrograms.map((p) => ({ ...p, cph: calcCostPerHour(p) })),
    [visiblePrograms]
  );

  // Sort
  const sortedPrograms = useMemo(() => {
    const list = [...programsWithCPH];
    if (sortBy === "cost") list.sort((a, b) => Number(b.cost || 0) - Number(a.cost || 0));
    else if (sortBy === "costPerHour") list.sort((a, b) => (a.cph || Infinity) - (b.cph || Infinity));
    else if (sortBy === "alpha") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return list;
  }, [programsWithCPH, sortBy]);

  return (
    <div>
      <h2 style={s.pageTitle}>Budget</h2>
      {showBanner && !isPaid && <PromoBanner type="upgrade-budget" onDismiss={() => setShowBanner(false)} />}

      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: C.muted, marginBottom: 16 }}>
        {selectedKid ? (
          <>Spending breakdown for <strong style={{ color: C.ink }}>{selectedKid.name}</strong></>
        ) : (
          <>Programs cost <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: C.olive, fontStyle: "italic" }}>HOW much?!</em> Here's your breakdown.</>
        )}
      </p>

      <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />

      {/* ─── Budget Summary Card ─── */}
      <div style={{ ...s.budgetCard, marginBottom: 16, padding: "18px 16px" }}>
        <div style={s.budgetLabel}>
          {selectedKid ? `${selectedKid.name.toUpperCase()}'S TOTAL` : "GRAND TOTAL"}
        </div>
        <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, color: C.ink, lineHeight: 1.1, marginTop: 4 }}>
          {fmt$(grandTotal)}
        </div>

        {/* Budget goal progress */}
        {budgetGoal > 0 ? (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Budget Goal
              </span>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink }}>
                {fmt$(committedCost)} / {fmt$(budgetGoal)}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: C.cream, overflow: "hidden" }}>
              <div className="progress-bar" style={{
                width: `${Math.min(budgetPct, 100)}%`,
                height: "100%", borderRadius: 4, background: budgetBarColor,
              }} />
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, marginTop: 4,
              color: committedCost > budgetGoal ? "#E76F51" : "#2D9F6F",
            }}>
              {committedCost > budgetGoal
                ? `Over budget by ${fmt$(committedCost - budgetGoal)}`
                : `${fmt$(budgetGoal - committedCost)} remaining`
              }
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginTop: 8 }}>
            Set a budget in your profile to track your spending.
          </p>
        )}
      </div>

      {/* ─── Committed vs Potential ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <div style={{ ...s.budgetCard, borderLeft: `3px solid #2D9F6F`, padding: "14px 16px" }}>
          <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, color: C.ink }}>
            {fmt$(committedCost)}
          </div>
          <div style={s.budgetLabel}>COMMITTED</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>
            {visibleEnrolled.length} enrolled{manualCostTotal !== 0 ? ` + ${visibleManualCosts.length} expenses` : ""}
          </div>
        </div>
        <div style={{
          ...s.budgetCard, padding: "14px 16px",
          borderLeft: `3px dashed ${C.muted}`,
        }}>
          <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, color: C.muted }}>
            {fmt$(potentialCost)}
          </div>
          <div style={{ ...s.budgetLabel, color: C.muted }}>POTENTIAL</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>
            {visibleWaitlist.length} waitlist + {visibleExploring.length} exploring
          </div>
        </div>
      </div>

      {/* ─── Per Kid Breakdown ─── */}
      {!kidFilter && kids.length > 0 && (
        <>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Per Kid</h3>
          </div>
          {kids.map((k) => {
            const kPrograms = programs.filter((p) => (p.kidIds || []).includes(k.id));
            const kEnrolled = kPrograms.filter((p) => p.status === "Enrolled").reduce((a, p) => a + Number(p.cost || 0), 0);
            const kPotential = kPrograms.filter((p) => p.status !== "Enrolled").reduce((a, p) => a + Number(p.cost || 0), 0);
            const kManual = (manualCosts || []).filter((c) => c.kidId === k.id).reduce((a, c) => a + Number(c.amount || 0), 0);
            const kCommitted = kEnrolled + kManual;
            return (
              <div
                key={k.id}
                style={{ ...s.budgetKidRow, cursor: "pointer" }}
                className="skeddo-card"
                onClick={() => onKidFilter(k.id)}
                role="button"
                tabIndex={0}
              >
                <div style={{ ...s.kidAvatar, width: 32, height: 32, fontSize: 14, background: k.color || s.kidAvatar.background }}>
                  {k.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 14, color: C.ink }}>
                    {k.name}
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
                    {kPrograms.length} program{kPrograms.length !== 1 ? "s" : ""}
                    {kPotential > 0 && ` · ${fmt$(kPotential)} potential`}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 18, color: C.ink }}>
                    {fmt$(kCommitted)}
                  </div>
                  <div style={{ color: C.muted, fontSize: 16 }}>&rsaquo;</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* ─── Program Cost List ─── */}
      <div style={{ ...s.sectionHeader, marginTop: 20 }}>
        <h3 style={s.sectionTitle}>
          {selectedKid ? `${selectedKid.name}'s Programs` : "All Programs"}
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
            color: C.seaGreen, background: "none", border: `1px solid ${C.border}`,
            borderRadius: 6, padding: "4px 8px", cursor: "pointer",
          }}
        >
          <option value="cost">Highest Cost</option>
          <option value="costPerHour">Best Value ($/hr)</option>
          <option value="alpha">A-Z</option>
        </select>
      </div>

      {sortedPrograms.map((p) => {
        const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
        const cphColor = costPerHourColor(p.cph);
        return (
          <div key={p.id} style={{ ...s.budgetRow, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 14, color: C.ink }}>
                {p.name}
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
                {p.provider} · <span style={{ color: st.color }}>{p.status}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 17, color: C.ink }}>
                {fmt$(p.cost)}
              </div>
              {p.cph != null ? (
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: cphColor }}>
                  {fmt$(p.cph)}/hr
                </div>
              ) : (
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: C.muted }}>
                  — no times
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ─── Manual Cost Entries ─── */}
      {visibleManualCosts.length > 0 && (
        <>
          <div style={{ ...s.sectionHeader, marginTop: 16 }}>
            <h3 style={s.sectionTitle}>Expenses</h3>
          </div>
          {visibleManualCosts.map((c) => {
            const kid = kids.find((k) => k.id === c.kidId);
            const isNegative = c.amount < 0;
            return (
              <div
                key={c.id}
                style={{ ...s.budgetRow, cursor: "pointer" }}
                onClick={() => onEditCost && onEditCost(c)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  <span style={{ fontSize: 16 }}>{isNegative ? "\uD83C\uDF1F" : "\uD83E\uDDFE"}</span>
                  <div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 14, color: C.ink }}>
                      {c.description}
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
                      {c.category}{kid ? ` · ${kid.name}` : ""}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 17,
                  color: isNegative ? "#2D9F6F" : C.ink,
                }}>
                  {isNegative ? `-${fmt$(Math.abs(c.amount))}` : fmt$(c.amount)}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* ─── Empty State ─── */}
      {sortedPrograms.length === 0 && visibleManualCosts.length === 0 && (
        <div style={s.emptyState}>
          <span style={{ fontSize: 28 }}>{"\uD83D\uDCB0"}</span>
          <p>{selectedKid ? `No programs assigned to ${selectedKid.name} yet.` : "Add programs to see your budget breakdown."}</p>
        </div>
      )}

      {/* ─── Add Expense Button ─── */}
      <button
        onClick={onAddCost}
        style={{
          position: "fixed", bottom: 80, right: "calc(50% - 220px)",
          background: C.seaGreen, color: "#fff", border: "none",
          borderRadius: 28, padding: "12px 20px", fontSize: 14, fontWeight: 700,
          fontFamily: "'Barlow', sans-serif", cursor: "pointer",
          boxShadow: "0 4px 12px rgba(45,159,111,0.3)",
          display: "flex", alignItems: "center", gap: 6,
          zIndex: 50,
        }}
      >
        + Add Expense
      </button>
    </div>
  );
}
