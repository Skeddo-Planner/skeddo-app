import { useState, useMemo } from "react";
import { C, STATUS_MAP } from "../constants/brand";
import { s } from "../styles/shared";
import KidFilterBar from "../components/KidFilterBar";
import PromoBanner from "../components/PromoBanner";
import { fmt$, calcCostPerHour, costPerHourColor } from "../utils/helpers";
import { trackEvent } from "../utils/analytics";

export default function BudgetTab({
  programs, kids, kidFilter, onKidFilter,
  enrolledPrograms, waitlistPrograms, exploringPrograms,
  totalCostEnrolled, totalCostAll, budgetGoal,
  manualCosts, onAddCost, onEditCost, userId, planAccess, onSaveKid,
  onOpenDetail,
}) {
  const isPaid = planAccess.canUseBudgetTracking;
  const [showBanner, setShowBanner] = useState(true);
  const [sortBy, setSortBy] = useState("cost"); // cost | costPerHour | alpha | status
  const [editingBudget, setEditingBudget] = useState(null); // kid id or "overall"
  const [budgetInput, setBudgetInput] = useState("");

  /* Local toast for upgrade prompts */
  const [budgetToast, setBudgetToast] = useState(null);
  const showBudgetToast = (msg) => { setBudgetToast(msg); setTimeout(() => setBudgetToast(null), 2500); };

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

  const spentCost = enrolledCost + manualCostTotal;
  const potentialCost = waitlistCost + exploringCost;
  const grandTotal = spentCost + potentialCost;

  const selectedKid = kidFilter ? kids.find((k) => k.id === kidFilter) : null;

  // Per-kid budget: use kid's budgetGoal if set, otherwise fall back to overall
  const effectiveBudget = selectedKid
    ? (Number(selectedKid.budgetGoal) || 0)
    : kids.reduce((sum, k) => sum + (Number(k.budgetGoal) || 0), 0) || budgetGoal;

  // Budget goal progress colour
  const budgetPct = effectiveBudget > 0 ? (spentCost / effectiveBudget) * 100 : 0;
  const budgetBarColor = budgetPct > 90 ? STATUS_MAP.Waitlist.color : budgetPct > 75 ? C.lilac : STATUS_MAP.Enrolled.color;

  // Program list with cost-per-hour
  const programsWithCPH = useMemo(() =>
    visiblePrograms.map((p) => ({ ...p, cph: calcCostPerHour(p) })),
    [visiblePrograms]
  );

  // Sort
  const sortedPrograms = useMemo(() => {
    const list = [...programsWithCPH];
    const STATUS_ORDER = { Enrolled: 0, Waitlist: 1, Exploring: 2 };
    if (sortBy === "cost") list.sort((a, b) => Number(b.cost || 0) - Number(a.cost || 0));
    else if (sortBy === "costPerHour") list.sort((a, b) => (a.cph || Infinity) - (b.cph || Infinity));
    else if (sortBy === "alpha") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    else if (sortBy === "status") list.sort((a, b) => (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3) || Number(b.cost || 0) - Number(a.cost || 0));
    return list;
  }, [programsWithCPH, sortBy]);

  return (
    <div>
      <h2 style={s.pageTitle}>Budget</h2>
      {showBanner && !isPaid && <PromoBanner type="upgrade-budget" onDismiss={() => setShowBanner(false)} />}

      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: C.muted, marginBottom: 16 }}>
        {selectedKid ? (
          <>Spending breakdown for <strong style={{ color: C.ink }}>{selectedKid.name || "this kid"}</strong></>
        ) : (
          <>Programs cost <em style={{ fontFamily: "'Poppins', sans-serif", color: C.olive, fontStyle: "italic" }}>HOW much?!</em> Here's your breakdown.</>
        )}
      </p>

      <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />

      {/* ─── Budget Summary Card ─── */}
      <div style={{ ...s.budgetCard, marginBottom: 16, padding: "18px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={s.budgetLabel}>
              {selectedKid ? `${(selectedKid.name || "").toUpperCase()}'S TOTAL` : "GRAND TOTAL"}
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, color: C.ink, lineHeight: 1.1, marginTop: 4 }}>
              {fmt$(grandTotal)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, marginTop: 4 }}>
            <button
              onClick={() => {
                if (!isPaid) { showBudgetToast("Upgrade to Skeddo Plus for budget tracking"); return; }
                if (selectedKid) {
                  setEditingBudget(selectedKid.id);
                  setBudgetInput(String(selectedKid.budgetGoal || ""));
                } else if (kids.length === 0) {
                  // No kids — nothing to set budget for
                  return;
                } else if (kids.length === 1) {
                  setEditingBudget(kids[0].id);
                  setBudgetInput(String(kids[0].budgetGoal || ""));
                } else {
                  // Show kid selection — for now, prompt for first kid without a budget
                  const kidWithout = kids.find((k) => !k.budgetGoal);
                  const target = kidWithout || kids[0];
                  setEditingBudget(target.id);
                  setBudgetInput(String(target.budgetGoal || ""));
                }
              }}
              style={{
                background: isPaid ? C.blue : "#9CA3AF", color: "#fff", border: "none",
                borderRadius: 10, padding: "8px 14px", fontSize: 14, fontWeight: 700,
                fontFamily: "'Barlow', sans-serif", cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              Set Budget
            </button>
              <button
                onClick={() => { if (!isPaid) { showBudgetToast("Upgrade to Skeddo Plus for budget tracking"); return; } onAddCost(); }}
                style={{
                  background: isPaid ? C.seaGreen : "#9CA3AF", color: "#fff", border: "none",
                  borderRadius: 10, padding: "8px 14px", fontSize: 14, fontWeight: 700,
                  fontFamily: "'Barlow', sans-serif", cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                + Add Expense
              </button>
          </div>
        </div>

      </div>

      {/* ─── Gated content: blur overlay for free users ─── */}
      <div style={{ position: "relative" }}>
      {!isPaid && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10,
          background: "linear-gradient(to bottom, transparent 0%, rgba(250,248,243,0.95) 60%)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          borderRadius: 14,
        }}>
          <div style={{
            background: C.white, borderRadius: 16, padding: "28px 24px",
            boxShadow: "0 8px 32px rgba(26,46,38,0.12)", textAlign: "center", maxWidth: 320,
            border: `1.5px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>&#128274;</div>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, color: C.ink, marginBottom: 8 }}>
              Unlock Budget Tracking
            </h3>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.6, margin: 0 }}>
              See spending per kid, track expenses, and stay on top of your budget with Skeddo Plus.
            </p>
          </div>
        </div>
      )}
      <div style={!isPaid ? { filter: "blur(6px)", pointerEvents: "none", opacity: 0.7 } : undefined}>

      {/* ─── Set Budget per Kid (inline editor) ─── */}
      {editingBudget && (
        <div style={{ ...s.budgetCard, marginBottom: 16, padding: "16px" }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
            Set Budget by Kid
          </div>
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
                      style={{
                        ...s.input, width: 80, padding: "6px 8px", fontSize: 14, textAlign: "right",
                      }}
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
                      padding: "4px 10px", fontSize: 13, fontWeight: 600, color: k.budgetGoal ? C.ink : C.muted,
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

      {/* ─── Budget Bar Chart (stacked segments by status) ─── */}
      {(() => {
        const totalSpend = enrolledCost + manualCostTotal + waitlistCost + exploringCost;
        const total = effectiveBudget > 0 ? effectiveBudget : totalSpend || 1;
        const enrolledPct = (enrolledCost + manualCostTotal) / total * 100;
        const waitlistPct = waitlistCost / total * 100;
        const exploringPct = exploringCost / total * 100;
        const overBudget = effectiveBudget > 0 && totalSpend > effectiveBudget;
        const underBudgetAmt = effectiveBudget > 0 ? effectiveBudget - totalSpend : 0;
        const overflowAmt = overBudget ? totalSpend - effectiveBudget : 0;

        return (
          <div style={{ ...s.budgetCard, marginBottom: 16, padding: "16px 16px" }}>
            {effectiveBudget > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Budget Goal: {fmt$(effectiveBudget)}
                </span>
              </div>
            )}
            {/* Stacked bar — enrolled (green) | waitlist (terracotta) | exploring (blue) */}
            <div style={{ height: 28, borderRadius: 8, background: "#E5E7EB", overflow: "hidden", display: "flex", position: "relative" }}>
              {(enrolledCost + manualCostTotal) > 0 && (
                <div
                  className="progress-bar"
                  style={{
                    width: `${Math.min(enrolledPct, 100)}%`, height: "100%",
                    background: STATUS_MAP.Enrolled.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "width 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)",
                  }}
                >
                  {enrolledPct > 15 && (
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                      {fmt$(enrolledCost + manualCostTotal)}
                    </span>
                  )}
                </div>
              )}
              {waitlistCost > 0 && (
                <div
                  className="progress-bar"
                  style={{
                    width: `${Math.min(waitlistPct, 100 - enrolledPct)}%`, height: "100%",
                    background: STATUS_MAP.Waitlist.color, opacity: 0.85,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "width 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)",
                  }}
                >
                  {waitlistPct > 15 && (
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                      {fmt$(waitlistCost)}
                    </span>
                  )}
                </div>
              )}
              {exploringCost > 0 && (
                <div
                  className="progress-bar"
                  style={{
                    width: `${Math.min(exploringPct, 100 - enrolledPct - waitlistPct)}%`, height: "100%",
                    background: STATUS_MAP.Exploring.color, opacity: 0.7,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "width 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)",
                  }}
                >
                  {exploringPct > 15 && (
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                      {fmt$(exploringCost)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Labels below bar — one per status */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, flexWrap: "wrap", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: STATUS_MAP.Enrolled.color }} />
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.ink }}>
                  {fmt$(enrolledCost + manualCostTotal)} enrolled
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: STATUS_MAP.Waitlist.color }} />
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.muted }}>
                  {fmt$(waitlistCost)} waitlist
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: STATUS_MAP.Exploring.color }} />
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.muted }}>
                  {fmt$(exploringCost)} exploring
                </span>
              </div>
            </div>
            {effectiveBudget > 0 && (
              <div style={{ marginTop: 6 }}>
                {overBudget ? (
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: STATUS_MAP.Waitlist.color }}>
                    {fmt$(overflowAmt)} over budget
                  </span>
                ) : (
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: STATUS_MAP.Enrolled.color }}>
                    {fmt$(underBudgetAmt)} under budget
                  </span>
                )}
              </div>
            )}

            {!effectiveBudget && (
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 8, margin: "8px 0 0" }}>
                Set a budget per kid to see how much room you have left.
              </p>
            )}
          </div>
        );
      })()}

      {/* ─── Spent vs Potential ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <div style={{ ...s.budgetCard, borderLeft: `3px solid ${STATUS_MAP.Enrolled.color}`, padding: "14px 16px" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink }}>
            {fmt$(spentCost)}
          </div>
          <div style={s.budgetLabel}>SPENT</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>
            {visibleEnrolled.length} enrolled{manualCostTotal !== 0 ? ` + ${visibleManualCosts.length} expenses` : ""}
          </div>
        </div>
        <div style={{
          ...s.budgetCard, padding: "14px 16px",
          borderLeft: `3px dashed ${C.muted}`,
        }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.muted }}>
            {fmt$(potentialCost)}
          </div>
          <div style={{ ...s.budgetLabel, color: C.muted }}>POTENTIAL</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>
            {visibleWaitlist.length} waitlist + {visibleExploring.length} exploring
          </div>
        </div>
      </div>

      {/* ─── Per Kid Breakdown (Plus only) ─── */}
      {isPaid && !kidFilter && kids.length > 0 && (
        <>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Per Kid</h3>
          </div>
          {kids.map((k) => {
            const kPrograms = programs.filter((p) => (p.kidIds || []).includes(k.id));
            const kEnrolledCost = kPrograms.filter((p) => p.status === "Enrolled").reduce((a, p) => a + Number(p.cost || 0), 0);
            const kWaitlistCost = kPrograms.filter((p) => p.status === "Waitlist").reduce((a, p) => a + Number(p.cost || 0), 0);
            const kExploringCost = kPrograms.filter((p) => p.status === "Exploring").reduce((a, p) => a + Number(p.cost || 0), 0);
            const kManual = (manualCosts || []).filter((c) => c.kidId === k.id).reduce((a, c) => a + Number(c.amount || 0), 0);
            const kSpent = kEnrolledCost + kManual;
            const kPotential = kWaitlistCost + kExploringCost;
            const kBudget = Number(k.budgetGoal) || 0;
            const kTotal = kBudget || (kSpent + kPotential) || 1;
            const kSpentPct = (kSpent / kTotal) * 100;
            const kWaitlistPct = (kWaitlistCost / kTotal) * 100;
            const kExploringPct = (kExploringCost / kTotal) * 100;
            const kOver = kBudget > 0 && (kSpent + kPotential) > kBudget;
            return (
              <div
                key={k.id}
                style={{ ...s.budgetCard, cursor: "pointer", padding: "14px 16px", marginBottom: 10 }}
                className="skeddo-card"
                onClick={() => onKidFilter(k.id)}
                role="button"
                tabIndex={0}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ ...s.kidAvatar, width: 32, height: 32, fontSize: 14, borderRadius: 8, background: k.color || s.kidAvatar.background }}>
                    {k.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 16, color: C.ink }}>
                      {k.name}
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>
                      {kPrograms.length} program{kPrograms.length !== 1 ? "s" : ""}
                      {kBudget > 0 && ` · Budget: ${fmt$(kBudget)}`}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: C.ink }}>
                      {fmt$(kSpent)}
                    </div>
                    {kPotential > 0 && (
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
                        +{fmt$(kPotential)} potential
                      </div>
                    )}
                  </div>
                </div>
                {/* Mini bar chart — enrolled (green) | waitlist (terracotta) | exploring (blue) */}
                <div style={{ height: 8, borderRadius: 4, background: "#E5E7EB", overflow: "hidden", display: "flex" }}>
                  {kSpent > 0 && (
                    <div style={{
                      width: `${Math.min(kSpentPct, 100)}%`, height: "100%",
                      background: STATUS_MAP.Enrolled.color,
                      transition: "width 0.4s ease",
                    }} />
                  )}
                  {kWaitlistCost > 0 && (
                    <div style={{
                      width: `${Math.min(kWaitlistPct, 100 - Math.min(kSpentPct, 100))}%`, height: "100%",
                      background: STATUS_MAP.Waitlist.color,
                      opacity: 0.85,
                      transition: "width 0.4s ease",
                    }} />
                  )}
                  {kExploringCost > 0 && (
                    <div style={{
                      width: `${Math.min(kExploringPct, 100 - Math.min(kSpentPct, 100) - Math.min(kWaitlistPct, 100))}%`, height: "100%",
                      background: STATUS_MAP.Exploring.color,
                      opacity: 0.7,
                      transition: "width 0.4s ease",
                    }} />
                  )}
                </div>
                {/* Per-kid status labels */}
                <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                  {kEnrolledCost > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: STATUS_MAP.Enrolled.color }} />
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.ink }}>
                        {fmt$(kEnrolledCost)} enrolled
                      </span>
                    </div>
                  )}
                  {kWaitlistCost > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: STATUS_MAP.Waitlist.color }} />
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.muted }}>
                        {fmt$(kWaitlistCost)} waitlist
                      </span>
                    </div>
                  )}
                  {kExploringCost > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: STATUS_MAP.Exploring.color }} />
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.muted }}>
                        {fmt$(kExploringCost)} exploring
                      </span>
                    </div>
                  )}
                </div>
                {kBudget > 0 && (
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: kOver ? STATUS_MAP.Waitlist.color : STATUS_MAP.Enrolled.color, marginTop: 4 }}>
                    {kOver
                      ? `${fmt$((kSpent + kPotential) - kBudget)} over budget`
                      : `${fmt$(kBudget - kSpent - kPotential)} remaining`
                    }
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* ─── Program Cost List ─── */}
      <div style={{ ...s.sectionHeader, marginTop: 20 }}>
        <h3 style={s.sectionTitle}>
          {selectedKid ? `${selectedKid.name || "Kid"}'s Programs` : "All Programs"}
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
          <option value="status">By Status</option>
        </select>
      </div>

      {sortedPrograms.map((p) => {
        const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
        const cphColor = costPerHourColor(p.cph);
        return (
          <div
            key={p.id}
            style={{ ...s.budgetRow, alignItems: "flex-start", cursor: "pointer", borderLeft: `3px solid ${st.color}`, paddingLeft: 12 }}
            onClick={() => onOpenDetail && onOpenDetail(p)}
            role="button"
            tabIndex={0}
            className="skeddo-card"
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 16, color: C.ink }}>
                {p.name}
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
                {p.provider} · <span style={{ color: st.color }}>{p.status}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, color: C.ink }}>
                {fmt$(p.cost)}
              </div>
              {isPaid && (p.cph != null ? (
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: cphColor }}>
                  {fmt$(p.cph)}/hr
                </div>
              ) : (
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: C.muted }}>
                  — no times
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* ─── Manual Cost Entries (Plus only) ─── */}
      {isPaid && visibleManualCosts.length > 0 && (
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
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 16, color: C.ink }}>
                      {c.description}
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
                      {c.category}{kid ? ` · ${kid.name}` : ""}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontFamily: "'Poppins', sans-serif", fontSize: 17,
                  color: isNegative ? C.seaGreen : C.ink,
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
          <p>{selectedKid ? `No programs assigned to ${selectedKid.name || "this kid"} yet.` : "Add programs to see your budget breakdown."}</p>
        </div>
      )}

      </div>{/* end blur content */}
      </div>{/* end blur wrapper */}

      {/* Budget upgrade toast */}
      {budgetToast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 90,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.ink,
            color: C.cream,
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            padding: "12px 20px",
            borderRadius: 10,
            boxShadow: "0 4px 16px rgba(27,36,50,0.2)",
            zIndex: 9999,
            animation: "fadeIn 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          {budgetToast}
        </div>
      )}
    </div>
  );
}
