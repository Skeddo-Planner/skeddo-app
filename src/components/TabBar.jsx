import { C } from "../constants/brand";
import { s } from "../styles/shared";

/* ─── SVG tab icons in brand colours ─── */
const TabIcon = ({ id, color }) => {
  const sz = 20;
  const props = { width: sz, height: sz, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

  switch (id) {
    case "home":
      return (
        <svg {...props}>
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5z" />
          <polyline points="9 22 9 15 15 15 15 22" />
        </svg>
      );
    case "discover":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      );
    case "schedule":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "programs":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="7" y1="8" x2="17" y2="8" />
          <line x1="7" y1="12" x2="17" y2="12" />
          <line x1="7" y1="16" x2="13" y2="16" />
        </svg>
      );
    case "circles":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="10" r="3" />
          <path d="M6.5 18.5C7.5 15.5 9.5 14 12 14s4.5 1.5 5.5 4.5" />
        </svg>
      );
    case "budget":
      return (
        <svg {...props}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    default:
      return null;
  }
};

const TABS = [
  { id: "discover", label: "Discover" },
  { id: "schedule", label: "Schedule" },
  { id: "programs", label: "Programs" },
  { id: "circles", label: "Circles" },
  { id: "budget", label: "Budget" },
];

export default function TabBar({ tab, setTab, badges }) {
  return (
    <nav style={s.tabBar} className="skeddo-tabbar">
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            style={{
              ...s.tabBtn,
              color: active ? C.seaGreen : C.muted,
            }}
            onClick={() => setTab(t.id)}
            aria-label={t.label}
          >
            {active && <span style={s.tabIndicator} />}
            <span style={{ position: "relative" }}>
              <TabIcon id={t.id} color={active ? C.seaGreen : "#4A6FA5"} />
              {badges?.[t.id] > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -6,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "#E74C3C", color: "#fff",
                  fontSize: 9, fontWeight: 700, fontFamily: "'Barlow', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {badges[t.id] > 9 ? "9+" : badges[t.id]}
                </span>
              )}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.3,
                textTransform: "uppercase",
              }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export { TABS };
