import { useMemo, useState } from "react";
import { C, STATUS_MAP } from "../constants/brand";
import { s } from "../styles/shared";
import PromoBanner from "../components/PromoBanner";
import { fmt$ } from "../utils/helpers";

/* ─── Helper: format a date as "Mon DD" ─── */
function fmtDate(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ─── Chevron arrow SVG (replaces lucide-react) ─── */
function ChevronRight({ size = 16, color = C.muted }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/* ─── Section header ─── */
function SectionHeader({ label, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
      {action && (
        <span
          onClick={onAction}
          role="button"
          tabIndex={0}
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: C.seaGreen, cursor: "pointer" }}
        >{action} →</span>
      )}
    </div>
  );
}

/* ─── Kid pill button ─── */
function KidPill({ kid, enrolledCount, active, onClick, onEdit }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 16px 8px 8px", borderRadius: 24,
      background: active ? C.white : "rgba(27,36,50,0.03)",
      border: active ? `2px solid ${C.seaGreen}` : "2px solid rgba(27,36,50,0.08)",
      boxShadow: active ? "0 2px 8px rgba(45,159,111,0.15)" : "none",
      cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0,
      fontFamily: "'Barlow', sans-serif", position: "relative",
    }}>
      <div
        onClick={(e) => { e.stopPropagation(); onEdit && onEdit(kid); }}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: active ? (kid.color || C.seaGreen) : "rgba(27,36,50,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: active ? C.white : C.muted,
          fontSize: 15, fontWeight: 700, transition: "all 0.2s",
          cursor: "pointer",
        }}
      >
        {kid.name?.[0]?.toUpperCase() || "?"}
      </div>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, lineHeight: 1.2 }}>{kid.name}</div>
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.2 }}>{enrolledCount} enrolled</div>
      </div>
    </button>
  );
}

