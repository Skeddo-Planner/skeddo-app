import { C } from "../constants/brand";

/**
 * GuestTabPreview — shows a realistic sample preview of a tab
 * with a frosted overlay prompting guests to sign up.
 */

/* ── Sample schedule data ── */
const SAMPLE_SCHEDULE = [
  { day: "Mon", programs: [
    { name: "Soccer Skills Camp", provider: "City of Vancouver", time: "9:00 AM – 12:00 PM", color: C.seaGreen },
    { name: "Art Adventures", provider: "Britannia Community Centre", time: "1:00 PM – 4:00 PM", color: C.blue },
  ]},
  { day: "Tue", programs: [
    { name: "Coding for Kids", provider: "Code Ninjas", time: "9:30 AM – 12:30 PM", color: "#8B5CF6" },
  ]},
  { day: "Wed", programs: [
    { name: "Soccer Skills Camp", provider: "City of Vancouver", time: "9:00 AM – 12:00 PM", color: C.seaGreen },
    { name: "Swim Lessons", provider: "Hillcrest Pool", time: "2:00 PM – 3:00 PM", color: "#06B6D4" },
  ]},
  { day: "Thu", programs: [
    { name: "Coding for Kids", provider: "Code Ninjas", time: "9:30 AM – 12:30 PM", color: "#8B5CF6" },
  ]},
  { day: "Fri", programs: [
    { name: "Soccer Skills Camp", provider: "City of Vancouver", time: "9:00 AM – 12:00 PM", color: C.seaGreen },
    { name: "Nature Explorers", provider: "Metro Vancouver Parks", time: "1:00 PM – 3:30 PM", color: "#22C55E" },
  ]},
];

/* ── Sample programs list ── */
const SAMPLE_PROGRAMS = [
  { name: "Soccer Skills Camp", provider: "City of Vancouver", kid: "Emma", dates: "Jul 7 – Jul 11", status: "Enrolled", cost: "$185", days: "Mon, Wed, Fri" },
  { name: "Coding for Kids", provider: "Code Ninjas", kid: "Emma", dates: "Jul 7 – Jul 25", status: "Enrolled", cost: "$350", days: "Tue, Thu" },
  { name: "Art Adventures", provider: "Britannia Cmty Centre", kid: "Emma", dates: "Jul 7 – Jul 11", status: "Waitlist", cost: "$120", days: "Mon" },
  { name: "Swim Lessons", provider: "Hillcrest Pool", kid: "Liam", dates: "Jul 7 – Aug 22", status: "Enrolled", cost: "$95", days: "Wed" },
  { name: "Nature Explorers", provider: "Metro Vancouver Parks", kid: "Liam", dates: "Jul 7 – Jul 11", status: "Exploring", cost: "$160", days: "Fri" },
];

/* ── Sample circles data ── */
const SAMPLE_CIRCLES = [
  { name: "Grade 2 Parents", emoji: "👨‍👩‍👧", members: 8, recent: "Sarah shared Art Adventures" },
  { name: "Swim Team Families", emoji: "🏊", members: 5, recent: "Mike shared Swim Lessons" },
];

const STATUS_COLORS = {
  Enrolled: C.seaGreen,
  Waitlist: "#E76F51",
  Exploring: C.blue,
};

function SchedulePreview() {
  return (
    <div style={{ padding: "0 16px" }}>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, color: C.ink, margin: "0 0 4px" }}>Schedule</h1>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, margin: "0 0 16px" }}>Week of July 7 – July 11</p>
      <div style={{ display: "flex", gap: 8 }}>
        {SAMPLE_SCHEDULE.map((day) => (
          <div key={day.day} style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
              color: C.muted, textTransform: "uppercase", letterSpacing: 0.5,
              textAlign: "center", marginBottom: 8,
            }}>{day.day}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {day.programs.map((p, i) => (
                <div key={i} style={{
                  background: C.white, borderRadius: 8, padding: "8px 6px",
                  borderLeft: `3px solid ${p.color}`,
                  boxShadow: "0 1px 3px rgba(27,36,50,0.06)",
                }}>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600, color: C.ink, lineHeight: 1.2 }}>{p.name}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: C.muted, marginTop: 2 }}>{p.time}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramsPreview() {
  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, color: C.ink, margin: 0 }}>All programs</h1>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, margin: 0 }}>5 programs across 2 kids</p>
        </div>
        <div style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700,
          background: C.seaGreen, color: "#fff", borderRadius: 8,
          padding: "8px 16px",
        }}>+ Add</div>
      </div>
      {/* Stats row */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 8, marginBottom: 16, background: C.white, borderRadius: 12, padding: 12,
        boxShadow: "0 2px 8px rgba(27,36,50,0.07)",
      }}>
        {[
          { n: 3, label: "ENROLLED", color: C.seaGreen },
          { n: 1, label: "WAITLIST", color: "#E76F51" },
          { n: 1, label: "EXPLORING", color: C.blue },
          { n: "$630", label: "SPENT", color: C.seaGreen },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, color: C.ink }}>{s.n}</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: 0.5 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Program rows */}
      <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(27,36,50,0.07)", overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 0.8fr 1fr 0.8fr 0.8fr 0.6fr",
          padding: "10px 12px", borderBottom: `1px solid ${C.border}`,
          fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
          color: C.muted, textTransform: "uppercase", letterSpacing: 0.5,
        }}>
          <span>Program</span><span>Kid</span><span>Dates</span><span>Days</span><span>Status</span><span>Cost</span>
        </div>
        {SAMPLE_PROGRAMS.map((p, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "2fr 0.8fr 1fr 0.8fr 0.8fr 0.6fr",
            padding: "10px 12px", borderBottom: i < SAMPLE_PROGRAMS.length - 1 ? `1px solid ${C.border}` : "none",
            fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.ink, alignItems: "center",
          }}>
            <div>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{p.provider}</div>
            </div>
            <span>{p.kid}</span>
            <span style={{ fontSize: 12 }}>{p.dates}</span>
            <span style={{ fontSize: 12 }}>{p.days}</span>
            <span style={{
              fontSize: 12, fontWeight: 700, color: STATUS_COLORS[p.status],
            }}>{p.status}</span>
            <span>{p.cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CirclesPreview() {
  return (
    <div style={{ padding: "0 16px" }}>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, color: C.ink, margin: "0 0 4px" }}>Circles</h1>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, margin: "0 0 16px" }}>
        Share programs and tips with trusted parents — create a circle with co-parents, family, or friends.
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{
          flex: 1, background: C.seaGreen, color: "#fff", borderRadius: 10,
          padding: "12px 16px", fontFamily: "'Barlow', sans-serif", fontWeight: 700,
          fontSize: 14, textAlign: "center",
        }}>Create a Circle</div>
        <div style={{
          flex: 1, background: C.white, color: C.ink, borderRadius: 10,
          padding: "12px 16px", fontFamily: "'Barlow', sans-serif", fontWeight: 700,
          fontSize: 14, textAlign: "center", border: `1px solid ${C.border}`,
        }}>Join a Circle</div>
      </div>
      {SAMPLE_CIRCLES.map((c, i) => (
        <div key={i} style={{
          background: C.white, borderRadius: 12, padding: 16, marginBottom: 12,
          boxShadow: "0 2px 8px rgba(27,36,50,0.07)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>{c.emoji}</span>
            <div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 700, color: C.ink }}>{c.name}</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>{c.members} members</div>
            </div>
          </div>
          <div style={{
            marginTop: 10, padding: "8px 12px", background: C.cream, borderRadius: 8,
            fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted,
          }}>
            {c.recent}
          </div>
        </div>
      ))}
    </div>
  );
}

