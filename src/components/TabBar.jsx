import { C } from "../constants/brand";
import { s } from "../styles/shared";

const TABS = [
  { id: "home", label: "Home", icon: "\u2302" },
  { id: "discover", label: "Discover", icon: "\uD83D\uDD0D" },
  { id: "schedule", label: "Schedule", icon: "\uD83D\uDCC5" },
  { id: "programs", label: "Programs", icon: "\u25A6" },
  { id: "budget", label: "Budget", icon: "$" },
];

export default function TabBar({ tab, setTab }) {
  return (
    <nav style={s.tabBar}>
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
            <span style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
            <span
              style={{
                fontSize: 10,
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
