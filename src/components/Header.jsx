import { C } from "../constants/brand";
import { s } from "../styles/shared";

export default function Header() {
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
      </div>
    </header>
  );
}