function BudgetPreview() {
  return (
    <div style={{ padding: "0 16px" }}>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, color: C.ink, margin: "0 0 16px" }}>Budget</h1>
      {/* Budget bar */}
      <div style={{
        background: C.white, borderRadius: 12, padding: 20, marginBottom: 16,
        boxShadow: "0 2px 8px rgba(27,36,50,0.07)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, color: C.ink }}>$630</span>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginLeft: 6 }}>committed</span>
          </div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted }}>
            of <span style={{ fontWeight: 700, color: C.ink }}>$1,500</span> budget
          </div>
        </div>
        <div style={{ height: 12, background: C.cream, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ width: "42%", height: "100%", background: C.seaGreen, borderRadius: 6 }} />
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10, fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: C.seaGreen, marginRight: 4 }} />Enrolled $630</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", marginRight: 4 }} />Pending $160</span>
        </div>
      </div>
      {/* Per-kid breakdown */}
      <div style={{
        background: C.white, borderRadius: 12, padding: 16, marginBottom: 16,
        boxShadow: "0 2px 8px rgba(27,36,50,0.07)",
      }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Per kid</div>
        {[
          { name: "Emma", amount: "$535", pct: "68%" },
          { name: "Liam", amount: "$255", pct: "32%" },
        ].map((k, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: C.cream,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink,
              }}>{k.name[0]}</div>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink }}>{k.name}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink }}>{k.amount}</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>{k.pct}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TAB_CONFIG = {
  schedule: {
    title: "Plan your week at a glance",
    description: "See all your kids' programs on one weekly calendar. Spot conflicts, find free time, and share the schedule with co-parents.",
    Preview: SchedulePreview,
  },
  programs: {
    title: "Track every program in one place",
    description: "Keep tabs on enrolled, waitlisted, and programs you're exploring. Never miss a registration deadline.",
    Preview: ProgramsPreview,
  },
  circles: {
    title: "Get recommendations from parents you trust",
    description: "Create circles with friends and school parents to share camp picks, compare notes, and discover programs together.",
    Preview: CirclesPreview,
  },
  budget: {
    title: "Stay on top of summer spending",
    description: "Set a budget, track costs per kid, and see where your money is going across all programs.",
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
      <div style={{ paddingTop: 16, opacity: 0.55, filter: "blur(1px)", pointerEvents: "none", userSelect: "none" }}>
        <Preview />
      </div>

      {/* Signup overlay */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(180deg, rgba(248,249,250,0.3) 0%, rgba(248,249,250,0.92) 50%, rgba(248,249,250,0.98) 100%)",
        zIndex: 10,
      }}>
        <div style={{
          background: C.white, borderRadius: 16, padding: "32px 28px", maxWidth: 400,
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(27,36,50,0.12), 0 2px 8px rgba(27,36,50,0.06)",
        }}>
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: `rgba(45,159,111,0.1)`, margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.seaGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
          </div>

          <h2 style={{
            fontFamily: "'Poppins', sans-serif", fontSize: 20, color: C.ink,
            margin: "0 0 8px", lineHeight: 1.3,
          }}>{title}</h2>
          <p style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 15, color: C.muted,
            margin: "0 0 24px", lineHeight: 1.5,
          }}>{description}</p>

          <button
            onClick={onSignUp}
            style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 700,
              background: C.seaGreen, color: "#fff", border: "none", borderRadius: 10,
              padding: "14px 32px", cursor: "pointer", width: "100%",
              transition: "background 0.15s",
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
            100% free. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
