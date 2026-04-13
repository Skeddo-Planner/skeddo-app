import { C } from "../constants/brand";

/**
 * GuestTabPreview — shows a realistic, visually rich preview of each tab
 * with a frosted overlay prompting guests to sign up.
 */

/* ── Sample schedule data (weekly calendar view) ── */
const SCHEDULE_WEEK = [
  {
    day: "Mon", date: "Jul 7",
    programs: [
      { name: "Soccer Skills Camp", time: "9:00–12:00", kid: "Emma", color: C.seaGreen, icon: "\u26BD" },
      { name: "Art Adventures", time: "1:00–4:00", kid: "Emma", color: "#8B5CF6", icon: "\uD83C\uDFA8" },
    ],
  },
  {
    day: "Tue", date: "Jul 8",
    programs: [
      { name: "Coding for Kids", time: "9:30–12:30", kid: "Liam", color: "#3B82F6", icon: "\uD83D\uDCBB" },
      { name: "Swim Club", time: "2:00–3:30", kid: "Emma", color: "#06B6D4", icon: "\uD83C\uDFCA" },
    ],
  },
  {
    day: "Wed", date: "Jul 9",
    programs: [
      { name: "Soccer Skills Camp", time: "9:00–12:00", kid: "Emma", color: C.seaGreen, icon: "\u26BD" },
      { name: "Science Explorers", time: "1:00–3:30", kid: "Liam", color: "#F59E0B", icon: "\uD83D\uDD2C" },
    ],
  },
  {
    day: "Thu", date: "Jul 10",
    programs: [
      { name: "Coding for Kids", time: "9:30–12:30", kid: "Liam", color: "#3B82F6", icon: "\uD83D\uDCBB" },
      { name: "Dance Camp", time: "1:00–3:00", kid: "Emma", color: "#EC4899", icon: "\uD83D\uDC83" },
    ],
  },
  {
    day: "Fri", date: "Jul 11",
    programs: [
      { name: "Soccer Skills Camp", time: "9:00–12:00", kid: "Emma", color: C.seaGreen, icon: "\u26BD" },
      { name: "Nature Explorers", time: "10:00–2:00", kid: "Liam", color: "#22C55E", icon: "\uD83C\uDF3F" },
    ],
  },
];

/* ── Sample planner/programs data (enrollment tracker) ── */
const SAMPLE_PROGRAMS = [
  { name: "Soccer Skills Camp", provider: "City of Vancouver", kid: "Emma", dates: "Jul 7 – 11", status: "Enrolled", cost: "$185", days: "Mon, Wed, Fri", color: C.seaGreen, icon: "\u26BD", regDate: "Registered Mar 15" },
  { name: "Coding for Kids", provider: "Code Ninjas", kid: "Liam", dates: "Jul 7 – 25", status: "Enrolled", cost: "$350", days: "Tue, Thu", color: "#3B82F6", icon: "\uD83D\uDCBB", regDate: "Registered Apr 2" },
  { name: "Art Adventures", provider: "Britannia Cmty Centre", kid: "Emma", dates: "Jul 7 – 11", status: "Waitlist", cost: "$120", days: "Mon", color: "#8B5CF6", icon: "\uD83C\uDFA8", regDate: "Waitlisted Apr 5 \u2022 #3 in line" },
  { name: "Swim Club", provider: "Hillcrest Aquatic", kid: "Emma", dates: "Jul 7 – Aug 22", status: "Enrolled", cost: "$95", days: "Tue", color: "#06B6D4", icon: "\uD83C\uDFCA", regDate: "Registered Feb 20" },
  { name: "Science Explorers", provider: "Science World", kid: "Liam", dates: "Jul 7 – 11", status: "Exploring", cost: "$175", days: "Wed", color: "#F59E0B", icon: "\uD83D\uDD2C", regDate: "Opens May 1" },
  { name: "Nature Explorers", provider: "Metro Van Parks", kid: "Liam", dates: "Jul 7 – 11", status: "Enrolled", cost: "$160", days: "Fri", color: "#22C55E", icon: "\uD83C\uDF3F", regDate: "Registered Mar 28" },
  { name: "Dance Camp", provider: "Arts Umbrella", kid: "Emma", dates: "Jul 7 – 11", status: "Exploring", cost: "$210", days: "Thu", color: "#EC4899", icon: "\uD83D\uDC83", regDate: "Reg opens Apr 20" },
];

