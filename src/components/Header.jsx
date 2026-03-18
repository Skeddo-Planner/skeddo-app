import { C } from "../constants/brand";
import { s } from "../styles/shared";

export default function Header({ onSignOut }) {
  return (
    <header style={s.header}>
      <div style={s.headerRow}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/skeddo-logo-dark.png"
            alt="Skeddo"
            style={{ height: 40, width: "auto", borderRadius: 8 }}
          />
          <div>
            <div style={s.tagline}>The summer planner for busy families</div>
          </div>
        </div>
        {onSignOut && (
          <button
            onClick={onSignOut}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              fontFamily: "'Barlow', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: C.muted,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
}
