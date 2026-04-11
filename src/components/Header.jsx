import { useState, useRef, useEffect } from "react";
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

/* Desktop user dropdown items */
const USER_DROPDOWN = [
  { id: "profile", label: "Settings" },
  { id: "about", label: "About Skeddo" },
  { id: "legal", label: "Privacy & Terms" },
  { id: "help", label: "Help & Contact" },
  { id: "signout", label: "Sign Out" },
];

/* Desktop navigation tab definitions */
const NAV_TABS = [
  { id: "discover", label: "Search" },
  { id: "schedule", label: "Schedule" },
  { id: "programs", label: "Programs" },
  { id: "circles", label: "Circles" },
  { id: "budget", label: "Budget" },
];

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isDesktop = useIsDesktop();

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const handleItemClick = (id) => {
    setMenuOpen(false);
    setDropdownOpen(false);
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

  const initials = displayName
    ? displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      <header style={{
        ...(isDesktop ? {
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 52,
          background: C.white,
          borderBottom: `0.5px solid rgba(27,36,50,0.08)`,
        } : s.header),
      }}>
        {isDesktop ? (
          /* ─── Desktop header: white bg, pill tabs, user dropdown ─── */
          <>
            {/* Logo on left — same image as mobile */}
            <div
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}
              onClick={onLogoClick}
              role="button"
              tabIndex={0}
              aria-label="Go to homepage"
            >
              <img
                src="/skeddo-logo-dark.png"
                alt="Skeddo"
                style={{ height: 40, width: "auto", borderRadius: 8 }}
                fetchpriority="high"
              />
            </div>

            {/* Center: pill-style tab switcher */}
            <nav
              role="tablist"
              style={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                background: C.cream,
                borderRadius: 8,
                padding: 3,
              }}
            >
              {NAV_TABS.map((n) => {
                const active = tab === n.id;
                return (
                  <button
                    key={n.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab && setTab(n.id)}
                    style={{
                      background: active ? C.white : "transparent",
                      boxShadow: active ? "0 1px 3px rgba(27,36,50,0.06)" : "none",
                      border: "none",
                      borderRadius: 6,
                      padding: "7px 16px",
                      color: active ? C.ink : C.muted,
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 13,
                      fontWeight: active ? 500 : 400,
                      cursor: "pointer",
                      transition: "background 0.15s, color 0.15s",
                      position: "relative",
                      letterSpacing: 0.2,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.color = C.ink;
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.color = C.muted;
                    }}
                  >
                    {n.label}
                    {badges?.[n.id] > 0 && (
                      <span style={{
                        width: 14, height: 14, borderRadius: "50%",
                        background: C.danger, color: "#fff",
                        fontSize: 9, fontWeight: 700, fontFamily: "'Barlow', sans-serif",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        marginLeft: 4, verticalAlign: "middle",
                      }}>
                        {badges[n.id] > 9 ? "9+" : badges[n.id]}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: user name + avatar + dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, position: "relative" }} ref={dropdownRef}>
              <button
                onClick={onOpenActivity}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "transparent", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", position: "relative", flexShrink: 0,
                }}
                aria-label={unreadCount > 0 ? `${unreadCount} new activity updates` : "Activity"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute", top: 0, right: 0, width: 14, height: 14,
                    borderRadius: "50%", background: C.danger, color: "#fff",
                    fontSize: 8, fontWeight: 700, fontFamily: "'Barlow', sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px 0",
                }}
                aria-label="User menu"
              >
                <span style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 13,
                  color: C.muted,
                }}>
                  {displayName || "Account"}
                </span>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: C.seaGreen, color: C.white,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12, fontWeight: 500,
                }}>
                  {initials}
                </div>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 6,
                  background: C.white,
                  borderRadius: 10,
                  boxShadow: "0 4px 20px rgba(27,36,50,0.12), 0 1px 4px rgba(27,36,50,0.06)",
                  border: `0.5px solid rgba(27,36,50,0.08)`,
                  minWidth: 180,
                  padding: "6px 0",
                  zIndex: 200,
                }}>
                  {USER_DROPDOWN.map((item) => (
                    <div key={item.id}>
                      {item.id === "signout" && (
                        <div style={{ margin: "4px 12px", borderTop: `1px solid ${C.border}` }} />
                      )}
                      <button
                        onClick={() => handleItemClick(item.id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 16px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "'Barlow', sans-serif",
                          fontSize: 13,
                          fontWeight: 500,
                          color: item.id === "signout" ? C.danger : C.ink,
                          textAlign: "left",
                          transition: "background 0.1s",
                          borderRadius: 0,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = C.cream}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                      >
                        {item.label}
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              <button
                onClick={onOpenActivity}
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.12)", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", position: "relative", flexShrink: 0,
                }}
                aria-label={unreadCount > 0 ? `${unreadCount} new activity updates` : "Activity"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute", top: 4, right: 4, width: 16, height: 16,
                    borderRadius: "50%", background: C.danger, color: "#fff",
                    fontSize: 9, fontWeight: 700, fontFamily: "'Barlow', sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
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

      {/* Slide-out menu (mobile only, but works on both) */}
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
                  onMouseEnter={(e) => e.currentTarget.style.background = C.cream}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  <MenuIcon pathData={item.icon} circle={item.circle} color={item.id === "signout" ? C.danger : C.seaGreen} />
                  <span style={item.id === "signout" ? { color: C.danger } : undefined}>{item.label}</span>
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