/* ── Sample circles data ── */
const SAMPLE_CIRCLES = [
  {
    name: "Grade 2 Parents \u2022 Westside",
    emoji: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67",
    members: 12,
    activities: [
      { user: "Sarah M.", action: "shared", program: "Art Adventures at Britannia", time: "2h ago", avatar: "S" },
      { user: "James K.", action: "shared", program: "Soccer Skills Camp", time: "5h ago", avatar: "J" },
      { user: "Priya R.", action: "shared", program: "Coding for Kids at Code Ninjas", time: "1d ago", avatar: "P" },
    ],
  },
  {
    name: "Swim Team Families",
    emoji: "\uD83C\uDFCA",
    members: 8,
    activities: [
      { user: "Mike L.", action: "shared", program: "Swim Club at Hillcrest", time: "3h ago", avatar: "M" },
      { user: "Lisa C.", action: "shared", program: "Water Polo Intro Camp", time: "1d ago", avatar: "L" },
    ],
  },
  {
    name: "Our Neighbourhood",
    emoji: "\uD83C\uDFE1",
    members: 6,
    activities: [
      { user: "David W.", action: "shared", program: "Nature Explorers at Stanley Park", time: "4h ago", avatar: "D" },
    ],
  },
];

const STATUS_COLORS = {
  Enrolled: C.seaGreen,
  Waitlist: "#E76F51",
  Exploring: C.blue,
};

const STATUS_ICONS = {
  Enrolled: "\u2705",
  Waitlist: "\u23F3",
  Exploring: "\uD83D\uDD0D",
};

/* ═══════════════════════════════════════════════════════
   SCHEDULE TAB — Weekly Calendar View
   ═══════════════════════════════════════════════════════ */
