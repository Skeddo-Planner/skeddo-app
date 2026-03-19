import { C, STATUS_MAP } from "../constants/brand";
import { s } from "../styles/shared";
import KidFilterBar from "../components/KidFilterBar";
import { fmt$ } from "../utils/helpers";

export default function BudgetTab({
  programs,
  kids,
  kidFilter,
  onKidFilter,
  enrolledPrograms,
  waitlistPrograms,
  exploringPrograms,
  totalCostEnrolled,
  totalCostAll,
  budgetGoal,
}) {
  /* Filter all program lists by kid if selected */
  const filterByKid = (list) =>
    kidFilter ? list.filter((p) => (p.kidIds || []).includes(kidFilter)) : list;

  const visiblePrograms = filterByKid(programs);
  const visibleEnrolled = filterByKid(enrolledPrograms);
  const visibleWaitlist = filterByKid(waitlistPrograms);
  const visibleExploring = filterByKid(exploringPrograms);

  const enrolledCost = visibleEnrolled.reduce((a, p) => a + Number(p.cost || 0), 0);
  const waitlistCost = visibleWaitlist.reduce((a, p) => a + Number(p.cost || 0), 0);
  const exploringCost = visibleExploring.reduce((a, p) => a + Number(p.cost || 0), 0);
  const allCost = enrolledCost + waitlistCost + exploringCost;

  const selectedKid = kidFilter ? kids.find((k) => k.id === kidFilter) : null;

  return (
    <div>
      <h2 style={s.pageTitle}>Budget</h2>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 16 }}>
        {selectedKid ? (
          <>
            Spending breakdown for{" "}
            <strong style={{ color: C.ink }}>{selectedKid.name}</strong>
          </>
        ) : (
          <>
            Programs cost{" "}
            <em style={{ fontFamily: "'Instrument Serif', serif", color: C.olive, fontStyle: "italic" }}>
              HOW much?!
            </em>{" "}
            Here's your breakdown.
          </>
        )}
      </p>

      {/* Kid filter */}
      <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />

      {/* Total overview card */}
      <div style={{ ...s.budgetCard, marginBottom: 16, padding: "18px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
          <div>
            <div style={s.budgetLabel}>{selectedKid ? `${selectedKid.name.toUpperCase()}'S BUDGET` : "TOTAL BUDGET"}</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: C.ink, lineHeight: 1.1, marginTop: 4 }}>
              {fmt$(allCost)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.seaGreen }}>
              {fmt$(enrolledCost)} committed
            </div>
          </div>
        </div>
        {/* Stacked progress bar */}
        {allCost > 0 && (
          <div style={{ height: 8, borderRadius: 4, background: C.cream, overflow: "hidden", display: "flex" }}>
            <div
              className="progress-bar"
              style={{
                width: `${(enrolledCost / allCost) * 100}%`,
                background: C.seaGreen,
                borderRadius: "4px 0 0 4px",
              }}
            />
            <div
              className="progress-bar"
              style={{
                width: `${(waitlistCost / allCost) * 100}%`,
                background: C.olive,
              }}
            />
            <div
              className="progress-bar"
              style={{
                width: `${(exploringCost / allCost) * 100}%`,
                background: C.blue,
                borderRadius: "0 4px 4px 0",
              }}
            />
          </div>
        )}
        {/* Legend */}
        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: C.seaGreen }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: C.muted, fontWeight: 600 }}>Enrolled</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: C.olive }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: C.muted, fontWeight: 600 }}>Waitlist</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: C.blue }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: C.muted, fontWeight: 600 }}>Exploring</span>
          </div>
        </div>

        {/* Budget goal progress */}
        {budgetGoal > 0 && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Budget Goal
              </span>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 14, color: C.ink }}>
                {fmt$(allCost)} / {fmt$(budgetGoal)}
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: C.cream, overflow: "hidden" }}>
              <div
                className="progress-bar"
                style={{
                  width: `${Math.min((allCost / budgetGoal) * 100, 100)}%`,
                  height: "100%",
                  borderRadius: 3,
                  background: allCost > budgetGoal ? C.danger : C.seaGreen,
                }}
              />
            </div>
            {allCost > budgetGoal && (
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.danger, fontWeight: 600, marginTop: 4 }}>
                Over budget by {fmt$(allCost - budgetGoal)}
              </div>
            )}
            {allCost <= budgetGoal && allCost > 0 && (
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.seaGreen, fontWeight: 600, marginTop: 4 }}>
                {fmt$(budgetGoal - allCost)} remaining
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div style={{ ...s.budgetCard, borderTop: `3px solid ${C.seaGreen}`, padding: "12px 14px" }}>
          <div style={{ ...s.budgetAmount, fontSize: 18 }}>{fmt$(enrolledCost)}</div>
          <div style={s.budgetLabel}>ENROLLED</div>
        </div>
        <div style={{ ...s.budgetCard, borderTop: `3px solid ${C.olive}`, padding: "12px 14px" }}>
          <div style={{ ...s.budgetAmount, fontSize: 18 }}>{fmt$(waitlistCost)}</div>
          <div style={s.budgetLabel}>WAITLIST</div>
        </div>
        <div style={{ ...s.budgetCard, borderTop: `3px solid ${C.blue}`, padding: "12px 14px" }}>
          <div style={{ ...s.budgetAmount, fontSize: 18 }}>{fmt$(exploringCost)}</div>
          <div style={s.budgetLabel}>EXPLORING</div>
        </div>
      </div>

      {/* Per Kid breakdown — only show when viewing All Kids */}
      {!kidFilter && kids.length > 0 && (
        <>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Per Kid</h3>
          </div>
          {kids.map((k) => {
            const kp = programs.filter((p) => (p.kidIds || []).includes(k.id));
            const kCost = kp.reduce((a, p) => a + Number(p.cost || 0), 0);
            return (
              <div
                key={k.id}
                style={{ ...s.budgetKidRow, cursor: "pointer" }}
                className="skeddo-card"
                onClick={() => onKidFilter(k.id)}
              >
                <div style={{ ...s.kidAvatar, width: 32, height: 32, fontSize: 14 }}>
                  {k.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 14, color: C.ink }}>
                    {k.name}
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>
                    {kp.length} program{kp.length !== 1 && "s"}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: C.ink }}>
                    {fmt$(kCost)}
                  </div>
                  <div style={{ color: C.muted, fontSize: 16 }}>&rsaquo;</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      <div style={{ ...s.sectionHeader, marginTop: 20 }}>
        <h3 style={s.sectionTitle}>{selectedKid ? `${selectedKid.name}'s Programs` : "All Programs"}</h3>
      </div>
      {[...visiblePrograms]
        .sort((a, b) => Number(b.cost || 0) - Number(a.cost || 0))
        .map((p) => {
          const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
          return (
            <div key={p.id} style={s.budgetRow}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 13, color: C.ink }}>
                  {p.name}
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                  {p.provider} · <span style={{ color: st.color }}>{p.status}</span>
                </div>
              </div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 17, color: C.ink }}>
                {fmt$(p.cost)}
              </div>
            </div>
          );
        })}

      {visiblePrograms.length === 0 && (
        <div style={s.emptyState}>
          <span style={{ fontSize: 28 }}>💰</span>
          <p>{selectedKid ? `No programs assigned to ${selectedKid.name} yet.` : "Add programs to see your budget breakdown."}</p>
        </div>
      )}
    </div>
  );
}
