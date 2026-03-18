import { C } from "../constants/brand";
import { s } from "../styles/shared";

export default function Header({ displayName, onOpenProfile }) {
  const initial = displayName
    ? displayName.charAt(0).toUpperCase()
    : null;

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
        {onOpenProfile && (
          <button
            onClick={onOpenProfile}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: initial
                ? `linear-gradient(135deg, ${C.seaGreen}, ${C.blue})`
                : "rgba(255,255,255,0.1)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
            aria-label="Open profile"
          >
            {initial ? (
              <span style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 17,
                color: C.cream,
                fontWeight: 400,
                lineHeight: 1,
              }}>
                {initial}
              </span>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