function SchedulePreview() {
  return (
    <div style={{ padding: "0 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink, margin: 0 }}>Weekly Schedule</h1>
        <div style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
          color: C.seaGreen, background: `rgba(45,159,111,0.08)`, borderRadius: 8,
          padding: "6px 12px",
        }}>
          Share with co-parent
        </div>
      </div>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, margin: "0 0 6px" }}>
        Week of July 7 \u2013 July 11, 2026
      </p>

      {/* Kid legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 14, fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E8DEF8", border: "2px solid #8B5CF6" }} />
          <span style={{ fontWeight: 600, color: C.ink }}>Emma</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#DBEAFE", border: "2px solid #3B82F6" }} />
          <span style={{ fontWeight: 600, color: C.ink }}>Liam</span>
        </span>
      </div>

      {/* Weekly calendar grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6,
        background: C.white, borderRadius: 14, padding: 12,
        boxShadow: "0 2px 12px rgba(27,36,50,0.08)",
      }}>
        {SCHEDULE_WEEK.map((day) => (
          <div key={day.day}>
            {/* Day header */}
            <div style={{
              textAlign: "center", marginBottom: 8, padding: "6px 0",
              background: C.cream, borderRadius: 8,
            }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{day.day}</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: C.ink }}>{day.date}</div>
            </div>
            {/* Program blocks */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {day.programs.map((p, i) => (
                <div key={i} style={{
                  background: `${p.color}0D`, borderRadius: 10, padding: "8px 7px",
                  borderLeft: `3px solid ${p.color}`,
                }}>
                  <div style={{ fontSize: 13, marginBottom: 3 }}>{p.icon}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{p.name}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: C.muted, marginTop: 3 }}>{p.time}</div>
                  <div style={{
                    fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 600,
                    color: p.kid === "Emma" ? "#8B5CF6" : "#3B82F6",
                    marginTop: 2,
                  }}>{p.kid}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Daily summary */}
      <div style={{
        marginTop: 12, padding: 14, background: C.white, borderRadius: 12,
        boxShadow: "0 2px 8px rgba(27,36,50,0.06)",
        display: "flex", justifyContent: "space-around",
      }}>
        {[
          { label: "Programs this week", value: "10", icon: "\uD83D\uDCC5" },
          { label: "Free afternoons", value: "2", icon: "\u2600\uFE0F" },
          { label: "Overlap conflicts", value: "0", icon: "\u2705" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 600, color: C.ink }}>{s.value}</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROGRAMS TAB — Enrollment Planner / Tracker
   ═══════════════════════════════════════════════════════ */
function ProgramsPreview() {
  return (
    <div style={{ padding: "0 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink, margin: 0 }}>My Planner</h1>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, margin: 0 }}>7 programs across 2 kids</p>
        </div>
        <div style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
          background: C.seaGreen, color: "#fff", borderRadius: 8,
          padding: "8px 16px", cursor: "pointer",
        }}>+ Add program</div>
      </div>

      {/* Status summary cards */}
      <div style={{ display: "flex", gap: 8, margin: "14px 0" }}>
        {[
          { count: 4, label: "Enrolled", color: C.seaGreen, bg: "rgba(45,159,111,0.08)", icon: "\u2705" },
          { count: 1, label: "Waitlisted", color: "#E76F51", bg: "rgba(231,111,81,0.08)", icon: "\u23F3" },
          { count: 2, label: "Exploring", color: C.blue, bg: "rgba(74,111,165,0.08)", icon: "\uD83D\uDD0D" },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, background: s.bg, borderRadius: 12, padding: "12px 10px",
            textAlign: "center", border: `1px solid ${s.color}20`,
          }}>
            <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: 0.5, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming registration alerts */}
      <div style={{
        background: "#FFF7ED", border: "1px solid #FDBA7440", borderRadius: 12,
        padding: "12px 14px", marginBottom: 14,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>{"\uD83D\uDD14"}</span>
        <div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: "#92400E" }}>Registration opening soon</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#B45309" }}>Science Explorers opens May 1 \u2022 Dance Camp opens Apr 20</div>
        </div>
      </div>

      {/* Program cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SAMPLE_PROGRAMS.map((p, i) => (
          <div key={i} style={{
            background: C.white, borderRadius: 14, padding: "14px 14px",
            boxShadow: "0 2px 10px rgba(27,36,50,0.07)",
            borderLeft: `4px solid ${p.color}`,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            {/* Icon */}
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: `${p.color}12`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
            }}>{p.icon}</div>
            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink }}>{p.name}</div>
                <span style={{
                  fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                  color: STATUS_COLORS[p.status], background: `${STATUS_COLORS[p.status]}12`,
                  borderRadius: 6, padding: "2px 8px", flexShrink: 0,
                }}>{STATUS_ICONS[p.status]} {p.status}</span>
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginTop: 2 }}>
                {p.provider} \u2022 {p.kid}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>{p.dates} \u2022 {p.days}</span>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.ink }}>{p.cost}</span>
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 3, fontStyle: "italic" }}>{p.regDate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CIRCLES TAB — Social recommendations
   ═══════════════════════════════════════════════════════ */
function CirclesPreview() {
  return (
    <div style={{ padding: "0 16px" }}>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink, margin: "0 0 4px" }}>Circles</h1>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, margin: "0 0 14px" }}>
        See what programs other parents in your circles are loving this summer.
      </p>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <div style={{
          flex: 1, background: C.seaGreen, color: "#fff", borderRadius: 10,
          padding: "12px 16px", fontFamily: "'Barlow', sans-serif", fontWeight: 700,
          fontSize: 14, textAlign: "center", cursor: "pointer",
        }}>+ Create a Circle</div>
        <div style={{
          flex: 1, background: C.white, color: C.ink, borderRadius: 10,
          padding: "12px 16px", fontFamily: "'Barlow', sans-serif", fontWeight: 700,
          fontSize: 14, textAlign: "center", border: `1px solid ${C.border}`, cursor: "pointer",
        }}>Join with Code</div>
      </div>

      {/* Circle cards with activity feeds */}
      {SAMPLE_CIRCLES.map((circle, ci) => (
        <div key={ci} style={{
          background: C.white, borderRadius: 14, padding: 0, marginBottom: 14,
          boxShadow: "0 2px 12px rgba(27,36,50,0.08)", overflow: "hidden",
        }}>
          {/* Circle header */}
          <div style={{
            padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{circle.emoji}</span>
              <div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 700, color: C.ink }}>{circle.name}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>{circle.members} members</div>
              </div>
            </div>
            <div style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
              color: C.seaGreen, background: `rgba(45,159,111,0.08)`, borderRadius: 6,
              padding: "4px 10px",
            }}>Share</div>
          </div>

          {/* Activity feed */}
          <div style={{ padding: "8px 16px 12px" }}>
            {circle.activities.map((act, ai) => (
              <div key={ai} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "8px 0",
                borderBottom: ai < circle.activities.length - 1 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: C.cream,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.ink,
                  flexShrink: 0,
                }}>{act.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.ink }}>
                    <span style={{ fontWeight: 700 }}>{act.user}</span> {act.action} <span style={{ fontWeight: 600, color: C.seaGreen }}>{act.program}</span>
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BUDGET TAB — Summer spending tracker
   ═══════════════════════════════════════════════════════ */
function BudgetPreview() {
  return (
    <div style={{ padding: "0 16px" }}>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink, margin: "0 0 16px" }}>Budget</h1>

      {/* Main budget card */}
      <div style={{
        background: C.white, borderRadius: 14, padding: 20, marginBottom: 14,
        boxShadow: "0 2px 12px rgba(27,36,50,0.08)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <div>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 700, color: C.ink }}>$790</span>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginLeft: 6 }}>committed</span>
          </div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted }}>
            of <span style={{ fontWeight: 700, color: C.ink }}>$2,000</span> budget
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 14, background: C.cream, borderRadius: 7, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ width: "33%", background: C.seaGreen, borderRadius: "7px 0 0 7px" }} />
            <div style={{ width: "6.5%", background: "#F59E0B" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, fontFamily: "'Barlow', sans-serif", fontSize: 13, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.seaGreen }} />
            Enrolled $660
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
            Waitlist $130
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.cream, border: `2px solid ${C.muted}` }} />
            Remaining $1,210
          </span>
        </div>
      </div>

      {/* Per-kid breakdown */}
      <div style={{
        background: C.white, borderRadius: 14, padding: 16, marginBottom: 14,
        boxShadow: "0 2px 12px rgba(27,36,50,0.08)",
      }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Spending by kid</div>
        {[
          { name: "Emma", amount: "$510", programs: 4, color: "#8B5CF6", pct: 65 },
          { name: "Liam", amount: "$280", programs: 3, color: "#3B82F6", pct: 35 },
        ].map((k, i) => (
          <div key={i} style={{ marginBottom: i === 0 ? 14 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: `${k.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: k.color,
                }}>{k.name[0]}</div>
                <div>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink }}>{k.name}</span>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginLeft: 6 }}>{k.programs} programs</span>
                </div>
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: C.ink }}>{k.amount}</div>
            </div>
            <div style={{ height: 6, background: C.cream, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${k.pct}%`, height: "100%", background: k.color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div style={{
        background: C.white, borderRadius: 14, padding: 16,
        boxShadow: "0 2px 12px rgba(27,36,50,0.08)",
      }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>By category</div>
        {[
          { cat: "Sports & Outdoors", amount: "$340", icon: "\u26BD", pct: 43 },
          { cat: "STEM & Technology", amount: "$175", icon: "\uD83D\uDCBB", pct: 22 },
          { cat: "Arts & Creative", amount: "$155", icon: "\uD83C\uDFA8", pct: 20 },
          { cat: "Nature & Science", amount: "$120", icon: "\uD83C\uDF3F", pct: 15 },
        ].map((c, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none",
          }}>
            <span style={{ fontSize: 18 }}>{c.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: C.ink }}>{c.cat}</span>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.ink }}>{c.amount}</span>
              </div>
              <div style={{ height: 4, background: C.cream, borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
                <div style={{ width: `${c.pct}%`, height: "100%", background: C.seaGreen, borderRadius: 2 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB CONFIG — maps tab IDs to previews + CTAs
   ═══════════════════════════════════════════════════════ */

const TAB_ICONS = {
  schedule: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.seaGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  programs: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.seaGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  circles: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.seaGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  budget: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.seaGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
};

const TAB_CONFIG = {
  schedule: {
    title: "See your week at a glance",
    description: "All your kids' camps and activities on one visual calendar. Spot schedule conflicts instantly, find free time slots, and share the plan with your co-parent.",
    Preview: SchedulePreview,
  },
  programs: {
    title: "Your summer planner, organized",
    description: "Track every program you're enrolled in, waitlisted for, or still exploring. Get alerts when registration opens and never miss a deadline.",
    Preview: ProgramsPreview,
  },
  circles: {
    title: "Trusted recommendations from real parents",
    description: "Create private circles with school friends, neighbours, or co-parents. See what programs they're signing up for and share your own picks.",
    Preview: CirclesPreview,
  },
  budget: {
    title: "Summer spending, under control",
    description: "Set a family budget, see costs per kid and per category, and know exactly where your money is going before the summer starts.",
    Preview: BudgetPreview,
  },
};

export default function GuestTabPreview({ tabId, onSignUp }) {
  const config = TAB_CONFIG[tabId];
  if (!config) return null;

  const { title, description, Preview } = config;

  return (
    <div style={{ position: "relative", minHeight: "calc(100dvh - 120px)" }}>
      {/* Sample preview content */}
      <div style={{ paddingTop: 16, opacity: 0.6, filter: "blur(0.5px)", pointerEvents: "none", userSelect: "none" }}>
        <Preview />
      </div>

      {/* Signup overlay */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(180deg, rgba(248,249,250,0.15) 0%, rgba(248,249,250,0.85) 40%, rgba(248,249,250,0.97) 100%)",
        zIndex: 10,
      }}>
        <div style={{
          background: C.white, borderRadius: 20, padding: "36px 32px", maxWidth: 420,
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(27,36,50,0.14), 0 2px 8px rgba(27,36,50,0.06)",
        }}>
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `rgba(45,159,111,0.08)`, margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {TAB_ICONS[tabId]}
          </div>

          <h2 style={{
            fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink,
            margin: "0 0 8px", lineHeight: 1.3,
          }}>{title}</h2>
          <p style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 15, color: C.muted,
            margin: "0 0 24px", lineHeight: 1.6,
          }}>{description}</p>

          <button
            onClick={onSignUp}
            style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 700,
              background: C.seaGreen, color: "#fff", border: "none", borderRadius: 12,
              padding: "14px 32px", cursor: "pointer", width: "100%",
              transition: "background 0.15s",
              boxShadow: "0 4px 12px rgba(45,159,111,0.3)",
            }}
            onMouseEnter={(e) => e.target.style.background = "#247F59"}
            onMouseLeave={(e) => e.target.style.background = C.seaGreen}
          >
            Sign up free
          </button>
          <p style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted,
            margin: "12px 0 0",
          }}>
            100% free \u2022 No credit card \u2022 Takes 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
