import { useState } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import useIsDesktop from "../hooks/useIsDesktop";

const MENU_ITEMS = [
  { id: "profile", label: "Profile", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8" },
  { id: "about", label: "About Skeddo", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8" },
  { id: "legal", label: "Privacy & Terms", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" },
  { id: "help", label: "Help & Contact", icon: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3|M12 17h.01", circle: { cx: 12, cy: 12, r: 10 } },
  { id: "bug", label: "Report a Bug", icon: "M8 2v4|M16 2v4|M3 10h18|M21 6v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6", mailto: "skeddo.planner@gmail.com", subject: "Bug Report" },
  { id: "feedback", label: "Leave Feedback", icon: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z", mailto: "skeddo.planner@gmail.com", subject: "Feedback" },
  { id: "signout", label: "Sign Out", icon: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4|M16 17l5-5-5-5|M21 12H9" },
];

/* Desktop navigation tab definitions with SVG path data */
const NAV_TABS = [
  { id: "discover", label: "Search", paths: ["M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0", "M16.5 16.5L21 21"] },
  { id: "schedule", label: "Schedule", paths: ["M3 4h18v18H3V4z", "M16 2v4", "M8 2v4", "M3 10h18"], rect: { x: 3, y: 4, w: 18, h: 18, rx: 2 } },
  { id: "programs", label: "Programs", paths: ["M3 3h18v18H3V3z", "M7 8h10", "M7 12h10", "M7 16h6"], rect: { x: 3, y: 3, w: 18, h: 18, rx: 2 } },
  { id: "circles", label: "Circles", paths: ["M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", "M6.5 18.5C7.5 15.5 9.5 14 12 14s4.5 1.5 5.5 4.5"] },
  { id: "budget", label: "Budget", paths: ["M12 1v22", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"] },
];

function NavTabIcon({ id, color, size = 16 }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (id) {
    case "discover":
      return (<svg {...props}><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>);
    case "schedule":
      return (<svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);
    case "programs":
      return (<svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="7" y1="8" x2="17" y2="8" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="7" y1="16" x2="13" y2="16" /></svg>);
    case "circles":
      return (<svg {...props}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6.5 18.5C7.5 15.5 9.5 14 12 14s4.5 1.5 5.5 4.5" /></svg>);
    case "budget":
      return (<svg {...props}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>);
    default:
      return null;
  }
}

function MenuIcon({ pathData, circle, color, size = 18 }) {
  const paths = pathData.split("|");
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {circle && <circle cx={circle.cx} cy={circle.cy} r={circle.r} />}
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

export default function Header({ displayName, onOpenProfile, onOpenPage, onLogoClick, onSignOut, unreadCount, onOpenActivity, onInviteCoParent, tab, setTab, badges }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const handleItemClick = (id) => {
    setMenuOpen(false);
    const item = MENU_ITEMS.find((m) => m.id === id);
    if (item?.mailto) {
      window.open(`mailto:${item.mailto}?subject=${encodeURIComponent(item.subject || "")}`, "_blank");
    } else if (id === "coparent") {
      onInviteCoParent && onInviteCoParent();
    } else if (id === "profile") {
      onOpenProfile && onOpenProfile();
    } else if (id === "signout") {
      onSignOut && onSignOut();
    } else {
      onOpenPage && onOpenPage(id);
    }
  };

  return (
    <>
      <header style={{
        ...s.header,
        ...(isDesktop ? {
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        } : {}),
      }}>
        {isDesktop ? (
          /* ─── Desktop header with inline navigation ─── */
          <>
            {/* Logo on left */}
            <div
              style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}
              onClick={onLogoClick}
              role="button"
              tabIndex={0}
              aria-label="Go to homepage"
            >
              <img
                src="/skeddo-logo-dark.png"
                alt="Skeddo"
                style={{ height: 40, width: "auto", borderRadius: 8 }}
              />
            </div>

            {/* Center navigation tabs */}
            <nav style={{ display: "flex", gap: 2, alignItems: "center" }}>
              {NAV_TABS.map((n) => {
                const active = tab === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setTab && setTab(n.id)}
                    style={{
                      background: active ? "rgba(58,158,106,0.15)" : "transparent",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 14px",
                      color: active ? C.seaGreen : "rgba(248,249,250,0.55)",
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      position: "relative",
                      letterSpacing: 0.3,
                    }}
                  >
                    <NavTabIcon id={n.id} color={active ? C.seaGreen : "rgba(248,249,250,0.55)"} size={16} />
                    {n.label}
                    {badges?.[n.id] > 0 && (
                      <span style={{
                        width: 14, height: 14, borderRadius: "50%",
                        background: "#E74C3C", color: "#fff",
                        fontSize: 9, fontWeight: 700, fontFamily: "'Barlow', sans-serif",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginLeft: 2,
                      }}>
                        {badges[n.id] > 9 ? "9+" : badges[n.id]}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right side: tagline + profile/menu */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <span style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}>
                The planner for busy families
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={onOpenActivity}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: "rgba(255,255,255,0.12)", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", position: "relative", flexShrink: 0,
                  }}
                  aria-label={`${unreadCount} new activity updates`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span style={{
                    position: "absolute", top: 2, right: 2, width: 14, height: 14,
                    borderRadius: "50%", background: "#E74C3C", color: "#fff",
                    fontSize: 8, fontWeight: 700, fontFamily: "'Barlow', sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </button>
              )}
              <button
                onClick={() => setMenuOpen(true)}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "rgba(255,255,255,0.12)", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}
                aria-label="Open menu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          /* ─── Mobile header (unchanged) ─── */
          <div style={s.headerRow}>
            <div
              style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
              onClick={onLogoClick}
              role="button"
              tabIndex={0}
              aria-label="Go to homepage"
            >
              <img
                src="/skeddo-logo-dark.png"
                alt="Skeddo"
                style={{ height: 56, width: "auto", borderRadius: 10 }}
              />
              <div>
                <div style={s.tagline}>The planner for busy families</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Notification bell */}
              {unreadCount > 0 && (
                <button
                  onClick={onOpenActivity}
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "rgba(255,255,255,0.12)", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", position: "relative", flexShrink: 0,
                  }}
                  aria-label={`${unreadCount} new activity updates`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span style={{
                    position: "absolute", top: 4, right: 4, width: 16, height: 16,
                    borderRadius: "50%", background: "#E74C3C", color: "#fff",
                    fontSize: 9, fontWeight: 700, fontFamily: "'Barlow', sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </button>
              )}
              <button
                onClick={() => setMenuOpen(true)}
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "transparent", border: "none",
                  cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0,
                }}
                aria-label="Open menu"
              >
                <span style={{ width: 18, height: 2, background: "#FFFFFF", borderRadius: 1 }} />
                <span style={{ width: 18, height: 2, background: "#FFFFFF", borderRadius: 1 }} />
                <span style={{ width: 18, height: 2, background: "#FFFFFF", borderRadius: 1 }} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Slide-out menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 300,
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(27,36,50,0.4)",
            }}
          />
          {/* Drawer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: 280,
              maxWidth: "80vw",
              background: C.white,
              boxShadow: "-4px 0 20px rgba(27,36,50,0.12)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Drawer header */}
            <div style={{
              padding: "20px 20px 16px",
              background: C.ink,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                {displayName && (
                  <div style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#FFFFFF",
                  }}>
                    {displayName}
                  </div>
                )}
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  marginTop: 2,
                }}>
                  MENU
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 24,
                  cursor: "pointer",
                  padding: 8,
                  lineHeight: 1,
                  minWidth: 44,
                  minHeight: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                &times;
              </button>
            </div>

            {/* Menu items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {MENU_ITEMS.map((item) => (
                <div key={item.id}>
                {item.id === "signout" && <div style={{ margin: "4px 20px", borderTop: `1px solid ${C.border}` }} />}
                <button
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 20px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    color: C.ink,
                    textAlign: "left",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F2F0EC"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  <MenuIcon pathData={item.icon} circle={item.circle} color={item.id === "signout" ? "#C0392B" : C.seaGreen} />
                  <span style={item.id === "signout" ? { color: "#C0392B" } : undefined}>{item.label}</span>
                </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: "16px 20px",
              borderTop: `1px solid ${C.border}`,
              fontFamily: "'Barlow', sans-serif",
              fontSize: 12,
              color: C.muted,
              textAlign: "center",
            }}>
              Skeddo · Mended with Gold Inc.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
