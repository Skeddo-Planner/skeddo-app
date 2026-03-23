import { C, STATUS_MAP } from "../constants/brand";

/* ─── Sidebar section wrapper ─── */
function SidebarSection({ label, children }) {
  return (
    <div className="skeddo-sidebar-section">
      <div className="skeddo-sidebar-label">{label}</div>
      {children}
    </div>
  );
}

/* ─── Sidebar item (clickable row) ─── */
function SidebarItem({ active, onClick, children, badge, dot }) {
  return (
    <button
      className={`skeddo-sidebar-item${active ? " active" : ""}`}
      onClick={onClick}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {dot && (
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: dot, flexShrink: 0,
          }} />
        )}
        {children}
      </span>
      {badge !== undefined && badge !== null && (
        <span style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 11,
          color: C.muted,
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* ─── Quick stats box ─── */
function QuickStats({ stats }) {
  return (
    <div style={{
      background: C.cream,
      borderRadius: 8,
      padding: 12,
    }}>
      {stats.map((st, i) => (
        <div key={i} style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 12,
          color: st.color || C.muted,
          lineHeight: 1.8,
        }}>
          {st.label}
        </div>
      ))}
    </div>
  );
}

/* ─── Add button (dashed) ─── */
function DashedButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "10px 12px",
        background: "none",
        border: `1.5px dashed ${C.border}`,
        borderRadius: 8,
        fontFamily: "'Barlow', sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: C.muted,
        cursor: "pointer",
        transition: "all 0.1s",
        marginTop: 8,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.seaGreen;
        e.currentTarget.style.color = C.seaGreen;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.color = C.muted;
      }}
    >
      + {label}
    </button>
  );
}

/* ─── Programs sidebar ─── */
function ProgramsSidebar({ programs, kids, statusFilter, onStatusFilter, kidFilter, onKidFilter, onOpenAddProgram }) {
  const enrolled = programs.filter((p) => p.status === "Enrolled").length;
  const waitlist = programs.filter((p) => p.status === "Waitlist").length;
  const exploring = programs.filter((p) => p.status === "Exploring").length;
  const committed = programs.filter((p) => p.status === "Enrolled").reduce((s, p) => s + Number(p.cost || 0), 0);

  return (
    <>
      <SidebarSection label="Filter by Status">
        <SidebarItem active={statusFilter === "All"} onClick={() => onStatusFilter("All")} badge={programs.length}>
          All programs
        </SidebarItem>
        <SidebarItem active={statusFilter === "Enrolled"} onClick={() => onStatusFilter("Enrolled")} badge={enrolled} dot={C.seaGreen}>
          Enrolled
        </SidebarItem>
        <SidebarItem active={statusFilter === "Waitlist"} onClick={() => onStatusFilter("Waitlist")} badge={waitlist} dot={C.olive}>
          Waitlist
        </SidebarItem>
        <SidebarItem active={statusFilter === "Exploring"} onClick={() => onStatusFilter("Exploring")} badge={exploring} dot={C.blue}>
          Exploring
        </SidebarItem>
      </SidebarSection>

      <SidebarSection label="Filter by Kid">
        <SidebarItem active={!kidFilter} onClick={() => onKidFilter(null)}>
          All kids
        </SidebarItem>
        {kids.map((k) => (
          <SidebarItem key={k.id} active={kidFilter === k.id} onClick={() => onKidFilter(k.id)}>
            {k.name}
          </SidebarItem>
        ))}
      </SidebarSection>

      <SidebarSection label="Quick Stats">
        <QuickStats stats={[
          { label: `${enrolled} enrolled` },
          { label: `${waitlist} on waitlist` },
          { label: `${exploring} exploring` },
          { label: `$${committed.toLocaleString()} committed`, color: C.seaGreen },
        ]} />
      </SidebarSection>

      <div className="skeddo-sidebar-section">
        <DashedButton label="Add a program" onClick={onOpenAddProgram} />
      </div>
    </>
  );
}

/* ─── Schedule sidebar ─── */
function ScheduleSidebar({ kids, kidFilter, onKidFilter }) {
  return (
    <>
      <SidebarSection label="Kids">
        <SidebarItem active={!kidFilter} onClick={() => onKidFilter(null)}>
          All kids
        </SidebarItem>
        {kids.map((k) => (
          <SidebarItem key={k.id} active={kidFilter === k.id} onClick={() => onKidFilter(k.id)}>
            {k.name}
          </SidebarItem>
        ))}
      </SidebarSection>
    </>
  );
}

