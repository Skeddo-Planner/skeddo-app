import { C } from "../constants/brand";

export const s = {
  app: { fontFamily: "'Barlow', sans-serif", background: C.cream, minHeight: "100dvh", paddingBottom: 72, maxWidth: "100%", margin: "0 auto", position: "relative" },
  header: { background: C.ink, padding: "6px 16px 5px", borderBottom: `3px solid ${C.seaGreen}` },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logoMark: { fontFamily: "'Poppins', sans-serif", fontSize: 26, color: "#FFFFFF", letterSpacing: -0.5, lineHeight: 1 },
  tagline: { fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: 0.5, marginTop: 2, textTransform: "uppercase" },
  main: { padding: "16px 16px 0" },

  welcomeCard: { background: C.white, borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(27, 36, 50, 0.07), 0 1px 3px rgba(27, 36, 50, 0.04)" },
  welcomeTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 24, color: C.ink, lineHeight: 1.2, marginBottom: 8 },
  welcomeBody: { fontFamily: "'Barlow', sans-serif", fontSize: 16, color: C.muted, lineHeight: 1.6 },

  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 },
  statBox: { background: C.white, borderRadius: 12, padding: "14px 16px", boxShadow: "0 2px 8px rgba(27, 36, 50, 0.07), 0 1px 3px rgba(27, 36, 50, 0.04)" },
  statNum: { fontFamily: "'Poppins', sans-serif", fontSize: 24, color: C.ink, lineHeight: 1 },
  statLabel: { fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 1, marginTop: 4, textTransform: "uppercase" },

  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 },
  sectionTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 18, color: C.ink },
  seeAll: { fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.seaGreen, background: "none", border: "none", cursor: "pointer", minHeight: 44, display: "inline-flex", alignItems: "center" },

  pageTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 24, color: C.ink },
  addButton: { fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 600, color: "#FFFFFF", background: C.seaGreen, border: "none", borderRadius: 8, padding: "12px 24px", cursor: "pointer", minHeight: 44 },

  programCard: { background: C.white, borderRadius: 12, padding: "14px 16px", marginBottom: 10, boxShadow: "0 2px 8px rgba(27, 36, 50, 0.07), 0 1px 3px rgba(27, 36, 50, 0.04)" },
  cardCategory: { fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  cardName: { fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 600, color: C.ink, lineHeight: 1.3, wordBreak: "break-word", overflowWrap: "break-word" },
  cardProvider: { fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginTop: 1, wordBreak: "break-word", overflowWrap: "break-word" },
  statusChip: { fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, padding: "7px 12px", borderRadius: 8, whiteSpace: "nowrap", letterSpacing: 0.3, minHeight: 44 },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` },
  cardMeta: { fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted },

  kidCard: { background: C.white, borderRadius: 12, padding: "14px 16px", marginBottom: 10, boxShadow: "0 2px 8px rgba(27, 36, 50, 0.07), 0 1px 3px rgba(27, 36, 50, 0.04)", display: "flex", alignItems: "center", gap: 12 },
  kidAvatar: { width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${C.seaGreen}, ${C.blue})`, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, flexShrink: 0 },
  kidName: { fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 700, color: C.ink },
  kidAge: { fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted },
  kidMeta: { fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.seaGreen, fontWeight: 600, marginTop: 2 },

  budgetCard: { background: C.white, borderRadius: 12, padding: "14px 16px", boxShadow: "0 2px 8px rgba(27, 36, 50, 0.07), 0 1px 3px rgba(27, 36, 50, 0.04)" },
  budgetAmount: { fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink },
  budgetLabel: { fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 1, marginTop: 2 },
  budgetRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` },
  budgetKidRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.border}` },

  filterChip: { fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", background: "transparent", transition: "all 0.12s", minHeight: 44 },

  emptyState: { textAlign: "center", padding: "32px 16px", color: C.muted, fontFamily: "'Barlow', sans-serif", fontSize: 16, lineHeight: 1.6 },

  tabBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 960, background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "6px 0 env(safe-area-inset-bottom, 8px)", zIndex: 100 },
  tabBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow', sans-serif", padding: "6px 12px", borderRadius: 8, position: "relative" },
  tabIndicator: { position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 20, height: 2.5, borderRadius: 2, background: C.seaGreen },

  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(27,36,50,0.4)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200, padding: 0 },
  modal: { background: C.white, borderRadius: "20px 20px 0 0", padding: "24px 20px env(safe-area-inset-bottom, 20px)", width: "100%", maxWidth: 600, maxHeight: "88vh", overflowY: "auto", WebkitOverflowScrolling: "touch", position: "relative" },
  modalTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink, marginBottom: 4 },

  input: { width: "100%", fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 500, border: "1.5px solid rgba(27,36,50,0.18)", borderRadius: 8, padding: "10px 14px", color: C.ink, background: C.cream, transition: "all 0.15s" },
  primaryBtn: { flex: 2, fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 600, background: C.seaGreen, color: "#FFFFFF", border: "none", borderRadius: 8, padding: "12px 24px", cursor: "pointer", minHeight: 44 },
  secondaryBtn: { flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 600, background: "transparent", color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 8, padding: "12px 24px", cursor: "pointer", minHeight: 44 },
  dangerBtn: { fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, background: C.dangerBg, color: C.danger, border: "none", borderRadius: 8, padding: "12px 14px", cursor: "pointer", transition: "all 0.15s", minHeight: 44 },

  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 },
  detailLabel: { fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1 },
  detailValue: { fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 600, color: C.ink, marginTop: 2 },

  searchBox: { width: "100%", fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 500, border: "1.5px solid rgba(27,36,50,0.18)", borderRadius: 8, padding: "11px 14px 11px 38px", color: C.ink, background: C.white, transition: "all 0.15s" },
};
