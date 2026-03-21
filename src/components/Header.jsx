import { useState } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";

const MENU_ITEMS = [
  { id: "profile", label: "Profile", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8" },
  { id: "about", label: "About Skeddo", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8" },
  { id: "legal", label: "Privacy & Terms", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" },
  { id: "help", label: "Help & Contact", icon: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3|M12 17h.01", circle: { cx: 12, cy: 12, r: 10 } },
  { id: "signout", label: "Sign Out", icon: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4|M16 17l5-5-5-5|M21 12H9" },
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

export default function Header({ displayName, onOpenProfile, onOpenPage, onLogoClick, onSignOut, unreadCount, onOpenActivity }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleItemClick = (id) => {
    setMenuOpen(false);
    if (id === "profile") {
      onOpenProfile && onOpenProfile();
    } else if (id === "signout") {
      onSignOut && onSignOut();
    } else {
      onOpenPage && onOpenPage(id);
    }
  };

  return (
    <>
      <header style={s.header}>
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
              style={{ height: 52, width: "auto", borderRadius: 10 }}
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
                  background: "rgba(26,46,38,0.05)", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", position: "relative", flexShrink: 0,
                }}
                aria-label={`${unreadCount} new activity updates`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                background: "rgba(26,46,38,0.05)", border: "none",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0,
              }}
              aria-label="Open menu"
            >
              <span style={{ width: 18, height: 2, background: C.ink, borderRadius: 1 }} />
              <span style={{ width: 18, height: 2, background: C.ink, borderRadius: 1 }} />
              <span style={{ width: 18, height: 2, background: C.ink, borderRadius: 1 }} />
            </button>
          </div>
        </div>
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
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(26,46,38,0.4)",
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
              boxShadow: "-4px 0 20px rgba(26,46,38,0.12)",
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
                    color: C.cream,
                  }}>
                    {displayName}
                  </div>
                )}
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 11,
                  color: C.muted,
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
                  color: C.muted,
                  fontSize: 24,
                  cursor: "pointer",
                  padding: 8,
                  lineHeight: 1,
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
                    fontSize: 15,
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
              fontSize: 11,
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
