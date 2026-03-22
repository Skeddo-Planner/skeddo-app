import { useMemo, useState } from "react";
import directoryPrograms from "../data/programs.json";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import ProgramCard from "../components/ProgramCard";
import EmptyState from "../components/EmptyState";
import DeadlineAlert from "../components/DeadlineAlert";
import PromoBanner from "../components/PromoBanner";
import { fmt$ } from "../utils/helpers";

/* ─── Seasonal greeting ─── */
function getSeasonalGreeting() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return { icon: "\ud83c\udf31", season: "spring" };
  if (month >= 6 && month <= 8) return { icon: "\u2600\ufe0f", season: "summer" };
  if (month >= 9 && month <= 11) return { icon: "\ud83c\udf42", season: "fall" };
  return { icon: "\u2744\ufe0f", season: "winter" };
}


export default function HomeTab({
  enrolledPrograms,
  waitlistPrograms,
  exploringPrograms,
  totalCostEnrolled,
  kids,
  onOpenDetail,
  onCycleStatus,
  onNavigateToTab,
  onOpenAddProgram,
  onOpenAddKid,
  onEditKid,
  installPrompt,
  showInstallBanner,
  onInstallClick,
  onDismissInstall,
  activityLog,
  planAccess,
  programs,
  onInviteCoParent,
}) {
  const allPrograms = [...enrolledPrograms, ...waitlistPrograms, ...exploringPrograms];
  const totalPrograms = allPrograms.length;
  const { icon: seasonIcon, season } = getSeasonalGreeting();
  const hasPrograms = totalPrograms > 0;

  // Banners — split into kids upgrade (shows after kids row) and tips (shows later)
  const isPaid = planAccess.isPaid;
  const [dismissedBanners, setDismissBanner] = useState(new Set());
  const dismissBanner = (id) => setDismissBanner((prev) => new Set(prev).add(id));

  // Kids upgrade banner — only for free users with 2+ kids
  const showKidsBanner = !isPaid && kids.length > 1 && !dismissedBanners.has("upgrade-kids");

  // Tip banner — contextual, shows later in the page
  const tipBanner = !dismissedBanners.has("tip") ? (
    hasPrograms && !dismissedBanners.has("tip-calendar") ? "tip-calendar" :
    !hasPrograms && !dismissedBanners.has("tip-search") ? "tip-search" :
    enrolledPrograms.length === 0 && exploringPrograms.length > 0 && !dismissedBanners.has("tip-wishlist") ? "tip-wishlist" :
    null
  ) : null;

  // Derive camp types from the user's actual enrolled programs
  const enrolledCampTypes = useMemo(() => {
    const types = new Set();
    enrolledPrograms.forEach((p) => {
      let ct = p.campType;
      // If campType is missing, look it up from directory by name + provider
      if (!ct) {
        const match = directoryPrograms.find(
          (dp) => dp.name === p.name && dp.provider === p.provider
        );
        if (match) ct = match.campType;
      }
      if (ct) types.add(ct.replace(/^day camp$/i, "Day Camp"));
    });
    const arr = [...types].sort();
    if (arr.length === 0) return season;
    if (arr.length === 1) return arr[0].toLowerCase();
    if (arr.length === 2) return `${arr[0]} and ${arr[1]}`.toLowerCase();
    return (arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1]).toLowerCase();
  }, [enrolledPrograms, season]);

  return (
    <div>
      {/* Deadline alerts — programs starting soon, at the very top */}
      <DeadlineAlert
        programs={allPrograms}
        kids={kids}
        daysThreshold={5}
        onOpenDetail={onOpenDetail}
      />

      {/* Recent activity from co-parents */}
      {activityLog && activityLog.length > 0 && (
        <>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Recent Activity</h3>
          </div>
          <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(27, 36, 50, 0.07), 0 1px 3px rgba(27, 36, 50, 0.04)", padding: "12px 16px", marginBottom: 16 }}>
            {activityLog.slice(0, 5).map((log) => (
              <div key={log.id} style={{
                display: "flex", gap: 8, alignItems: "baseline",
                padding: "6px 0", borderBottom: `1px solid ${C.border}`,
                fontFamily: "'Barlow', sans-serif", fontSize: 13,
              }}>
                <span style={{ fontWeight: 600, color: C.ink }}>{log.user_name}</span>
                <span style={{ color: C.muted }}>{log.action} {log.details?.programName || "a program"}</span>
                <span style={{ color: C.muted, marginLeft: "auto", fontSize: 11, whiteSpace: "nowrap" }}>
                  {(() => {
                    const diff = Date.now() - new Date(log.created_at).getTime();
                    const mins = Math.floor(diff / 60000);
                    if (mins < 1) return "Just now";
                    if (mins < 60) return `${mins}m ago`;
                    const hrs = Math.floor(mins / 60);
                    if (hrs < 24) return `${hrs}h ago`;
                    return `${Math.floor(hrs / 24)}d ago`;
                  })()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Kids row + Add button inline */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {kids.map((k) => {
          const kidPrograms = (enrolledPrograms || []).filter(
            (p) => (p.kidIds || []).includes(k.id)
          );
          return (
            <div
              key={k.id}
              onClick={() => onEditKid && onEditKid(k)}
              role="button"
              tabIndex={0}
              aria-label={`Edit ${k.name}`}
              className="skeddo-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: k.color ? `${k.color}12` : "#ECFDF5",
                border: `1.5px solid ${k.color ? `${k.color}30` : C.border}`,
                borderRadius: 12,
                padding: "8px 12px",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <div style={{ ...s.kidAvatar, width: 32, height: 32, fontSize: 14, borderRadius: 10, background: k.color || s.kidAvatar.background }}>{k.name?.[0]?.toUpperCase() || "?"}</div>
              <div>
                <div style={{ ...s.kidName, fontSize: 13 }}>{k.name}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>{kidPrograms.length} enrolled</div>
              </div>
            </div>
          );
        })}
        {kids.length < planAccess.maxKids && (
        <button
          onClick={onOpenAddKid}
          aria-label="Add a new kid"
          className="skeddo-card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: C.white,
            border: `1.5px dashed ${C.border}`,
            borderRadius: 12,
            padding: "8px 14px",
            cursor: "pointer",
            flexShrink: 0,
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: C.seaGreen,
          }}
        >
          + Add kid
        </button>
        )}
      </div>

      {/* Kids upgrade banner — right below kids row */}
      {showKidsBanner && (
        <PromoBanner type="upgrade-kids" onDismiss={() => dismissBanner("upgrade-kids")} />
      )}

      {/* Program limit banner — free users at or over limit */}
      {(programs || allPrograms).length >= planAccess.maxPrograms && !planAccess.isPaid && !dismissedBanners.has("upgrade-programs") && (
        <PromoBanner type="upgrade-programs" onDismiss={() => dismissBanner("upgrade-programs")} />
      )}

      {/* Stats grid */}
      <div style={s.statsGrid} className="stats-grid">
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.seaGreen}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("programs", "Enrolled")}
          className="skeddo-card"
          role="button"
          tabIndex={0}
          aria-label={`${enrolledPrograms.length} enrolled programs. Tap to view.`}
        >
          <div style={s.statNum}>{enrolledPrograms.length}</div>
          <div style={s.statLabel}>ENROLLED</div>
        </div>
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.olive}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("programs", "Waitlist")}
          className="skeddo-card"
          role="button"
          tabIndex={0}
          aria-label={`${waitlistPrograms.length} waitlisted programs. Tap to view.`}
        >
          <div style={s.statNum}>{waitlistPrograms.length}</div>
          <div style={s.statLabel}>WAITLIST</div>
        </div>
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.blue}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("programs", "Exploring")}
          className="skeddo-card"
          role="button"
          tabIndex={0}
          aria-label={`${exploringPrograms.length} programs being explored. Tap to view.`}
        >
          <div style={s.statNum}>{exploringPrograms.length}</div>
          <div style={s.statLabel}>EXPLORING</div>
        </div>
        <div
          style={{ ...s.statBox, borderLeft: `3px solid ${C.lilac}`, cursor: "pointer" }}
          onClick={() => onNavigateToTab("budget")}
          className="skeddo-card"
          role="button"
          tabIndex={0}
          aria-label={`${fmt$(totalCostEnrolled)} committed. Tap to view budget.`}
        >
          <div style={s.statNum}>{fmt$(totalCostEnrolled)}</div>
          <div style={s.statLabel}>SPENT</div>
        </div>
      </div>

      {/* Deadline alerts moved to top — see above */}


      {/* Contextual tip/upgrade banner */}
      {tipBanner && (
        <PromoBanner
          type={tipBanner}
          onDismiss={() => { dismissBanner(tipBanner); dismissBanner("tip"); }}
        />
      )}

      {/* Install banner — hide when actually running as installed PWA */}
      {showInstallBanner && !window.matchMedia("(display-mode: standalone)").matches && (
        <div style={{
          background: `linear-gradient(135deg, ${C.ink} 0%, #2E4A3C 100%)`,
          borderRadius: 14,
          padding: "14px 16px",
          margin: "0 0 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>{"\uD83D\uDCF2"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: C.cream, marginBottom: 3 }}>
              Install Skeddo
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#B0C4B6", lineHeight: 1.4 }}>
              {installPrompt
                ? "Add Skeddo to your home screen for quick access."
                : /iPad|iPhone|iPod/.test(navigator.userAgent)
                  ? "Tap the share button in your browser, then \"Add to Home Screen\"."
                  : "Tap \u22EE (menu) in Chrome, then \"Add to Home Screen\"."
              }
            </div>
          </div>
          {installPrompt && (
            <button
              onClick={onInstallClick}
              style={{
                background: C.seaGreen,
                color: C.cream,
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Install
            </button>
          )}
          <button
            onClick={onDismissInstall}
            aria-label="Dismiss"
            style={{
              background: "none",
              border: "none",
              color: C.muted,
              fontSize: 18,
              cursor: "pointer",
              padding: "0 2px",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {"\u00D7"}
          </button>
        </div>
      )}

      {/* Enrolled Programs — only show active (not past) */}
      {(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const activeEnrolled = enrolledPrograms.filter((p) =>
          !p.endDate || new Date(p.endDate + "T00:00:00") >= now
        );
        return (
          <>
            <div style={s.sectionHeader}>
              <h3 style={s.sectionTitle}>Enrolled Programs</h3>
              <button
                style={s.seeAll}
                onClick={() => onNavigateToTab("programs", "Enrolled")}
                aria-label="See all enrolled programs"
              >
                See all &rarr;
              </button>
            </div>
            {activeEnrolled.length === 0 && (
              <EmptyState icon={"\u2600\uFE0F"} message="No upcoming enrolled programs. Browse the Discover tab!" />
            )}
            <div className="home-programs-grid">
              {activeEnrolled.slice(0, 4).map((p) => (
                <ProgramCard
                  key={p.id}
                  p={p}
                  kids={kids}
                  onTap={() => onOpenDetail(p)}
                  onStatusTap={() => onCycleStatus(p.id)}
                />
              ))}
            </div>
          </>
        );
      })()}

      {/* Waitlist */}
      {waitlistPrograms.length > 0 && (
        <>
          <div style={{ ...s.sectionHeader, marginTop: 24 }}>
            <h3 style={s.sectionTitle}>On the Waitlist</h3>
            <button
              style={s.seeAll}
              onClick={() => onNavigateToTab("programs", "Waitlist")}
              aria-label="See all waitlisted programs"
            >
              See all &rarr;
            </button>
          </div>
          {waitlistPrograms.slice(0, 3).map((p) => (
            <ProgramCard
              key={p.id}
              p={p}
              kids={kids}
              onTap={() => onOpenDetail(p)}
              onStatusTap={() => onCycleStatus(p.id)}
            />
          ))}
        </>
      )}

      {/* Exploring */}
      {exploringPrograms.length > 0 && (
        <>
          <div style={{ ...s.sectionHeader, marginTop: 24 }}>
            <h3 style={s.sectionTitle}>Exploring</h3>
            <button
              style={s.seeAll}
              onClick={() => onNavigateToTab("programs", "Exploring")}
              aria-label="See all programs being explored"
            >
              See all &rarr;
            </button>
          </div>
          {exploringPrograms.slice(0, 2).map((p) => (
            <ProgramCard
              key={p.id}
              p={p}
              kids={kids}
              onTap={() => onOpenDetail(p)}
              onStatusTap={() => onCycleStatus(p.id)}
            />
          ))}
        </>
      )}

      {/* Feedback & Bug Report */}
      <div style={{
        marginTop: 28, borderRadius: 14, padding: "16px 18px",
        background: `linear-gradient(135deg, ${C.blue} 0%, #1E4A6E 100%)`,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 700, color: C.cream }}>
          Help us improve Skeddo
        </div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
          Your feedback shapes what we build next. Found a bug or have an idea? We'd love to hear it.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => window.open("mailto:skeddo.planner@gmail.com?subject=Bug%20Report", "_blank")}
            style={{
              flex: 1, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 10, padding: "10px 12px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.cream,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Report Bug
          </button>
          <button
            onClick={() => window.open("mailto:skeddo.planner@gmail.com?subject=Feedback", "_blank")}
            style={{
              flex: 1, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 10, padding: "10px 12px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.cream,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Feedback
          </button>
        </div>
      </div>

    </div>
  );
}
