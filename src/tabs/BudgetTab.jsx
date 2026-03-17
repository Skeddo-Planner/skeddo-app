import { C, STATUS_MAP } from "../constants/brand";
import { s } from "../styles/shared";

export default function BudgetTab({
  programs,
  kids,
  enrolledPrograms,
  waitlistPrograms,
  exploringPrograms,
  totalCostEnrolled,
  totalCostAll,
  fmt$,
}) {
  const waitlistCost = waitlistPrograms.reduce((a, p) => a + Number(p.cost || 0), 0);
  const exploringCost = exploringPrograms.reduce((a, p) => a + Number(p.cost || 0), 0);

  return (
    <div>
      <h2 style={s.pageTitle}>Budget</h2>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 16 }}>
        Summer camps cost{" "}
        <em style={{ fontFamily: "'Instrument Serif', serif", color: C.olive, fontStyle: "italic" }}>
          HOW much?!
        </em>{" "}
        Here's your breakdown.
      </p>

      {/* Total overview card */}
      <div style={{ ...s.budgetCard, marginBottom: 16, padding: "18px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
          <div>
            <div style={s.budgetLabel}>TOTAL BUDGET</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: C.ink, lineHeight: 1.1, marginTop: 4 }}>
              {fmt$(totalCostAll)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.seaGreen }}>
              {fmt$(totalCostEnrolled)} committed
            </div>
          </div>
        </div>
        {/* Stacked progress bar */}
        {totalCostAll > 0 && (
          <div style={{ height: 8, borderRadius: 4, background: C.cream, overflow: "hidden", display: "flex" }}>
            <div
              className="progress-bar"
              style={{
                width: `${(totalCostEnrolled / totalCostAll) * 100}%`,
                background: C.seaGreen,
                borderRadius: "4px 0 0 4px",
              }}
            />
            <div
              className="progress-bar"
              style={{
                width: `${(waitlistCost / totalCostAll) * 100}%`,
                background: C.olive,
              }}
            />
            <div
              className="progress-bar"
              style={{
                width: `${(exploringCost / totalCostAll) * 100}%`,
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
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div style={{ ...s.budgetCard, borderTop: `3px solid ${C.seaGreen}`, padding: "12px 14px" }}>
          <div style={{ ...s.budgetAmount, fontSize: 18 }}>{fmt$(totalCostEnrolled)}</div>
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

      {kids.length > 0 && (
        <>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Per Kid</h3>
          </div>
          {kids.map((k) => {
            const kp = programs.filter((p) => (p.kidIds || []).includes(k.id));
            const kCost = kp.reduce((a, p) => a + Number(p.cost || 0), 0);
            return (
              <div key={k.id} style={s.budgetKidRow}>
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
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: C.ink }}>
                  {fmt$(kCost)}
                </div>
              </div>
            );
          })}
        </>
      )}

      <div style={{ ...s.sectionHeader, marginTop: 20 }}>
        <h3 style={s.sectionTitle}>All Programs</h3>
      </div>
      {[...programs]
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

      {programs.length === 0 && (
        <div style={s.emptyState}>
          <span style={{ fontSize: 28 }}>💰</span>
          <p>Add programs to see your budget breakdown.</p>
        </div>
      )}
    </div>
  );
}