/* ─── Budget sidebar ─── */
function BudgetSidebar({ kids, kidFilter, onKidFilter, budgetGoal, committedCost }) {
  const remaining = budgetGoal > 0 ? budgetGoal - committedCost : 0;

  return (
    <>
      <SidebarSection label="Filter by Kid">
        <SidebarItem active={!kidFilter} onClick={() => onKidFilter(null)}>
          All kids
        </SidebarItem>
        {kids.map((k) => (
          <SidebarItem key={k.id} active={kidFilter === k.id} onClick={() => onKidFilter(k.id)}>
            {k.name}
          </SidebarItem>
        ))}
      </SidebarSection>

      {budgetGoal > 0 && (
        <SidebarSection label="Budget Goal">
          <div style={{
            background: C.cream,
            borderRadius: 8,
            padding: 12,
          }}>
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11,
              color: C.muted,
              marginBottom: 4,
            }}>Budget goal</div>
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 20,
              fontWeight: 500,
              color: C.ink,
            }}>${budgetGoal.toLocaleString()}</div>
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11,
              color: remaining >= 0 ? C.seaGreen : C.olive,
              marginTop: 4,
            }}>
              ${Math.abs(remaining).toLocaleString()} {remaining >= 0 ? "remaining" : "over budget"}
            </div>
          </div>
        </SidebarSection>
      )}
    </>
  );
}

/* ─── Circles sidebar ─── */
function CirclesSidebar({ circlesHook }) {
  // Minimal circles sidebar
  return (
    <>
      <SidebarSection label="Your Circles">
        {circlesHook.circles && circlesHook.circles.length > 0 ? (
          circlesHook.circles.map((c) => (
            <SidebarItem key={c.id} active={false} onClick={() => {}}>
              {c.emoji || ""} {c.name}
            </SidebarItem>
          ))
        ) : (
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 12,
            color: C.muted,
            padding: "8px 10px",
          }}>
            No circles yet
          </div>
        )}
      </SidebarSection>
    </>
  );
}

/* ─── Discover sidebar ─── */
function DiscoverSidebar({ kids, kidFilter, onKidFilter }) {
  return (
    <>
      <SidebarSection label="Filter by Kid">
        <SidebarItem active={!kidFilter} onClick={() => onKidFilter(null)}>
          All kids
        </SidebarItem>
        {kids.map((k) => (
          <SidebarItem key={k.id} active={kidFilter === k.id} onClick={() => onKidFilter(k.id)}>
            {k.name}
          </SidebarItem>
        ))}
      </SidebarSection>
    </>
  );
}

/* ─── Home sidebar ─── */
function HomeSidebar({ kids, kidFilter, onKidFilter }) {
  return (
    <>
      <SidebarSection label="Navigation">
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 12,
          color: C.muted,
          padding: "8px 10px",
          lineHeight: 1.6,
        }}>
          Welcome to Skeddo. Use the tabs above to explore programs, manage your schedule, and track your budget.
        </div>
      </SidebarSection>

      {kids.length > 0 && (
        <SidebarSection label="Your Kids">
          {kids.map((k) => (
            <SidebarItem key={k.id} active={false} onClick={() => {}}>
              {k.name}
            </SidebarItem>
          ))}
        </SidebarSection>
      )}
    </>
  );
}

/* ─── Main export ─── */
export default function DesktopSidebar({ tab, programs, kids, kidFilter, onKidFilter, statusFilter, onStatusFilter, onOpenAddProgram, budgetGoal, committedCost, circlesHook }) {
  switch (tab) {
    case "programs":
      return <ProgramsSidebar programs={programs} kids={kids} statusFilter={statusFilter} onStatusFilter={onStatusFilter} kidFilter={kidFilter} onKidFilter={onKidFilter} onOpenAddProgram={onOpenAddProgram} />;
    case "schedule":
      return <ScheduleSidebar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />;
    case "budget":
      return <BudgetSidebar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} budgetGoal={budgetGoal} committedCost={committedCost} />;
    case "circles":
      return <CirclesSidebar circlesHook={circlesHook} />;
    case "discover":
      return <DiscoverSidebar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />;
    case "home":
      return <HomeSidebar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />;
    default:
      return null;
  }
}