/* ─── Alert card with accent border ─── */
function AlertCard({ icon, text, color, onAction }) {
  return (
    <div onClick={onAction} role="button" tabIndex={0} style={{
      background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)",
      padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
      borderLeft: `3px solid ${color}`, cursor: "pointer", transition: "box-shadow 0.2s",
    }}>
      <span style={{
        width: 36, height: 36, borderRadius: 10, background: `${color}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.ink, fontWeight: 500, lineHeight: 1.4 }}>{text}</div>
      </div>
      <ChevronRight size={16} color={color} />
    </div>
  );
}

/* ─── Circle activity card ─── */
function CircleCard({ icon, iconBg, title, subtitle, color, onAction }) {
  return (
    <div onClick={onAction} role="button" tabIndex={0} style={{
      background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)",
      padding: "12px 14px", borderLeft: `3px solid ${color}`,
      display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: iconBg, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.ink, lineHeight: 1.4 }}>{title}</div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>{subtitle}</div>
      </div>
      <ChevronRight size={16} color={color} />
    </div>
  );
}

/* ─── Compact program row for This Week / Next Week ─── */
function ProgramRow({ p, kids, onTap }) {
  const status = STATUS_MAP[p.status] || STATUS_MAP.Enrolled;
  const assignedKids = (p.kidIds || []).map((id) => kids.find((k) => k.id === id)).filter(Boolean);
  return (
    <div onClick={onTap} role="button" tabIndex={0} style={{
      background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)",
      borderLeft: `3px solid ${status.color}`, padding: "12px 14px",
      display: "flex", flexDirection: "column", gap: 4, cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600, color: C.ink }}>{p.name}</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>{p.provider}</div>
        </div>
        <span style={{
          background: status.bg, color: status.color, padding: "3px 10px", borderRadius: 6,
          fontSize: 11, fontWeight: 700, fontFamily: "'Barlow', sans-serif", whiteSpace: "nowrap", flexShrink: 0,
        }}>{p.status === "Enrolled" ? "\u2713 Enrolled" : p.status}</span>
      </div>
      {assignedKids.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
          {assignedKids.map((k) => (
            <span key={k.id} style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.muted,
              background: "rgba(74,111,165,0.08)", padding: "2px 8px", borderRadius: 4,
            }}>{k.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HOME TAB v3
   ═══════════════════════════════════════════════════ */
export default function HomeTab({
  enrolledPrograms,
  waitlistPrograms,
  exploringPrograms,
  totalCostEnrolled,
  kids,
  onOpenDetail,
  onCycleStatus,
  onNavigateToTab,
  onOpenAddProgram,
  onOpenAddKid,
  onEditKid,
  installPrompt,
  showInstallBanner,
  onInstallClick,
  onDismissInstall,
  activityLog,
  planAccess,
  programs,
  onInviteCoParent,
  profile,
  circlesHook,
  childAccess,
}) {
  const allPrograms = useMemo(() => [...enrolledPrograms, ...waitlistPrograms, ...exploringPrograms], [enrolledPrograms, waitlistPrograms, exploringPrograms]);
  const isPaid = planAccess.isPaid;
  const [dismissedBanners, setDismissBanner] = useState(new Set());
  const dismissBanner = (id) => setDismissBanner((prev) => new Set(prev).add(id));
  const showKidsBanner = !isPaid && kids.length > 1 && !dismissedBanners.has("upgrade-kids");

  /* ── Kid filter state ── */
  const [activeKidId, setActiveKidId] = useState(null);

  /* ── Filter all program lists by selected kid ── */
  const filterByKid = (list) => {
    if (!activeKidId) return list;
    return list.filter((p) => (p.kidIds || []).includes(activeKidId));
  };
  const fEnrolled = useMemo(() => filterByKid(enrolledPrograms), [activeKidId, enrolledPrograms]);
  const fWaitlist = useMemo(() => filterByKid(waitlistPrograms), [activeKidId, waitlistPrograms]);
  const fExploring = useMemo(() => filterByKid(exploringPrograms), [activeKidId, exploringPrograms]);
  const fAll = useMemo(() => [...fEnrolled, ...fWaitlist, ...fExploring], [fEnrolled, fWaitlist, fExploring]);

  /* ── Total spent (filtered) ── */
  const filteredSpent = useMemo(() => fEnrolled.reduce((sum, p) => sum + (Number(p.cost) || 0), 0), [fEnrolled]);
  const filteredPending = useMemo(() => [...fWaitlist, ...fExploring].reduce((sum, p) => sum + (Number(p.cost) || 0), 0), [fWaitlist, fExploring]);
  const budgetGoal = Number(profile?.budgetGoal) || 0;

  /* ── Needs Attention alerts (computed dynamically) ── */
  const alerts = useMemo(() => {
    const items = [];
    // Waitlisted programs
    fWaitlist.forEach((p) => {
      items.push({
        icon: "\u23F3",
        text: `You're on the waitlist for ${p.name}`,
        color: C.olive,
        action: () => onOpenDetail(p),
      });
    });
    // Registration deadlines within 14 days
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const in14 = new Date(now);
    in14.setDate(in14.getDate() + 14);
    fAll.forEach((p) => {
      if (p.registrationDeadline) {
        const dl = new Date(p.registrationDeadline + "T00:00:00");
        if (dl >= now && dl <= in14) {
          items.push({
            icon: "\uD83D\uDCC5",
            text: `${p.name} registration closes ${fmtDate(dl)}`,
            color: C.lilac,
            action: () => onOpenDetail(p),
          });
        }
      }
    });
    // Exploring count
    if (fExploring.length > 0) {
      items.push({
        icon: "\uD83D\uDC40",
        text: `${fExploring.length} program${fExploring.length > 1 ? "s" : ""} still exploring \u2014 decide before spots fill`,
        color: C.blue,
        action: () => onNavigateToTab("programs", "Exploring"),
      });
    }
    return items;
  }, [fWaitlist, fExploring, fAll, onOpenDetail, onNavigateToTab]);

  /* ── This Week: programs active this week ── */
  const thisWeekPrograms = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    // Start of this week (Monday)
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return fAll.filter((p) => {
      if (!p.startDate) return false;
      const start = new Date(p.startDate + "T00:00:00");
      const end = p.endDate ? new Date(p.endDate + "T00:00:00") : start;
      // Program overlaps with this week
      return start <= sunday && end >= monday;
    });
  }, [fAll]);

  /* ── Starting Next Week ── */
  const nextWeekPrograms = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dayOfWeek = now.getDay();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() - ((dayOfWeek + 6) % 7) + 7);
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    return fAll.filter((p) => {
      if (!p.startDate) return false;
      const start = new Date(p.startDate + "T00:00:00");
      // Starts within next week
      return start >= nextMonday && start <= nextSunday;
    });
  }, [fAll]);

  /* ── Circles data ── */
  const circles = circlesHook?.circles || [];
  const pendingRequests = circlesHook?.pendingRequests || [];
  const activeFeed = circlesHook?.activeFeed || [];
  const hasCircleActivity = pendingRequests.length > 0 || activeFeed.length > 0 || circles.length > 0;

  return (
    <div>
      <h2 style={s.pageTitle}>Home</h2>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: C.muted, marginBottom: 16 }}>
        {kids.length > 0
          ? <>Your family's summer planning at a glance</>
          : <>Welcome! Add a kid to get started</>}
      </p>

      {/* ══ 1. Kid Pills ══ */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
        {kids.map((k) => {
          const kidEnrolled = enrolledPrograms.filter((p) => (p.kidIds || []).includes(k.id)).length;
          return (
            <KidPill
              key={k.id}
              kid={k}
              enrolledCount={kidEnrolled}
              active={activeKidId === k.id}
              onClick={() => setActiveKidId(activeKidId === k.id ? null : k.id)}
              onEdit={onEditKid}
            />
          );
        })}
        {kids.length < planAccess.maxKids && (
          <button
            onClick={onOpenAddKid}
            aria-label="Add a new kid"
            style={{
              display: "flex", alignItems: "center", gap: 4, padding: "8px 16px", borderRadius: 24,
              background: "transparent", border: "1.5px dashed rgba(27,36,50,0.15)",
              color: C.seaGreen, fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}
          >+ Add kid</button>
        )}
      </div>

      {/* ══ 1b. Co-parent pills ══ */}
      {(() => {
        if (!childAccess) return null;
        const allCoParents = [];
        const seen = new Set();
        kids.forEach((k) => {
          const coParents = childAccess.getCoParents ? childAccess.getCoParents(k.id) : [];
          coParents.forEach((cp) => {
            if (!seen.has(cp.userId)) {
              seen.add(cp.userId);
              allCoParents.push(cp);
            }
          });
        });
        if (allCoParents.length === 0) return null;
        return (
          <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 2, alignItems: "center" }}>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", flexShrink: 0 }}>
              Co-parents
            </span>
            {allCoParents.map((cp) => (
              <div key={cp.userId} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 10px 4px 10px", borderRadius: 16,
                background: "rgba(27,36,50,0.04)", border: "1px solid rgba(27,36,50,0.08)",
                whiteSpace: "nowrap", flexShrink: 0,
                fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 500, color: C.ink,
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: C.lilac + "30", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: C.lilac, flexShrink: 0,
                }}>{(cp.displayName || "?")[0].toUpperCase()}</span>
                {cp.displayName || "Co-parent"}
                <button
                  onClick={() => {
                    if (window.confirm(`Remove ${cp.displayName || "this co-parent"} from all shared kids?`)) {
                      kids.forEach((k) => {
                        const kCoParents = childAccess.getCoParents ? childAccess.getCoParents(k.id) : [];
                        if (kCoParents.some((c) => c.userId === cp.userId)) {
                          childAccess.removeAccess(k.id, cp.userId).catch(() => {});
                        }
                      });
                    }
                  }}
                  aria-label={`Remove ${cp.displayName || "co-parent"}`}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: "0 0 0 2px", lineHeight: 1,
                    fontSize: 14, color: C.muted, fontWeight: 600,
                  }}
                >{"\u2715"}</button>
              </div>
            ))}
          </div>
        );
      })()}

      {/* ══ 2. Compact Stat Strip ══ */}
      <div style={{
        display: "flex", margin: "0 0 16px", padding: "10px 0",
        background: C.white, borderRadius: 12,
        boxShadow: "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)",
        overflow: "hidden",
      }}>
        {[
          { value: fEnrolled.length, label: "Enrolled", color: C.seaGreen, tap: () => onNavigateToTab("programs", "Enrolled") },
          { value: fWaitlist.length, label: "Waitlist", color: C.olive, tap: () => onNavigateToTab("programs", "Waitlist") },
          { value: fExploring.length, label: "Exploring", color: C.blue, tap: () => onNavigateToTab("programs", "Exploring") },
          { value: fmt$(filteredSpent), label: "Spent", color: C.lilac, tap: () => onNavigateToTab("budget") },
        ].map((stat, i, arr) => (
          <div
            key={i}
            onClick={stat.tap}
            role="button"
            tabIndex={0}
            aria-label={`${typeof stat.value === "number" ? stat.value : stat.value} ${stat.label}. Tap to view.`}
            style={{
              flex: 1, textAlign: "center", cursor: "pointer",
              borderRight: i < arr.length - 1 ? "1px solid rgba(27,36,50,0.06)" : "none",
              padding: "2px 0",
            }}
          >
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink, lineHeight: 1.1 }}>{stat.value}</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: stat.color, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ══ 3. Needs Attention ══ */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader label="Needs attention" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alerts.slice(0, 5).map((a, i) => (
              <AlertCard key={i} icon={a.icon} text={a.text} color={a.color} onAction={a.action} />
            ))}
          </div>
        </div>
      )}

      {/* ══ 4. From Your Circles ══ */}
      {hasCircleActivity && (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader label="From your circles" action="All circles" onAction={() => onNavigateToTab("circles")} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Pending join requests */}
            {pendingRequests.length > 0 && (
              <CircleCard
                icon={"\uD83D\uDC65"}
                iconBg="rgba(244,162,97,0.12)"
                title={<><span style={{ fontWeight: 600 }}>{pendingRequests.length} pending request{pendingRequests.length > 1 ? "s" : ""}</span></>}
                subtitle={pendingRequests[0]?.circleName || "Your circle"}
                color={C.lilac}
                onAction={() => onNavigateToTab("circles")}
              />
            )}
            {/* Recent feed items */}
            {activeFeed.slice(0, 2).map((item, i) => (
              <CircleCard
                key={i}
                icon={"\uD83D\uDD25"}
                iconBg="rgba(244,162,97,0.12)"
                title={<span style={{ fontWeight: 500 }}>{item.userName || "Someone"} shared <span style={{ fontWeight: 600 }}>{item.programName || "an activity"}</span></span>}
                subtitle={item.circleName || "Your circle"}
                color={C.lilac}
                onAction={() => onNavigateToTab("circles")}
              />
            ))}
            {/* If circles exist but no pending or feed, show a subtle prompt */}
            {pendingRequests.length === 0 && activeFeed.length === 0 && circles.length > 0 && (
              <CircleCard
                icon={"\u2B50"}
                iconBg="rgba(45,159,111,0.12)"
                title={<span>Share programs with your {circles.length} circle{circles.length > 1 ? "s" : ""}</span>}
                subtitle="Keep families in the loop"
                color={C.seaGreen}
                onAction={() => onNavigateToTab("circles")}
              />
            )}
          </div>
        </div>
      )}

      {/* ══ 5. This Week (hidden if empty) ══ */}
      {thisWeekPrograms.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader label="This week" action="Full schedule" onAction={() => onNavigateToTab("schedule")} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {thisWeekPrograms.slice(0, 5).map((p) => (
              <ProgramRow key={p.id} p={p} kids={kids} onTap={() => onOpenDetail(p)} />
            ))}
          </div>
        </div>
      )}

      {/* ══ 6. Starting Next Week (hidden if empty) ══ */}
      {nextWeekPrograms.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader label="Starting next week" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {nextWeekPrograms.slice(0, 5).map((p) => (
              <ProgramRow key={p.id} p={p} kids={kids} onTap={() => onOpenDetail(p)} />
            ))}
          </div>
        </div>
      )}

      {/* ══ 7. Budget Snapshot ══ */}
      <div style={{ marginBottom: 20 }}>
        <SectionHeader label="Budget snapshot" action="Budget tab" onAction={() => onNavigateToTab("budget")} />
        <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)", padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <div>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, color: C.ink }}>{fmt$(filteredSpent)}</span>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginLeft: 4 }}>committed</span>
            </div>
            {budgetGoal > 0 && (
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>of {fmt$(budgetGoal)}</span>
            )}
          </div>
          {/* Stacked progress bar */}
          {(() => {
            const total = budgetGoal > 0 ? budgetGoal : (filteredSpent + filteredPending);
            if (total <= 0) return null;
            const enrolledPct = Math.min((filteredSpent / total) * 100, 100);
            const pendingPct = Math.min((filteredPending / total) * 100, 100 - enrolledPct);
            return (
              <div style={{ background: "rgba(27,36,50,0.06)", borderRadius: 6, height: 10, overflow: "hidden", marginBottom: 14, display: "flex" }}>
                {enrolledPct > 0 && (
                  <div style={{ height: "100%", width: `${enrolledPct}%`, background: C.seaGreen, borderRadius: enrolledPct >= 100 ? 6 : "6px 0 0 6px" }} />
                )}
                {pendingPct > 0 && (
                  <div style={{ height: "100%", width: `${pendingPct}%`, background: `${C.lilac}80`, borderRadius: (enrolledPct <= 0 && pendingPct >= 100) ? 6 : enrolledPct <= 0 ? "6px 0 0 6px" : pendingPct + enrolledPct >= 100 ? "0 6px 6px 0" : 0 }} />
                )}
              </div>
            );
          })()}
          {/* Budget status text */}
          {budgetGoal > 0 && (
            <div style={{ marginBottom: 10 }}>
              {filteredSpent + filteredPending > budgetGoal ? (
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.danger }}>
                  {fmt$(filteredSpent + filteredPending - budgetGoal)} over budget
                </span>
              ) : (
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.seaGreen }}>
                  {fmt$(budgetGoal - filteredSpent - filteredPending)} remaining
                </span>
              )}
            </div>
          )}
          {/* Legend */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Enrolled", amount: filteredSpent, dot: C.seaGreen },
              { label: "Pending", amount: filteredPending, dot: C.lilac },
              ...(budgetGoal > 0 ? [{ label: "Remaining", amount: Math.max(budgetGoal - filteredSpent - filteredPending, 0), dot: "rgba(27,36,50,0.12)" }] : []),
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: b.dot, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, fontWeight: 600 }}>{b.label}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.ink, fontWeight: 600 }}>{fmt$(b.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ 8. Quick Actions (2x2) ══ */}
      <div style={{ marginBottom: 20 }}>
        <SectionHeader label="Quick actions" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            {
              label: "Add a program", bgColor: C.seaGreen, action: onOpenAddProgram,
              svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
            },
            {
              label: "Add a kid", bgColor: C.blue, action: onOpenAddKid,
              svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
            },
            {
              label: "Add a co-parent", bgColor: C.olive, action: onInviteCoParent,
              svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="3"/><path d="M1 20v-1.5A3.5 3.5 0 0 1 4.5 15h5A3.5 3.5 0 0 1 13 18.5V20"/><circle cx="17" cy="7" r="3"/><path d="M11 20v-1.5a3.5 3.5 0 0 1 3.5-3.5h5a3.5 3.5 0 0 1 3.5 3.5V20"/></svg>,
            },
            {
              label: "Create a circle", bgColor: C.lilac, action: () => onNavigateToTab("circles"),
              svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>,
            },
          ].map((a, i) => (
            <button key={i} onClick={a.action} style={{
              background: C.white, border: "none", borderRadius: 12,
              boxShadow: "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)",
              padding: "14px 14px",
              display: "flex", alignItems: "center", gap: 10,
              cursor: "pointer", transition: "all 0.2s",
              fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600,
              color: C.ink, textAlign: "left",
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: 10, background: a.bgColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>{a.svg}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ 9. Install Banner ══ */}
      {showInstallBanner && !window.matchMedia("(display-mode: standalone)").matches && (
        <div style={{
          background: `linear-gradient(135deg, ${C.ink} 0%, #2E4A3C 100%)`,
          borderRadius: 14,
          padding: "14px 16px",
          margin: "0 0 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>{"\uD83D\uDCF2"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.cream, marginBottom: 3 }}>
              Install Skeddo
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#B0C4B6", lineHeight: 1.4 }}>
              {installPrompt
                ? "Add Skeddo to your home screen for quick access."
                : /iPad|iPhone|iPod/.test(navigator.userAgent)
                  ? "Tap the share button in your browser, then \"Add to Home Screen\"."
                  : "Tap \u22EE (menu) in Chrome, then \"Add to Home Screen\"."
              }
            </div>
          </div>
          {installPrompt && (
            <button
              onClick={onInstallClick}
              style={{
                background: C.seaGreen,
                color: C.cream,
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Install
            </button>
          )}
          <button
            onClick={onDismissInstall}
            aria-label="Dismiss"
            style={{
              background: "none",
              border: "none",
              color: C.muted,
              fontSize: 18,
              cursor: "pointer",
              padding: "0 2px",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {"\u00D7"}
          </button>
        </div>
      )}

      {/* ══ Feedback & Bug Report ══ */}
      <div style={{
        marginTop: 8, borderRadius: 14, padding: "16px 18px",
        background: `linear-gradient(135deg, ${C.blue} 0%, #1E4A6E 100%)`,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 700, color: C.cream }}>
          Help us improve Skeddo
        </div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
          Your feedback shapes what we build next. Found a bug or have an idea? We'd love to hear it.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => window.open("mailto:skeddo.planner@gmail.com?subject=Bug%20Report", "_blank")}
            style={{
              flex: 1, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 10, padding: "10px 12px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.cream,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Report Bug
          </button>
          <button
            onClick={() => window.open("mailto:skeddo.planner@gmail.com?subject=Feedback", "_blank")}
            style={{
              flex: 1, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 10, padding: "10px 12px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.cream,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Feedback
          </button>
        </div>
      </div>

    </div>
  );
}
